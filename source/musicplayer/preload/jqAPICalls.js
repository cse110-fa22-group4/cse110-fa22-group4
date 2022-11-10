const path = require('path');
const {ipcRenderer} = require('electron');

/**
 * @description A path to the html directory from any file in the renderer directory.
 * @type {string}
 */
const htmlFilePath = './../html';

/**
 * @name htmlFromRenderer
 * @description Gets a filepath corresponding to the actual html file path from a renderer process.
 * @param {string} htmlFile The name of the html file to get.
 * @return {string} The actual path to the html file from a renderer process.
 */
function htmlFromRenderer(htmlFile) {
    return path.join(htmlFilePath, htmlFile);
}

/**
 * @name loadPage
 * @memberOf jqAPI
 * @description Loads a html page into an element using JQuery.
 * @param {string} targetID The ID of the element to load a html page into.
 * @param {string} htmlFile The name of the html file to load.
 * @param {function | undefined} callback An optional callback to execute.
 */
function loadPage(targetID, htmlFile, callback = undefined) {
    // this is the solution? fixes a crazy annoying bug, do not declare at top of file.
    const $ = require('jquery/dist/jquery.min');
    callback !== undefined ?
        $(targetID).load(htmlFromRenderer(htmlFile), callback) :
        $(targetID).load(htmlFromRenderer(htmlFile));
}

/**
 * @name onEvent
 * @memberOf jqAPI
 * @param {string} homeElement The element to load jquery with.
 * @param {string} event The event to hook into.
 * @param {string} targetID The ID of the target to add an event to.
 * @param {function(HTMLElement)} func The function to run.
 */
function onEvent(homeElement, event, targetID, func) {
    const $ = require('jquery/dist/jquery.min');
    const isSafe = ipcRenderer.invoke('managedAddEventListenerCheck', targetID, event);
    if (isSafe) {
        $(homeElement).on(event, targetID, (element) => {
            func(element);
        });
    }
}

module.exports = {
    loadPage,
    onEvent,
};
