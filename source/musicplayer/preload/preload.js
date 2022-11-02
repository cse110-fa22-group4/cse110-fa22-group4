// preload.js
const {ipcRenderer, contextBridge} = require('electron');
const {
    managedAddEventListener,
    managedGetAttribute,
    managedSetAttribute,
    managedAddChild
} = require('./domAPICalls.js');

const {
    ffmpegRead,
    ffmpegWrite,
    setPath
} = require('./ffmpegAPICalls.js');


/**
 * @namespace domAPI
 * @description The domAPI is an api that exposes useful accessors to DOM elements, such as addEventListener and
 *              getAttribute. All calls are managed, so one cannot access sensitive information. <br>
 *              If you think that any function headers or return types should be changed, ping me on slack. - Liam
 * @type object
 */
window.domAPI = undefined;

/**
 * @namespace ffmpegAPI
 * @description the ffmpegAPI allows one to get and set metadata of a file.
 * @type {object}
 */
window.ffmpegAPI = undefined;


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
    managedAddEventListener: managedAddEventListener,
    managedGetAttribute: managedGetAttribute,
    managedSetAttribute: managedSetAttribute,
    managedAddChild: managedAddChild
});

contextBridge.exposeInMainWorld('ffmpegAPI', {
    readMetadata: ffmpegRead,
    writeMetadata: ffmpegWrite,
    setBinPath: setPath
});