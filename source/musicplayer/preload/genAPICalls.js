const path = require('path');
const {ipcRenderer} = require('electron');

/**
 * @description A boolean to toggle debug code
 * @type {boolean}
 */
const debug = true;


/**
 * @name debugLog
 * @memberOf genAPI
 * @description A toggleable version of console.log. One can force the print to go through outside of debug. This
 *              method is preferred to console.log even when forced because we can use this to trace console messages.
 * @param message {string} The message to print.
 * @param source {object} The caller of this method. Should be called with 'this'.
 * @param force {boolean} Force the print to go through. Defaults to false.
 */
function debugLog(message, source, force = false) {
    if (debug && !force) {
        console.log(message);
    }
}

/**
 * @name openDialog
 * @memberOf genAPI
 * @description Provides a wrapper to open a file dialog and get file paths.
 * @param opts {object} The options to pass into the open dialog.
 * @returns {Promise<Electron.OpenDialogReturnValue>}
 */
async function openDialog(opts) {
    const { dialog } = require('electron');
    return JSON.parse(await ipcRenderer.invoke('openDialog', opts));
}


module.exports = {
    debugLog,
    openDialog
};
