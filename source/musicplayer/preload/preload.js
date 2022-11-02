// preload.js
const {ipcRenderer, contextBridge, app} = require('electron');
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

const {
    getSettings, writeSettings, writeToSetting, deleteSetting,
    getSongs, writeSongs, appendSong, removeSong,
    getStats, writeStats, writeToStat, deleteStat,
    getAllPlaylists, removePlaylist, writePlaylist,
    getSRCString, fsInit, devClear

} = require('./fsAPICalls');

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


// All the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', async () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector)
        if (element) element.innerText = text
    }

    for (const dependency of ['chrome', 'node', 'electron']) {
        replaceText(`${dependency}-version`, process.versions[dependency])
    }

    await fsInit(app);
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

contextBridge.exposeInMainWorld('fsAPI', {
    getSettings: getSettings,
    writeSettings: writeSettings,
    writeToSetting: writeToSetting,
    deleteSetting: deleteSetting,
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
    getSRCString: getSRCString
});