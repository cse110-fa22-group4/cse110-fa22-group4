const { ipcRenderer } = require('electron');

// Ensures that an event is not established multiple times by accident.
let establishedEvents = {};


/**
 * @name managedSetHTML
 * @memberOf domAPI
 * @description Sets the inner html of an element, if it is deemed 'safe.'
 * @param domID {string} The 'id' tag that the element has in the html.
 * @param html {string} The html to set to for the element.
 */
function managedSetHTML(domID, html) {
    const isAttributeSafe = ipcRenderer.invoke('managedAttributeCheck', domID, 'innerHTML')
    if (isAttributeSafe) {
        document.getElementById(domID).innerHTML = html;
    }

}

/**
 * @name managedAddEventListener
 * @memberOf domAPI
 * @description Adds an event listener to an element, if it exists and is deemed 'safe.'
 * @param {string} domID The 'id' tag that the element has in the html.
 * @param {string} event The event that is to be assigned.
 * @param {function} func The function that will run when the event triggers.
 */
function managedAddEventListener(domID, event, func) {
    const isEventSafe = ipcRenderer.invoke('managedAddEventListenerCheck', domID, event);
    const element = document.getElementById(domID);
    if (!(domID in establishedEvents)) {
        establishedEvents[domID] = [];
    }
    if (isEventSafe && !(event in establishedEvents[domID])) {
        element.addEventListener(event, () => {
            func(element);
        }, false);
        establishedEvents[domID].push(event);
    }
}
/**
 * @name managedGetAttribute
 * @memberOf domAPI
 * @description Gets the attribute of a given domID, if it exists and is deemed 'safe.'
 * @param {string} domID The 'id' tag that the element has in the html.
 * @param {string} attribute The attribute to get from the element.
 * @return {object | undefined} The attribute if the getter is successful, else undefined if either the attribute or element does not exist,
 *          or if the attribute is deemed 'unsafe.'
 */
function managedGetAttribute(domID, attribute) {
    const isAttributeSafe = ipcRenderer.invoke('managedAttributeCheck', domID, attribute);
    if (isAttributeSafe) {
        return document.getElementById(domID).getAttribute(attribute);
    }
    else
        return undefined;
}
/**
 * @name managedSetAttribute
 * @memberOf domAPI
 * @description Sets the attribute of a given domID, if it exists and is deemed 'safe.'
 * @param {string} domID The 'id' tag that the element has in the html.
 * @param {string} attribute The attribute to set on the element.
 * @param {string} value The value to set the attribute to.
 */
function managedSetAttribute(domID, attribute, value) {
    const isAttributeSafe = ipcRenderer.invoke('managedAttributeCheck', domID, attribute);
    if (isAttributeSafe) {
        document.getElementById(domID).setAttribute(attribute, value);
    }
}
/**
 * @name managedAddChild
 * @memberOf domAPI
 * @description Adds a child to the given element with the domID.
 * @param {string} domID The 'id' tag that the element has in the html.
 * @param {HTMLElement} child The child html element to add.
 */
function managedAddChild(domID, child) {
    const isChildSafe = ipcRenderer.invoke('managedChildCheck', domID);
    if (isChildSafe) {
        document.getElementById(domID).appendChild(child);
    }
}

module.exports = {
    managedAddEventListener,
    managedGetAttribute,
    managedSetAttribute,
    managedAddChild,
    managedSetHTML
}