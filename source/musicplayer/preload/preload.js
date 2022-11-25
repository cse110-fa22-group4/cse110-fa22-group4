// preload.js
const {ipcRenderer, contextBridge, app} = require('electron');

const {
	addEventListener, addEventListenerbyClassName, getAttribute,
	setAttribute, addChild, setHTML, appendHTML,
	setStyle, setStyleClassToggle, loadPage,
	addGrid, setThemeColor, setProperty, getProperty, getSelectedTracks,
} = require('./dom/domAPICalls.js');

const {
	setPath,
} = require('./ffmpeg/ffmpegAPICalls.js');

const {
	ffmpegRead, ffmpegWrite,
	useMultiFFmpeg,
} = require('./ffmpeg/metadata/ffMetaAPICalls');

const {
	pauseSong, playSong, stopSong, resumeSong, seekSong,
} = require('./ffmpeg/play/playSongAPICalls');

const {
	recursiveSearchAtPath, getSRCString,
	fsInit, devClear,
} = require('./fs/fsAPICalls');

const {
	getAllPlaylists, getPlaylist,
	removePlaylist, writePlaylist,
} = require('./fs/playlists/playlistAPICalls');

const {
	appendSong, appendSongs, cullShortAudio,
	getSongs, removeSong, writeSongs,
} = require('./fs/songs/songsAPICalls');

const {
	deleteSetting, getSetting, getSettings,
	writeSettings, writeToSetting,
} = require('./fs/settings/settingsAPICalls');

const {
	deleteStat, getStats, writeStats, writeToStat,
} = require('./fs/stats/statsAPICalls');

const {
	debugLog, openDialog,
	publishGlobal, getGlobal,
	removeGlobal,
} = require('./general/genAPICalls.js');

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
 * @namespace genAPI
 * @description A collection of general methods useful for production and debugging.
 * @type {object}
 */
window.genAPI = undefined;

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
	await setPath();
});

contextBridge.exposeInMainWorld('genAPI', {
	debugLog: debugLog,
	openDialog: openDialog,
	publishGlobal: publishGlobal,
	getGlobal: getGlobal,
	removeGlobal: removeGlobal,
});

contextBridge.exposeInMainWorld('domAPI', {
	addEventListener: addEventListener,
	addEventListenerbyClassName: addEventListenerbyClassName,
	getAttribute: getAttribute,
	setAttribute: setAttribute,
	addChild: addChild,
	setHTML: setHTML,
	appendHTML: appendHTML,
	setStyle: setStyle,
	setStyleClassToggle: setStyleClassToggle,
	getProperty: getProperty,
	setProperty: setProperty,
	loadPage: loadPage,
	addGrid: addGrid,
	setThemeColor: setThemeColor,
	getSelectedTracks: getSelectedTracks,
});

contextBridge.exposeInMainWorld('ffmpegAPI', {
	readMetadata: ffmpegRead,
	writeMetadata: ffmpegWrite,
	setBinpath: setPath,
	playSong: playSong,
	stopSong: stopSong,
	pauseSong: pauseSong,
	resumeSong: resumeSong,
	seekSong: seekSong,
	useMultiFFmpeg: useMultiFFmpeg,
});

contextBridge.exposeInMainWorld('fsAPI', {
	getSettings: getSettings,
	writeSettings: writeSettings,
	writeToSetting: writeToSetting,
	deleteSetting: deleteSetting,
	getSetting: getSetting,
	getSongs: getSongs,
	writeSongs: writeSongs,
	appendSongs: appendSongs,
	appendSong: appendSong,
	removeSong: removeSong,
	getStats: getStats,
	writeStats: writeStats,
	writeToStat: writeToStat,
	deleteStat: deleteStat,
	getAllplaylists: getAllPlaylists,
	getPlaylist: getPlaylist,
	removePlaylist: removePlaylist,
	writePlaylist: writePlaylist,
	getSRCString: getSRCString,
	recursiveSearchAtpath: recursiveSearchAtPath,
	cullShortAudio: cullShortAudio,
});
