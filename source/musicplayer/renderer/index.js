/* GLOBAL VARS */
let topContainerIsExtended = false; // to toggle extended view of top container
let searchQuery = "";  // the current query entered in the search bar
let currentTrack; // object? of the currently playing track

/* GENERATE HOME PAGE */
window.addEventListener('DOMContentLoaded', () => {
  domAPI.managedSetStyle('top-container-extended', 'visibility', 'hidden');
  jqAPI.loadPage('#sidebar-container', 'components/sidebar.html');
  jqAPI.loadPage('#overview-container', 'components/overview.html');
  jqAPI.loadPage('#main-header-container', 'components/mainHeader.html');
  jqAPI.loadPage('#main-container', 'pages/home.html');
  jqAPI.loadPage('#playback-container', 'components/playback.html');
  jqAPI.loadPage('#searchbar-container', 'components/searchbar.html');
  jqAPI.onEvent('body', 'click', '#btn-home', homeClick);
  jqAPI.onEvent('body', 'click', '#btn-overview', overviewClick);
  jqAPI.onEvent('body', 'click', '#btn-library', libraryClick);
  jqAPI.onEvent('body', 'click', '#btn-playlists', playlistsClick);
  jqAPI.onEvent('body', 'click', '#btn-search-tracks', searchTracksClick);
  jqAPI.onEvent('body', 'click', '#btn-settings', settingsClick);
  
});

/* SIDEBAR NAVIGATION */

// Navigate to Home view
function homeClick(element) {
    jqAPI.loadPage('#main-container', 'pages/home.html');
    domAPI.managedSetHTML('main-header', '<h1>Home</h1>');
    topExtensionOff();
}

// Navigate to Overview (Now Playing) view
function overviewClick(element)  {
  jqAPI.loadPage('#top-container-extended', 'pages/overviewExtended.html');
  topExtensionOn();
}

// Navigate to Library view
function libraryClick(element) {
    jqAPI.loadPage('#main-container', 'pages/library.html');
    domAPI.managedSetHTML('main-header', '<h1>Library</h1>');
    topExtensionOff();
}

// Navigate to Playlists view
function playlistsClick(element) {
    jqAPI.loadPage('#main-container', 'pages/playlists.html');
    domAPI.managedSetHTML('main-header', '<h1>Playlists</h1>');
    topExtensionOff();
}

// Navigate to Search results extended view
function searchTracksClick(element) {
    jqAPI.loadPage('#main-container', 'pages/search_extend.html');
    domAPI.managedSetHTML('main-header', '<h1>Search</h1>');
    topExtensionOff();
}

// Navigate to Settings view
function settingsClick(element) {
  jqAPI.loadPage('#top-container-extended', 'pages/settings.html');
  topExtensionOn();
}

/* TOGGLE OVERVIEW */
function topExtensionOff() {
  if (topContainerIsExtended) {
    domAPI.managedSetStyle('top-container', 'visibility', 'visible');
    domAPI.managedSetStyle('top-container-extended', 'visibility', 'hidden');
    topContainerIsExtended = false;
  }
}

function topExtensionOn() {
  if (!topContainerIsExtended) {
    domAPI.managedSetStyle('top-container', 'visibility', 'hidden');
    domAPI.managedSetStyle('top-container-extended', 'visibility', 'visible');
    topContainerIsExtended = true;
  }
}