// preload.js
const {ipcRenderer, contextBridge, app} = require('electron');

const {
    onEvent,
    loadPage,
} = require('./jqAPICalls.js');

const {
    managedAddEventListener,
    managedGetAttribute,
    managedSetAttribute,
    managedAddChild,
    managedSetHTML,
    managedSetStyle,
    managedGetValue,
} = require('./domAPICalls.js');

const {
    ffmpegRead,
    ffmpegWrite,
    setPath,
    getMetadataRecursive,
} = require('./ffmpegAPICalls.js');

const {
    getSettings, writeSettings, writeToSetting, deleteSetting, getSetting,
    getSongs, writeSongs, appendSong, removeSong,
    getStats, writeStats, writeToStat, deleteStat,
    getAllPlaylists, removePlaylist, writePlaylist,
    recursiveSearchAtPath,
    getSRCString, fsInit, devClear,
} = require('./fsAPICalls');

const {
    debugLog,
} = require('./genAPICalls.js');

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

/**
 * @namespace fsAPI
 * @description The fsAPI exposes many functions to modify the settings, overall songs, stats, playlists, and get
 *              a working src filepath for any audio file.
 * @type {object}
 * @todo In general there are usually no checks to see if the file exists. These should be added, and until then
 *          this API should be used with caution.
 */
window.fsAPI = undefined;

/**
 * @namespace jqAPI
 * @description The jqAPI exposes required functions to make jquery accessible to the renderer thread without giving
 *              sudo access to any user on the console.
 * @type {object}
 */
window.jqAPI = undefined;

/**
 * @namespace genAPI
 * @description A collection of general methods useful for production and debugging.
 * @type {object}
 */
window.genAPI = undefined;

module.exports = {debugLog};

// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', async () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency]);
    }

    await fsInit();
    setPath();
});

contextBridge.exposeInMainWorld('genAPI', {
    debugLog: debugLog,
});

contextBridge.exposeInMainWorld('jqAPI', {
    onEvent: onEvent,
    loadPage: loadPage,
});

contextBridge.exposeInMainWorld('domAPI', {
    managedAddEventListener: managedAddEventListener,
    managedGetAttribute: managedGetAttribute,
    managedSetAttribute: managedSetAttribute,
    managedAddChild: managedAddChild,
    managedSetHTML: managedSetHTML,
    managedSetStyle: managedSetStyle,
    managedGetValue: managedGetValue,
});

contextBridge.exposeInMainWorld('ffmpegAPI', {
    readMetadata: ffmpegRead,
    writeMetadata: ffmpegWrite,
    setBinPath: setPath,
    getMetadataRecursive : getMetadataRecursive,
});

contextBridge.exposeInMainWorld('fsAPI', {
    getSettings: getSettings,
    writeSettings: writeSettings,
    writeToSetting: writeToSetting,
    deleteSetting: deleteSetting,
    getSetting: getSetting,
    getSongs: getSongs,
    writeSongs: writeSongs,
    appendSongs: appendSong,
    removeSong: removeSong,
    getStats: getStats,
    writeStats: writeStats,
    writeToStat: writeToStat,
    deleteStat: deleteStat,
    getAllPlaylists: getAllPlaylists,
    removePlaylist: removePlaylist,
    writePlaylist: writePlaylist,
    getSRCString: getSRCString,
    recursiveSearchAtPath: recursiveSearchAtPath,
});
