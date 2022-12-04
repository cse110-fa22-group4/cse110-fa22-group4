const fs = require('fs');
const fsPromises = fs.promises;
const {ipcRenderer} = require('electron');
const path = require('path');
const {debugLog} = require('../general/genAPICalls');

let storagePath = '';


/**
 * @name fsInit
 * @memberOf fsInit
 * @description MUST BE CALLED ON STARTUP. Sets the path to userData, which can
 * only be done from main.js.
 * @return {Promise<void>}
 */
async function fsInit() {
	storagePath = await ipcRenderer.invoke('getUserData');
	await makeDirIfNotExists(storagePath);
	storagePath = path.join(storagePath, 'MixMatch');
	await makeDirIfNotExists(storagePath);
	await makeDirIfNotExists(path.join(storagePath, 'playlists'));
	//await debugLog('UserData Storage Path: ' + storagePath, 'fs-general');
}

/**
 * @name setStoragePath
 * @memberOf fsAPI
 * @description sets the storage path, the folder
 * that stores settings and playlists
 * which is normally appData, to what we want
 * It's typically inside the repo
 * @param {string} newStoragePath the newStoragePath inside the repo
 * @return {Promise<void>}
 */
async function setStoragePath(newStoragePath) {
	const localPath = await getSourceFolder();
	storagePath = path.join(localPath, newStoragePath);
	await makeDirIfNotExists(storagePath);
	//await debugLog('UserData Storage Path: ' + storagePath, 'fs-general');
}

/**
 * @name getStoragePath
 * @memberOf fsAPI
 * @description returns the storage path
 * @return {Promise<string>} A promise containing
 * the storage path
 */
async function getStoragePath() {
	return storagePath;
}

/**
 * @name getSourceFolder
 * @memberOf fsAPI
 * @description returns the source folder of the repo
 * @return {Promise<string>} a promise containing
 * a string of the repo's source folder
 */
async function getSourceFolder() {
	return __dirname + '/../../..';
}

/**
 * @name devClear
 * @description Deletes every file. Useful for development and unit tests.
 *              Can only be called from whitelisted callers.
 * @memberOf fsAPI
 * @param {object} caller A reference to the caller. This function can only be
 *                      called from whitelisted callers.
 * @return {Promise<void>}
 */
async function devClear(caller) {
	const settingPath = path.join(storagePath, 'settings.json');
	const songsPath = path.join(storagePath, 'songs.json');
	const statsPath = path.join(storagePath, 'stats.json');
	const playlistPath = path.join(storagePath, 'playlists');

	if (fs.existsSync(settingPath)) {
		//fs.rmSync(settingPath);
		fs.rmSync(settingPath);
	}
	if (fs.existsSync(songsPath)) {
		fs.rmSync(songsPath);
	}
	if (fs.existsSync(statsPath)) {
		fs.rmSync(statsPath);
	}
	if (fs.existsSync(playlistPath)) {
		fs.rmdirSync(playlistPath, {recursive: true});
	}
}

/* File Structure in userData
.../MixMatch
    |-- playlists
    |   |-- myPlaylist.mmp
    |-- lyrics
    |   |-- myLyrics.(?)
    |-- settings.json
    |-- songs.json
    |-- stats.json
 */

/**
 * @name makeDirIfExists
 * @description Checks if a folder exists, and if not creates it.
 * @memberOf fsAPI
 * @param {string} folder The folder to be checked for.
 * @return {Promise<void>}
 */
async function makeDirIfNotExists(folder) {
	//WARNING: untested code
	try {
		await fsPromises.opendir(folder);
	} catch (e) {
		await fsPromises.mkdir(folder, {recursive: false});
	}
	/*
	await fs.opendir(folder, async (err, dir) => {
		if (err) {
			// await fs.mkdir(folder, {recursive: false}, (err) => {
			// 	// Any callback that needs to happen on first folder create
			// 	// can happen here.
			// 	if (err) throw err;
			// });

			// throw an error if it occurs
		}
	});
	*/
}

