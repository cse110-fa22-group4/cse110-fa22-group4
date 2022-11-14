const path = require('path');
const {
	getSettings,
	writeToSetting,
	deleteSetting,
	writeSettings,
} = require('../preload/fs/settings/settingsAPICalls');

const {
	getSongs,
	appendSong,
	appendSongs,
	writeSongs,
	removeSong,
} = require('../preload/fs/songs/songsAPICalls');

const {
	recursiveSearchAtPath,
	getSourceFolder,
	setStoragePath,
} = require('../preload/fs/fsAPICalls');
const {enableDebugLogTag} = require('../preload/general/genAPICalls');

/**
 *
 * @return {Promise<void>}
 */
async function testSettings() {
	const settingName = 'testingStatus';
	await testGetSettings();
	await testGetSettings();

	// run twice to test override
	await testWriteToSetting(settingName);
	await testWriteToSetting(settingName);

	await testGetSettings();

	// run twice to test deleting non-existent setting
	await testDeleteSetting(settingName);
	await testDeleteSetting(settingName);

	const settings = await getSettings();
	await testWriteSettings(settings);
}

/**
 *
 * @return {Promise<void>}
 */
async function testGetSettings() {
	const settings = await getSettings();
	await genAPI.debugLog('settings file: ' + JSON.stringify(settings), 'unit-tests');
}

/**
 *
 * @param {string} name
 * @return {Promise<void>}
 */
async function testWriteToSetting(name) {
	const val = true;
	await writeToSetting(name, val);
	const setting = JSON.parse((await getSettings())[name]);
	// could be better check
	await genAPI.debugLog('Write to Setting Test Passed: ' + (setting===val), 'unit-tests');
}

/**
 *
 * @param {string} name
 * @return {Promise<void>}
 */
async function testDeleteSetting(name) {
	await deleteSetting(name);
	const settings = await getSettings();
	// could be better check
	await genAPI.debugLog(
		'Setting \'testingStatus\' successfully removed: ' + (settings['testingStatus']==null),
		'unit-tests');
}

/**
 *
 * @param {object} settings
 * @return {Promise<void>}
 */
async function testWriteSettings(settings) {
	await writeSettings(settings);
	const settingsNew = await getSettings();
	await genAPI.debugLog(
		'WriteSettings successful: ' + (JSON.stringify(settings) === JSON.stringify(settingsNew)),
		'unit-tests');
}


/**
 * @description Tests the songs API.
 * @param {string[]} songFolderPaths
 * @return {Promise<void>}
 */
async function testSongs(songFolderPaths) {
	// songfolderpaths
	const songPaths = [];

	for (const songFolderPath in songFolderPaths) {
		if (!songFolderPath) continue;
		const localPath = await getSourceFolder();
		// songPaths.push(recursiveSearchAtPath(path.join(localPath, songFolderPaths[songFolderPath])));
		const lol = await recursiveSearchAtPath(path.join(localPath, 'users/user_1/songs'));
	}
}

/* async function testGetSong() {

}

async function testAppendSong() {

}

async function testDeleteSong() {

}

async function testWriteSongs(songs) {

}*/

/**
 * @description Runs all of the unit tests for APIs.
 * @return {Promise<void>}
 */
async function testAll() {
	await setStoragePath('users/user_1/data');
	const folderPath = [];
	// folderPath.push('users/user_1/songs');
	await testSettings();
	// await testSongs(folderPath);
/*
    await setStoragePath('users/user_2/data');
    folderPath = 'users/user_2/songs';
    await testSettings();
    //testSongs(folderPath);

    await setStoragePath('users/user_3/data');
    folderPath = 'users/user_3/songs';
    await testSettings();
    //testSongs(folderPath);

    //reset testing environment*/
}


module.exports = {
	testAll,
};
