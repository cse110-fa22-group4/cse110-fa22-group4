const path = require('path');

/**
 * @description A boolean to toggle debug code
 * @type {boolean}
 */
const debug = true;

/**
 * @description A path to the html directory from any file in the renderer directory.
 * @type {string}
 */
const htmlFilePath = "./../html"


/**
 * @name debugLog
 * @memberOf genAPI
 * @description A toggleable version of console.log. One can force the print to go through outside of debug. This
 *              method is preferred to console.log even when forced because we can use this to trace console messages.
 * @param message {string} The message to print.
 * @param source {object} The caller of this method. Should be called with 'this'.
 * @param force {boolean} Force the print to go through. Defaults to false.
 */
function debugLog(message, source,  force = false) {
    if (debug && !force) {
        console.log(message);
    }
}

/**
 * @name htmlFromRenderer
 * @memberOf genAPI
 * @description Gets a filepath corresponding to the actual html file path from a renderer process.
 * @param htmlFile {string} The name of the html file to get.
 * @return {string} The actual path to the html file from a renderer process.
 */
function htmlFromRenderer(htmlFile) {
    return path.join(htmlFilePath, htmlFile);
}

/**
 * @todo: fix
 * @deprecated
 * @name loadPage
 * @memberOf genAPI
 * @param targetID {string}
 * @param htmlFile {string}
 * @param callback {function | undefined}
 */
function loadPage(targetID, htmlFile, callback = undefined) {
    let func = `$(${targetID}).load(htmlFromRenderer(${htmlFile}));`;
    return () => eval(func);
}

module.exports = {
    debugLog,
    htmlFromRenderer,
    loadPage
};