/**
 * @name getSRCString
 * @description Gets a string that, when passed into the src of a HTML Audio
 * element will play the sound.
 * @memberOf fsAPI
 * @param {string} path The path to an audio file on the computer
 * @return {Promise<string>} A HTML Audio compatible src string.
 * @todo May not work on all (or any) OS! May need to give filesystem access!
 */
async function getSRCString(path) {
	return 'file:///' + path;
}

// To future people trying to make recursiveSearchAtPath async: don't. seriously. it isn't worth the headache.

/**
 * @name recursiveSearchAtPath
 * @description Recursively searches every subdirectory at a given directory
 * to return every song.
 * @memberOf fsAPI
 * @param {string} searchPath The pat at which to recursively search
 * @return {Promise<string[]>}  An array of every song path that exists recursively
 * within the directory.
 *
 */
async function recursiveSearchAtPath(searchPath) {
	// try and catch to take care of illegal folders/files
	try {
		const ret = [];
		const dirs = fs.readdirSync(
			searchPath,
			{withFileTypes: true},
		).filter((d) => d.isDirectory()).map((d) => d.name);

		for (const dir of dirs) {
			const dirPath = path.join(searchPath, dir);
			if (fs.existsSync(dirPath)) {
				const paths = await recursiveSearchAtPath(dirPath);
				paths.forEach((p) => ret.push(p));
			}
		}

		const files = fs.readdirSync(
			searchPath,
			{withFileTypes: true},
		).filter((d) =>
			d.isFile()).filter((d) =>
			d.name.split('.').pop() === 'mp3').map((d) => d.name);
		files.forEach((f) => ret.push(path.join(searchPath, f).split(path.sep).join(path.posix.sep)));

		return ret;
	} catch (e) {
		console.log(e);
		return [];
	}
}

/**
 *
 * @param filename The path of the song
 * @param songs The songs.json object
 * @returns {Promise<
 * {
 * 		track:		(string|number),
 * 		duration: 	(string|number),
 * 		filename: 	(string),
 * 		artist: 	(string),
 * 		date: 		(string),
 * 		year:		(string),
 * 		album: 		(string),
 * 		genre: 		(string),
 * 		title: 		(string)
 * 	}>}
 */
async function convertPathToTrack(filename, songs) {
	const ret = {};
	const song = songs[filename]['format'];

	if ('tags' in song && 'track' in song['tags']) ret['track'] = Number(song['tags']['track'].split('/')[0]);
	else if ('track' in song) ret['track'] = song['track'];
	else ret['track'] = '';

	if ('tags' in song && 'title' in song['tags']) ret['title'] = song['tags']['title'];
	else if ('title' in song) ret['title'] = song['title'];
	else ret['title'] = '';

	if ('tags' in song && 'artist' in song['tags']) ret['artist'] = song['tags']['artist'];
	else if ('artist' in song) ret['artist'] = song['artist'];
	else ret['artist'] = '';

	if ('tags' in song && 'album' in song['tags']) ret['album'] = song['tags']['album'];
	else if ('album' in song) ret['album'] = song['album'];
	else ret['album'] = '';

	if ('tags' in song && 'date' in song['tags']) ret['date'] = song['tags']['date'];
	else if ('date' in song) ret['date'] = song['date'];
	else ret['date'] = '';

	if ('tags' in song && 'year' in song['tags']) ret['year'] = song['tags']['year'];
	else if ('year' in song) ret['year'] = song['year'];
	else ret['year'] = '';

	if ('tags' in song && 'duration' in song['tags']) ret['duration'] = song['tags']['duration'];
	else if ('duration' in song) ret['duration'] = song['duration'];
	else ret['duration'] = '';

	if ('tags' in song && 'genre' in song['tags']) ret['genre'] = song['tags']['genre'];
	else if ('genre' in song) ret['genre'] = song['genre'];
	else ret['genre'] = '';

	if ('tags' in song && 'tags' in song['tags']) ret['tags'] = song['tags']['tags'];
	else ret['tags'] = '';

	return ret;
}

module.exports = {
	convertPathToTrack,
	getStoragePath,
	makeDirIfNotExists,
	getSRCString,
	fsInit,
	devClear,
	recursiveSearchAtPath,
	setStoragePath,
	getSourceFolder,
};
