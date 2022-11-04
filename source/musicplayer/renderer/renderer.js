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
    domAPI.managedAddEventListener('my-button', 'click', onButtonClick);
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

// FRONT END JS INCCOMING BELOW

// Load Components on App Start
// App starts on Home page
$(document).ready(function() {
  $("#sidebar-container").load("../html/components/sidebar.html");
  $("#now-playing-container").load("../html/components/nowPlaying.html");
  $("#main-header-container").load("../html/components/mainHeader.html");
  $("#main-container").load("../html/pages/home.html");
  $("#playback-container").load("../html/components/playback.html");
});

// Sidebar Navigation
$("body").on("click", "#btn-home", function() {
  $('#main-container').load('../html/pages/home.html');
  document.getElementById('main-header').innerHTML = '<h1>Home<h1>';
});

$("body").on("click", "#btn-current", function() {
  $('#main-container').load('../html/pages/current.html');
  document.getElementById('main-header').innerHTML = '<h1>Now Playing<h1>';
});

$("body").on("click", "#btn-library", function() {
  $('#main-container').load('../html/pages/library.html');
  document.getElementById('main-header').innerHTML = '<h1>Library<h1>';
});

$("body").on("click", "#btn-playlists", function() {
  $('#main-container').load('../html/pages/playlists.html');
  document.getElementById('main-header').innerHTML = '<h1>Playlists<h1>';
});

// Search bar
$("body").on("click", "#search-bar", function() {
  $('#main-container').load('../html/pages/search.html');
  document.getElementById('main-header').innerHTML = '<h1>Search<h1>';
});

// Search bar - extended
$("body").on("click", "#btn-search-result-track", function() {
  $('#main-container').load('../html/pages/search_extend.html');
});