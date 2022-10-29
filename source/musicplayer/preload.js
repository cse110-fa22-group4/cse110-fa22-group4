// preload.js
const { ipcRenderer, contextBridge } = require('electron');

/**
 * @namespace domAPI
 * @description The domAPI is an api that exposes useful accessors to DOM elements, such as addEventListener and
 *              getAttribute. All calls are managed, so one cannot access sensitive information. <br>
 *              If you think that any function headers or return types should be changed, ping me on slack. - Liam
 * @type object
 */
window.domAPI = undefined;

// Ensures that an event is not established multiple times by accident.
let establishedEvents = {};

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
      const element = document.getElementById(selector)
      if (element) element.innerText = text
    }
  
    for (const dependency of ['chrome', 'node', 'electron']) {
      replaceText(`${dependency}-version`, process.versions[dependency])
    }
});

contextBridge.exposeInMainWorld('domAPI', {
    /**
     * @name managedAddEventListener
     * @memberOf domAPI
     * @description Adds an event listener to an element, if it exists and is deemed 'safe.'
     * @param domID The 'id' tag that the element has in the html.
     * @param event The event that is to be assigned.
     * @param func The function that will run when the event triggers.
     */
   managedAddEventListener: function(domID, event, func) {
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
   },
    /**
     * @name managedGetAttribute
     * @memberOf domAPI
     * @description Gets the attribute of a given domID, if it exists and is deemed 'safe.'
     * @type function
     * @param domID The 'id' tag that the element has in the html.
     * @param attribute The attribute to get from the element.
     * @return The attribute if the getter is successful, else undefined if either the attribute or element does not exist,
     *          or if the attribute is deemed 'unsafe.'
     */
    managedGetAttribute: function(domID, attribute) {
        const isAttributeSafe = ipcRenderer.invoke('managedAttributeCheck', domID, attribute);
        if (isAttributeSafe) {
            return document.getElementById(domID).getAttribute(attribute);
        }
        else
            return undefined;
    },
    /**
     * @name managedSetAttribute
     * @memberOf domAPI
     * @description Sets the attribute of a given domID, if it exists and is deemed 'safe.'
     * @type function
     * @param domID The 'id' tag that the element has in the html.
     * @param attribute The attribute to set on the element.
     * @param value The value to set the attribute to.s
     */
    managedSetAttribute: function(domID, attribute, value) {
        const isAttributeSafe = ipcRenderer.invoke('managedAttributeCheck', domID, attribute);
        if (isAttributeSafe) {
            document.getElementById(domID).setAttribute(attribute, value);
        }
    }
});