const {ipcRenderer} = require('electron');
const {Grid} = require('gridjs');
const {debugLog} = require('../general/genAPICalls');
const path = require('path');

// Ensures that an event is not established multiple times by accident.
const establishedEvents = {};


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
	const filename = temp[temp.length -2].split('/').pop();
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
 * @param {string} domID The ID of the element to add this grid to.
 * @param {any} columns The column headers as a string array.
 * @param {any} data An array of string arrays that represent rows of data,
 *                                              or a promise that returns one.
 * @param {any} params Extra grid parameters to pass into the constructor.
 * @return {Promise<Grid>} Returns the grid created.
 */
async function addGrid(domID, columns, data, params = { }) {
	// return new Grid({
	  new Grid({
		columns: columns,
		data: data,
	}).updateConfig(params).render(document.getElementById(domID))
      .on('rowClick', (...args) => alert('Play: ' + args[1].cells[1].data));
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
 * @name getAttribute
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
 * @name getValue
 * @memberOf domAPI
 * @description Gets the value of a given domID, if it exists and
 * is deemed 'safe.'
 * @param {string} domID The 'id' tag that the element has in the html.
 * @param {string} value The value to get from the element.
 * @return {Promise<object> | undefined} The value if the getter is successful, else
 * undefined if either the value or element does not exist,
 *          or if the value is deemed 'unsafe.'
 *
 */
async function getValue(domID, value) {
	const isValueSafe = await ipcRenderer.invoke('managedValueCheck', domID, value);
	if (isValueSafe) {
		return document.getElementById(domID).value;
	} else {
		return undefined;
	}
}

module.exports = {
	loadPage,
	addEventListener,
	getAttribute,
	setAttribute,
	addChild,
	setHTML,
	setStyle,
	getValue,
	addGrid,
};
