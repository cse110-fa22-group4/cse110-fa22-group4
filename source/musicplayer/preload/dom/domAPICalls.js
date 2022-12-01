const {ipcRenderer} = require('electron');
const {Grid, h} = require('gridjs');
const {RowSelection} = require('gridjs/plugins/selection');
const {debugLog} = require('../general/genAPICalls');
const path = require('path');

// Ensures that an event is not established multiple times by accident.
const establishedEvents = {};

// holds track objects selected by the user
let selectedTracks = [];

/**
 * @name htmlFromRenderer
 * @description Gets a filepath corresponding to the actual html file path from a renderer process.
 * @param {string} htmlFile The name of the html file to get.
 * @return {Promise<string>} The actual path to the html file from a renderer process.
 */
async function htmlFromRenderer(htmlFile) {
	const htmlFilePath = await ipcRenderer.invoke('getAppPath');
	return path.join(htmlFilePath, '/../html/', htmlFile);
}

/**
 * @name loadPage
 * @memberOf domAPI
 * @description Loads a html page into an element using JQuery.
 * @param {string} targetID The ID of the element to load a html page into.
 * @param {string} htmlFile The name of the html file to load.
 * @param {function | undefined} callback An optional callback to execute.
 * @return {Promise<void>}
 */
async function loadPage(targetID, htmlFile, callback = undefined) {
	const html = require('fs').readFileSync(await htmlFromRenderer(htmlFile)).toString();
	await setHTML(targetID, html);
	const temp = htmlFile.split('.');
	const filename = temp[temp.length - 2].split('/').pop();
	await debugLog(`Broadcasting event: ${filename}-loaded`, 'broadcast-event');
	window.dispatchEvent(new Event(`${filename}-loaded`));
	if (callback) {
		await callback(document.getElementById(targetID));
	}
}

/**
 * @name setHTML
 * @memberOf domAPI
 * @description Sets the inner html of an element, if it is deemed 'safe.'
 * @param {string} domID The 'id' tag that the element has in the html.
 * @param {string} html The html to set to for the element.
 * @return {Promise<void>}
 */
async function setHTML(domID, html) {
	const isAttributeSafe = await ipcRenderer.invoke(
		'managedAttributeCheck', domID, 'innerHTML');
	if (isAttributeSafe) {
		document.getElementById(domID).innerHTML = html;
	}
}

/**
 * @name appendHTML
 * @memberOf domAPI
 * @description Appends to the inner html of an element, if it is deemed 'safe.'
 * @param {string} domID The 'id' tag that the element has in the html.
 * @param {string} html The html to set to for the element.
 * @return {Promise<void>}
 */
async function appendHTML(domID, html) {
	const isAttributeSafe = await ipcRenderer.invoke(
		'managedAttributeCheck', domID, 'innerHTML');
	if (isAttributeSafe) {
		document.getElementById(domID).innerHTML += html;
	}
}

/**
 * @param {string} domID The ID of the element to add this grid to.
 * @param {any} columns The column headers as a string array.
 * @param {any} data An array of string arrays that represent rows of data,
 *                                              or a promise that returns one.
 * @param {any} params Extra grid parameters to pass into the constructor.
 * @return {Promise<Grid>} Returns the grid created.
 * @return {Grid} The grid that is created is returned for searching purposes.
 */
