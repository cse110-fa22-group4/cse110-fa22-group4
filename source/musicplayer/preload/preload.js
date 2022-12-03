// preload.js
const {ipcRenderer, contextBridge, app, globalShortcut} = require('electron');

const {
	addEventListener, addEventListenerbyClassName, getAttribute,
	setAttribute, addChild, setHTML, appendHTML,
	setStyle, setStyleClassToggle, loadPage,
	addGrid, setThemeColor, toggleDarkTheme, setProperty, getProperty, getSelectedTracks,
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
	setBehaviorUponEnd, changeVolume, getCurrentTime,
} = require('./ffmpeg/play/playSongAPICalls');

const {
	recursiveSearchAtPath, getSRCString,
	fsInit, devClear, 
} = require('./fs/fsAPICalls');

const {
	getAllPlaylists, getPlaylist,
	removePlaylist, writePlaylist,
	writeToPlaylist, removeFromPlaylist,
	createPlaylist, writePlaylistMeta,
	removePlaylistMeta, getPlaylistMeta,
	getPlaylistObj,
} = require('./fs/playlists/playlistAPICalls');

const {
	appendSong, appendSongs, cullShortAudio,
	getSongs, removeSong, writeSongs,
	getSongsTrackData,
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

window.onbeforeunload = async (e) => {
	await stopSong();
	let start = Date.now();
	while(Date.now() < start + 100) {} // yeah.
	window.onbeforeunload = null;
	ipcRenderer.send('quit');
};

contextBridge.exposeInMainWorld('genAPI', {
	debugLog: debugLog,
	openDialog: openDialog,
	publishGlobal: publishGlobal,
	getGlobal: getGlobal,
	removeGlobal: removeGlobal,
	/**
	 * @memberOf genAPI
	 * @name ipcSubscribeToEvent
	 * @description Subscribes to an event from main.js
	 * @param {string} e The event name
	 * @param {function} func The function to attach to the event.
	 */
	ipcSubscribeToEvent: async (e, func) => {
		await ipcRenderer.on(e, async () => {
			await func();
		});
	},
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
    toggleDarkTheme: toggleDarkTheme,
	getSelectedTracks: getSelectedTracks,
});

contextBridge.exposeInMainWorld('ffmpegAPI', {
	readMetadata: ffmpegRead,
	writeMetadata: ffmpegWrite,
	setBinPath: setPath,
	playSong: playSong,
	stopSong: stopSong,
	pauseSong: pauseSong,
	resumeSong: resumeSong,
	seekSong: seekSong,
	useMultiFFmpeg: useMultiFFmpeg,
	setBehaviorUponEnd: setBehaviorUponEnd,
	changeVolume: changeVolume,
	getCurrentTime: getCurrentTime,

});

contextBridge.exposeInMainWorld('fsAPI', {
	getSettings: getSettings,
	writeSettings: writeSettings,
	writeToSetting: writeToSetting,
	deleteSetting: deleteSetting,
	getSetting: getSetting,
	getSongs: getSongs,
	getSongsTrackData: getSongsTrackData,
	writeSongs: writeSongs,
	appendSongs: appendSongs,
	appendSong: appendSong,
	removeSong: removeSong,
	getStats: getStats,
	writeStats: writeStats,
	writeToStat: writeToStat,
	deleteStat: deleteStat,
	getPlaylistObj: getPlaylistObj,
	getAllPlaylists: getAllPlaylists,
	getPlaylist: getPlaylist,
	removePlaylist: removePlaylist,
	createPlaylist: createPlaylist,
	writePlaylistMeta: writePlaylistMeta,
	removePlaylistMeta: removePlaylistMeta,
	getPlaylistMeta: getPlaylistMeta,
	removeFromPlaylist: removeFromPlaylist,
	writePlaylist: writePlaylist,
	writeToPlaylist: writeToPlaylist,
	getSRCString: getSRCString,
	recursiveSearchAtPath: recursiveSearchAtPath,
	cullShortAudio: cullShortAudio,
});
