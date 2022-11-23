/* eslint-disable linebreak-style */
const path = require('path');
const {ipcRenderer} = require('electron');

/**
 * @description A list of all debugLog tags. Use comments to enable/disable please.
 * @type {string[]}
 */
const enabledTags =
	[
		'add-event-error',
		'broadcast-event',
		'fs-general',
		'unit-tests',
		'multi-ffmpeg-loading-progress',
		'fsplay-error',
		// 'settings-test',
	];

/**
 * @name debugLog
 * @memberOf genAPI
 * @description A toggleable version of console.log. One can force the print
 * to go through outside of debug. This
 *              method is preferred to console.log even when forced because
 *              we  can use this to trace console messages.
 * @param {object} message The message to print.
 * @param {string} tag The ID of this debug message. Each tag must be toggled.
 * @return {Promise<void>}
 */
async function debugLog(message, tag) {
	if (enabledTags.includes(tag)) {
		console.log(message);
	}
}

/**
 * @name openDialog
 * @memberOf genAPI
 * @description Provides a wrapper to open a file dialog and get file paths.
 * @param {object} opts The options to pass into the open dialog.
 * @return {Promise<Electron.OpenDialogReturnValue>}
 */
async function openDialog(opts) {
	const {dialog} = require('electron');
	return JSON.parse(await ipcRenderer.invoke('openDialog', opts));
}

const globalVars = {};

/**
 * @name publishGlobal
 * @memberOf genAPI
 * @description Adds a global to storage. Will overwrite anything with the same key
 * @param {any} globalValue - the value of the global we are storing
 * @param {string} globalKey - this string is the key that can be used to access the global that we just stored
 * @return {Promise<void>}
 */
async function publishGlobal(globalValue, globalKey) {
	globalVars[globalKey] = globalValue;
}

/**
 * @name getGlobal
 * @memberOf genAPI
 * @description Retrieves a global from storage
 * @param {string} globalKey - the key to access the global, should be the same as the name of the global
 * @return {Promise<any>}
 */
async function getGlobal(globalKey) {
	if (globalKey in globalVars) {
		return globalVars[globalKey];
	}
}

/**
 * @name removeGlobal
 * @memberOf genAPI
 * @description Removes a global from storage.
 * @param {string} globalKey - the key of the global variable we want to remove
 * @return {Promise<void>}
 */
async function removeGlobal(globalKey) {
	delete globalVars.globalKey;
}


module.exports = {
	debugLog,
	openDialog,
	publishGlobal,
	getGlobal,
	removeGlobal,
};
