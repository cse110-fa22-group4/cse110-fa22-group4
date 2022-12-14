const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const {throwErr, throwErrOpen, getStoragePath} = require('../fsAPICalls');

/**
 * @name getSettings
 * @description Gets the full settings as an object in JSON format.
 * @memberOf fsAPI
 * @return {Promise<object>} A JSON formatted object of all the current settings
 */
async function getSettings() {
	const storagePath = await getStoragePath();
	console.log(storagePath);
	const settingsPath = path.join(storagePath, 'settings.json');
	try {
		return JSON.parse(await fsPromises.readFile(settingsPath, 'utf8'));
	} catch (e) {
		return { };
	}
}

/**
 * @name getSetting
 * @memberOf fsAPI
 * @description Gets a setting if it exists, and returns undefined otherwise.
 * @param {string} setting
 * @return {Promise<object> | undefined} The setting if it exists, else undefined.
 */
async function getSetting(setting) {
	const settings = await getSettings();
	if (setting in settings) {
		try {
			return JSON.parse(settings[setting]);
		} catch (e) {
			return settings[setting];
		}
	}
	return undefined;
}

/**
 * @name writeSettings
 * @description Rewrites the entire settings file using the given JSON.
 * This rewrites the entire settings, if you want to only write one setting
 * use writeToSetting()!
 * @memberOf fsAPI
 * @param {object} settings The new settings to set, in JSON format.
 * @return {Promise<void>}
 */
async function writeSettings(settings) {
	const storagePath = await getStoragePath();
	const settingsPath = path.join(storagePath, 'settings.json');
	await fsPromises.writeFile(settingsPath, JSON.stringify(settings));
}


/**
 * @name writeToSetting
 * @description Writes a single setting to the settings.
 * @memberOf fsAPI
 * @param {string} setting The name of the setting to write to.
 * @param {object} val The value to set the setting to.
 * @return {Promise<void>}
 */
async function writeToSetting(setting, val) {
	const settings = await getSettings();
	settings[setting] = JSON.stringify(val);
	await writeSettings(settings);
}

/**
 * @name deleteSetting
 * @description Removes a setting from the settings file entirely.
 * @memberOf fsAPI
 * @param {string} setting The name of the setting to remove from the settings
 * file.
 * @return {Promise<void>}
 */
async function deleteSetting(setting) {
	const settings = await getSettings();
	delete settings[setting];
	await writeSettings(settings);
}

module.exports = {
	getSettings,
	getSetting,
	writeSettings,
	writeToSetting,
	deleteSetting,
};
