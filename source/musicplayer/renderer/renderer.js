/**
 * @fileOverview This file handles all logic related to navigation, and acts as a master file to control subpages.
 */


// Creates an onLoad function.
window.addEventListener('DOMContentLoaded', () => {
    eventHandlerLoadPhase();
    jqLoadPhase();
    postInit();

});

/**
 * @name eventHandlerLoadPhase
 * @description Inits all Event Listeners
 */
function eventHandlerLoadPhase() {
    jqAPI.onEvent('body', 'click', '#btn-home', navToHome);
    jqAPI.onEvent('body','click','#btn-overview', navToOverview);
    jqAPI.onEvent('body', 'click', '#btn-library', navToLibrary);
    jqAPI.onEvent('body', 'click', '#btn-playlists', navToPlaylists);
    jqAPI.onEvent('body', 'click', '#btn-search', navToSearch);
    jqAPI.onEvent('body', 'click', '#btn-search-tracks', navToSearchExtended);

    //$('body').on('click', '#btn-home', navToHome);
    //$('body').on('click', '#btn-overview', navToOverview);
    //$('body').on('click', '#btn-library', navToLibrary);
    //$('body').on('click', '#btn-playlists', navToPlaylists);
    //$('body').on('click', '#btn-search', navToSearch);
    //$('body').on('click', '#btn-search-tracks', navToSearchExtended);
}

/**
 * @name jqLoadPhase
 * @description Inits all JQuery dynamic loading that needs to happen on page load.
 */
function jqLoadPhase() {
    //$("#sidebar-container").load("../html/components/sidebar.html");
    //$("#overview-container").load("../html/components/overview.html");
    //$("#main-header-container").load("../html/components/mainHeader.html");
    //$("#main-container").load("../html/pages/home.html");
    //$("#playback-container").load("../html/components/playback.html");

    jqAPI.loadPage('#sidebar-container', 'components/sidebar.html');
    jqAPI.loadPage('#overview-container', 'components/overview.html');
    jqAPI.loadPage('#main-header-container', 'components/mainHeader.html');
    jqAPI.loadPage('#main-container', 'pages/home.html');
    jqAPI.loadPage('#playback-container', 'components/playback.html');
}

/**
 * @name postInit
 * @description All other misc. initialization that needs to happen
 */
function postInit() {

}

/* FRONT END JS INCOMING BELOW */

/* GENERATE HOME PAGE */
//$(document).ready(function () {
//
//});

/* SIDEBAR NAVIGATION */

// Navigate to Home view
function navToHome(element) {
    //$('#main-container').load('../html/pages/home.html');
    //document.getElementById('main-header').innerHTML = '<h1>Home<h1>';

    jqAPI.loadPage('#main-container', 'pages/home.html');
    domAPI.managedSetHTML('main-header', '<h1>Home</h1>');
}

// Navigate to Overview (Now Playing) view
function navToOverview(element) {
    //$('#main-container').load('../html/pages/overview.html');
    //document.getElementById('main-header').innerHTML = '<h1>Now Playing<h1>';

    // the overview.html page does not exist, I guessed that this might work.
    jqAPI.loadPage('#main-container', 'pages/current.html');
    domAPI.managedSetHTML('main-header', '<h1>Now Playing</h1>');
}

// Navigate to Library view
function navToLibrary(element) {
    //$('#main-container').load('../html/pages/library.html');
    //document.getElementById('main-header').innerHTML = '<h1>Library<h1>';

    jqAPI.loadPage('#main-container', 'pages/library.html');
    domAPI.managedSetHTML('main-header', '<h1>Library</h1>');
}

// Navigate to Playlists view
function navToPlaylists(element) {
    //$('#main-container').load('../html/pages/playlists.html');
    //document.getElementById('main-header').innerHTML = '<h1>Playlists<h1>';

    jqAPI.loadPage('#main-container', 'pages/playlists.html');
    domAPI.managedSetHTML('main-header', '<h1>Playlists</h1>');
}

// Navigate to Search results view
function navToSearch(element) {
    //$('#main-container').load('../html/pages/search.html');
    //document.getElementById('main-header').innerHTML = '<h1>Search<h1>';

    jqAPI.loadPage('#main-container', 'pages/search.html');
    domAPI.managedSetHTML('main-header', '<h1>Search</h1>');

}

// Navigate to Search results extended view
function navToSearchExtended(element) {

    //$('#main-container').load('../html/pages/search_extend.html');
    jqAPI.loadPage('#main-container', 'pages/search_extend.html');
    domAPI.managedSetHTML('#main-header', '<h1>Search</h1>');
}