const path = require('path');
const fs = require('fs');
const {storagePath} = require('../fsAPICalls');

/**
 * @name getSettings
 * @description Gets the full settings as an object in JSON format.
 * @memberOf fsAPI
 * @return {object} A JSON formatted object of all the current settings
 */
function getSettings() {
    const settingsPath = path.join(storagePath, 'settings.json');
    if (!fs.existsSync(settingsPath)) {
        fs.closeSync(fs.openSync(settingsPath, 'w'));
        fs.writeFileSync(settingsPath, '{ }');
    }
    return JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
}

/**
 * @name getSetting
 * @memberOf fsAPI
 * @description Gets a setting if it exists, and returns undefined otherwise.
 * @param {string} setting
 * @return {object | undefined} The setting if it exists, else undefined.
 */
function getSetting(setting) {
    const settings = getSettings();
    if (setting in settings) {
        return JSON.parse(settings[setting]);
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
 * @return {void}
 */
function writeSettings(settings) {
    const settingsPath = path.join(storagePath, 'settings.json');
    if (!fs.existsSync(settingsPath)) {
        fs.closeSync(fs.openSync(settingsPath, 'w'));
    }
    fs.writeFileSync(settingsPath, JSON.stringify(settings));
}

/**
 * @name writeToSetting
 * @description Writes a single setting to the settings.
 * @memberOf fsAPI
 * @param {string} setting The name of the setting to write to.
 * @param {object} val The value to set the setting to.
 * @return {void}
 */
function writeToSetting(setting, val) {
    const settings = getSettings();
    settings[setting] = JSON.stringify(val);
    writeSettings(settings);
}

/**
 * @name deleteSetting
 * @description Removes a setting from the settings file entirely.
 * @memberOf fsAPI
 * @param {string} setting The name of the setting to remove from the settings
 * file.
 * @return {void}
 */
function deleteSetting(setting) {
    const settings = getSettings();
    delete settings[setting];
    writeSettings(settings);
}

module.exports = {
    getSettings,
    getSetting,
    writeSettings,
    writeToSetting,
    deleteSetting,
};
