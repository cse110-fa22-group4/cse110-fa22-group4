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

const globalVars = [];

/**
 * Adds a global to storage.
 * @param {any} global
 * @returns {Promise<void>}
 */
async function publishGlobal(global) {
	globalVars.push(global);
}

/**
 * Retrieves a global from storage
 * @param {any} global
 * @returns {Promise<any>}
 */
async function getGlobal(global) {
	if (globalVars.includes(global)) {
		return global;
	}
}

/**
 * Removes a global from storage.
 * @param {any} global
 * @returns {Promise<void>}
 */
async function removeGlobal(global) {
	const i = globalVars.indexOf(global);
	if (i > -1) {
		globalVars.splice(i, 1);
	}
}


module.exports = {
	debugLog,
	openDialog,
	publishGlobal,
	getGlobal,
	removeGlobal,
};