async function addGrid(domID, columns, data, params = {}) {
	// return new Grid({
	// Perform this check above all
	const isAttributeSafe = await ipcRenderer.invoke(
		'managedAttributeCheck', domID, 'innerHTML');
	if (!isAttributeSafe) return undefined;


	// enable row selection
	columns.unshift(
		{
			id: 'awesomeCheckbox',
			name: '',
			plugin: {
				component: RowSelection,
				props: {id: (row) => row.cells},
			},
		},
	);

	// enable row buttons for queue
	columns.push(
		{
			name: 'Queue',
			formatter: (cell, row) => {
				return h('button', {
					className: 'gridQueueButton',
					onClick: () => {
						// function for row queue click
						// TODO: add track to queue somehow
						// alert(`${row.cells[row.cells.length - 2].data}`);
						window.dispatchEvent(new CustomEvent(`${domID}-queue-clicked`,
							{detail: row.cells[row.cells.length - 2].data}));
					},
				}, '+');
			},
		},
	);

	// construct default grid and render to page
	const grid = new Grid({
		columns: columns,
		data: data,
	})
		.updateConfig(params)
		.render(document.getElementById(domID));

	// row click action
	grid.on('rowClick', (...args) =>
		window.dispatchEvent(new CustomEvent(`${domID}-row-clicked`, {detail: args[1].cells[9].data})));

	// row selection actions
	grid.on('ready', (...args) => {
		if (data.length !== 0) {
			const checkboxPlugin = grid.config.plugin.get('awesomeCheckbox');
			checkboxPlugin.props.store.on('updated', function(state, prevState) {
				// update selectedTracks with current selection
				const currSelection = [];
				for (let i = 0; i < state.rowIds.length; i++) {
					const currTrackObj = {};
					for (let j = 1; j < columns.length; j++) {
						if (columns[j].name in data[0]) {
							const key = columns[j].name;
							currTrackObj[`${key}`] = state.rowIds[i][j].data;
						}
					}
					currSelection.push(currTrackObj);
				}
				selectedTracks = currSelection;

				// get current editor type
				const editorType = document.getElementById('editor-container').getAttribute('data-editortype');

				// playlist manager actions
				// send selected tracks to selected container
				if (editorType === 'playlists') {
					const playlistManager = document.getElementById('selected-playlists-container');
					let selectedRow = `
                    <div class="playlist-manager-header">
                    <div>Title</div>
                    <div>Artist</div>
                    <div>Album</div>
                    </div>`;
					for (let k = 0; k < selectedTracks.length; k++) {
						selectedRow += `
                        <div class="playlist-manager-row">
                        <div>${selectedTracks[k].title}</div>
                        <div>${selectedTracks[k].artist}</div>
                        <div>${selectedTracks[k].album}</div>
                        </div>`;
					}
					playlistManager.innerHTML = selectedRow;
				}

				// metadata editor actions
				// send selected tracks to playlist manager
				if (editorType === 'metadata') {
					// TODO: use selected tracks to edit metadata, MAY not need function here
				}
			});
		}
	});
}

/**
 * @name addEventListener
 * @memberOf domAPI
 * @description Adds an event listener to an element, if it exists and is
 * deemed 'safe.'
 * @param {string} domID The 'id' tag that the element has in the html.
 * @param {string} event The event that is to be assigned.
 * @param {function} func The function that will run when the event triggers.
 * @return {Promise<void>}
 */
async function addEventListener(domID, event, func) {
	const isEventSafe = await ipcRenderer.invoke(
		'managedAddEventListenerCheck', domID, event);
	const element = document.getElementById(domID);
	if (element === undefined || element === null) {
		await debugLog(`Failed to find ID: ${domID}`, 'add-event-error');
		return;
	}
	if (!(domID in establishedEvents)) {
		establishedEvents[domID] = [];
	}
	if (isEventSafe && !(event in establishedEvents[domID])) {
		element.addEventListener(event, async () => {
			await func(element);
		}, false);
		establishedEvents[domID].push(event);
	}
}

/**
 * @name addEventListenerbyClassName
 * @memberOf domAPI
 * @description Adds an event listener to an element, if it exists and is
 * deemed 'safe.'
 * @param {string} domClass The 'class' tag that the element has in the html.
 * @param {string} event The event that is to be assigned.
 * @param {function} func The function that will run when the event triggers.
 * @return {Promise<void>}
 */
async function addEventListenerbyClassName(domClass, event, func) {
	const isEventSafe = await ipcRenderer.invoke(
		'managedAddEventListenerCheck', domClass, event);
	const elements = document.getElementsByClassName(domClass);
	if (elements === undefined || elements === null) {
		await debugLog(`Failed to find ClassName: ${domClass}`, 'add-event-error');
		return;
	}
	if (!(domClass in establishedEvents)) {
		establishedEvents[domClass] = [];
	}
	if (isEventSafe && !(event in establishedEvents[domClass])) {
		for (let i = 0; i < elements.length; i++) {
			elements[i].addEventListener(event, async () => {
				await func(elements[i]);
			}, false);
		}
		establishedEvents[domClass].push(event);
	}
}

/**
 * @name getAttribute
 * @memberOf domAPI
 * @description Gets the attribute of a given domID, if it exists and is
 * deemed 'safe.'
 * @param {string} domID The 'id' tag that the element has in the html.
 * @param {string} attribute The attribute to get from the element.
 * @return {Promise<object> | undefined} The attribute if the getter is successful,
 * else undefined if either the attribute or element does not exist,
 *          or if the attribute is deemed 'unsafe.'
 */
async function getAttribute(domID, attribute) {
	const isAttributeSafe = await ipcRenderer.invoke(
		'managedAttributeCheck', domID, attribute);
	if (isAttributeSafe) {
		return document.getElementById(domID).getAttribute(attribute);
	} else {
		return undefined;
	}
}

/**
 * @name setAttribute
 * @memberOf domAPI
 * @description Sets the attribute of a given domID, if it exists and is
 * deemed 'safe.'
 * @param {string} domID The 'id' tag that the element has in the html.
 * @param {string} attribute The attribute to set on the element.
 * @param {string} value The value to set the attribute to.
 * @return {Promise<void>}
 */
