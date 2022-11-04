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
    // domAPI.managedAddEventListener('my-button', 'click', onButtonClick);
    $('body').on('click', '#btn-home', navToHome);
    $('body').on('click', '#btn-overview', navToOverview);
    $('body').on('click', '#btn-library', navToLibrary);
    $('body').on('click', '#btn-playlists', navToPlaylists);
    $('body').on('click', '#btn-search', navToSearch);
    $('body').on('click', '#btn-search-tracks', navToSearchExtended);
}

/**
 * @name jqLoadPhase
 * @description Inits all JQuery dynamic loading that needs to happen on page load.
 */
function jqLoadPhase() {
    genAPI.jqLoadPage('#subpage', 'subpage.html');
}

/**
 * @name postInit
 * @description All other misc. initialization that needs to happen
 */
function postInit() {

}

/**
 * An example function that demonstrates an event listener that can be entered into the
 * managedAddEventListener. Must have 'element' as a parameter.
 * While it isn't necessary, as with access to the DOM element one can get and set attributes directly,
 * this function also gives and example of how to get and set attributes through the domAPI.
 * @param {HTMLElement} element The element that this event listener is attached to.
 */
function onButtonClick(element) {
    let attribute = domAPI.managedGetAttribute('my-button', 'data-value');
    attribute = parseInt(attribute, 10) + 1; // here we must be confident that attribute is a decimal!
    domAPI.managedSetAttribute('my-button', 'data-value', attribute.toString());
    element.innerText = `I have been pressed ${attribute} times!`;
}

/* FRONT END JS INCOMING BELOW */

/* GENERATE HOME PAGE */
$(document).ready(function() {
  $("#sidebar-container").load("../html/components/sidebar.html");
  $("#overview-container").load("../html/components/overview.html");
  $("#main-header-container").load("../html/components/mainHeader.html");
  $("#main-container").load("../html/pages/home.html");
  $("#playback-container").load("../html/components/playback.html");
});

/* SIDEBAR NAVIGATION */
// Navigate to Home view
function navToHome(element) {
$('#main-container').load('../html/pages/home.html');
  document.getElementById('main-header').innerHTML = '<h1>Home<h1>';
};

// Navigate to Overview (Now Playing) view
function navToOverview(element) {
  $('#main-container').load('../html/pages/overview.html');
  document.getElementById('main-header').innerHTML = '<h1>Now Playing<h1>';
};

// Navigate to Library view
function navToLibrary(element) {
  $('#main-container').load('../html/pages/library.html');
  document.getElementById('main-header').innerHTML = '<h1>Library<h1>';
};

// Navigate to Playlists view
function navToPlaylists(element) {
  $('#main-container').load('../html/pages/playlists.html');
  document.getElementById('main-header').innerHTML = '<h1>Playlists<h1>';
};

// Navigate to Search results view
function navToSearch(element) {
  $('#main-container').load('../html/pages/search.html');
  document.getElementById('main-header').innerHTML = '<h1>Search<h1>';
};

// Navigate to Search results extended view
function navToSearchExtended(element) {
  $('#main-container').load('../html/pages/search_extend.html');
};