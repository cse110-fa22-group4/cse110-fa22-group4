const {ipcRenderer} = require('electron');
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
 */
async function loadPage(targetID, htmlFile, callback = undefined) {
    const html = require('fs').readFileSync(await htmlFromRenderer(htmlFile)).toString();
    setHTML(targetID, html);
    const filename = htmlFile.split('.').pop().split('\\').pop();
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
 */
function setHTML(domID, html) {
    const isAttributeSafe = ipcRenderer.invoke(
        'managedAttributeCheck', domID, 'innerHTML');
    if (isAttributeSafe) {
        document.getElementById(domID).innerHTML = html;
    }
}

/**
 * @name addEventListener
 * @memberOf domAPI
 * @description Adds an event listener to an element, if it exists and is
 * deemed 'safe.'
 * @param {string} domID The 'id' tag that the element has in the html.
 * @param {string} event The event that is to be assigned.
 * @param {function} func The function that will run when the event triggers.
 */
function addEventListener(domID, event, func) {
    const isEventSafe = ipcRenderer.invoke(
        'managedAddEventListenerCheck', domID, event);
    const element = document.getElementById(domID);
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
 * @return {object | undefined} The attribute if the getter is successful,
 * else undefined if either the attribute or element does not exist,
 *          or if the attribute is deemed 'unsafe.'
 */
function getAttribute(domID, attribute) {
    const isAttributeSafe = ipcRenderer.invoke(
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
 */
function setAttribute(domID, attribute, value) {
    const isAttributeSafe = ipcRenderer.invoke(
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
 */
function addChild(domID, child) {
    const isChildSafe = ipcRenderer.invoke('managedChildCheck', domID);
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
 */
function setStyle(domID, style, value) {
    const isChildSafe = ipcRenderer.invoke('managedChildCheck', domID);
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
 * @return {object | undefined} The value if the getter is successful, else
 * undefined if either the value or element does not exist,
 *          or if the value is deemed 'unsafe.'
 *
 */
function getValue(domID, value) {
    const isValueSafe = ipcRenderer.invoke('managedValueCheck', domID, value);
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
};