async function setAttribute(domID, attribute, value) {
	const isAttributeSafe = await ipcRenderer.invoke(
		'managedAttributeCheck', domID, attribute);
	if (isAttributeSafe) {
		document.getElementById(domID).setAttribute(attribute, value);
	}
}

/**
 * @name addChild
 * @memberOf domAPI
 * @description Adds a child to the given element with the domID.
 * @param {string} domID The 'id' tag that the element has in the html.
 * @param {HTMLElement} child The child html element to add.
 * @return {Promise<void>}
 */
async function addChild(domID, child) {
	const isChildSafe = await ipcRenderer.invoke('managedChildCheck', domID);
	if (isChildSafe) {
		document.getElementById(domID).appendChild(child);
	}
}

/**
 * @name setStyle
 * @memberOf domAPI
 * @description Sets a css style to a given value if it is deemed 'safe.'
 * @param {string} domID The 'id' tag that the element has in the html.
 * @param {string} style The style to change.
 * @param {string} value The value to set the style to.
 * @return {Promise<void>}
 */
async function setStyle(domID, style, value) {
	const isChildSafe = await ipcRenderer.invoke('managedChildCheck', domID);
	if (isChildSafe) {
		document.getElementById(domID).style[style] = value;
	}
}

/**
 * @name setStyleClassToggle
 * @memberOf domAPI
 * @description Toggles a css class style to a given value if it is deemed 'safe.'
 * @param {string} domID The 'id' tag that the element has in the html.
 * @param {string} style The style to change.
 * @param {boolean} toggle Adds style class if true, otherwise remove if false.
 * @return {Promise<void>}
 */
async function setStyleClassToggle(domID, style, toggle) {
	const isChildSafe = await ipcRenderer.invoke('managedChildCheck', domID);
	if (isChildSafe) {
		if (toggle) {
			document.getElementById(domID).classList.add(style);
		} else {
			document.getElementById(domID).classList.remove(style);
		}
	}
}

/**
 * @name setProperty
 * @memberOf domAPI
 * @description Sets an arbitrary property of a given domID, if it exists and
 * is deemed 'safe.' TODO: Verify with backend that this is safe and needed.
 * @param {string} domID The 'id' tag that the element has in the html.
 * @param {string} property The property to set for the element.
 * @param {string} propertyLiteral The literal that we are setting the value to
 * @return {Promise<boolean>} The true if the setter is successful, else
 * false if the value is deemed 'unsafe.'
 *
 */
async function setProperty(domID, property, propertyLiteral) {
	const isValueSafe = await ipcRenderer.invoke('managedValueCheck', domID, property);
	if (isValueSafe) {
		document.getElementById(domID)[property] = propertyLiteral;
		return true;
	} else {
		return false;
	}
}

/**
 * @name getProperty
 * @memberOf domAPI
 * @description Gets an arbitrary property of a given domID, if it exists and
 * is deemed 'safe.' TODO: Verify with backend that this is safe and needed.
 * @param {string} domID The 'id' tag that the element has in the html.
 * @param {string} property The property to get for the element.
 * @return {Promise<object> | undefined} The true if the setter is successful, else
 * false if the value is deemed 'unsafe.'
 *
 */
async function getProperty(domID, property) {
	const isValueSafe = await ipcRenderer.invoke('managedValueCheck', domID, property);
	if (isValueSafe) {
		return document.getElementById(domID)[property];
	} else {
		return undefined;
	}
}

/**
 * @name setThemeColor
 * @memberOf domAPI
 * @description Sets the application theme color.
 * @param {string} primary The value to set for the primary theme variable.
 * @param {string} secondary The value to set for the secondary theme variable.
 *
 */
async function setThemeColor(primary, secondary) {
	if (primary !== '') {
		document.documentElement.style.setProperty('--theme-primary', primary);
	}
	if (secondary !== '') {
		document.documentElement.style.setProperty('--theme-secondary', secondary);
	}
}

/**
 * @name getSelectedTracks
 * @memberOf domAPI
 * @description Returns track objects selected by the user from a grid.
 * @return {Promise<Array>} An array of selected tracks.
 */
async function getSelectedTracks() {
	return selectedTracks;
}

module.exports = {
	loadPage,
	addEventListener,
	addEventListenerbyClassName,
	getAttribute,
	setAttribute,
	addChild,
	setHTML,
	appendHTML,
	setStyle,
	setStyleClassToggle,
	setProperty,
	getProperty,
	addGrid,
	setThemeColor,
	getSelectedTracks,
};
