// GLOBAL VARS
let overviewIsExtended = false; // to toggle extended view of Overview container
let searchQuery;  // the current query entered in the search bar

/* GENERATE HOME PAGE */
window.addEventListener('DOMContentLoaded', () => {
  jqAPI.loadPage('#sidebar-container', 'components/sidebar.html');
  jqAPI.loadPage('#overview-container', 'components/overview.html');
  jqAPI.loadPage('#overview-container-extended', 'components/overviewExtended.html');
  jqAPI.loadPage('#main-header-container', 'components/mainHeader.html');
  jqAPI.loadPage('#main-container', 'pages/home.html');
  jqAPI.loadPage('#playback-container', 'components/playback.html');
  jqAPI.loadPage('#searchbar-container', 'components/searchbar.html');
  jqAPI.onEvent('body', 'click', '#btn-home', homeClick);
  jqAPI.onEvent('body', 'click', '#btn-overview', overviewClick);
  jqAPI.onEvent('body', 'click', '#btn-library', libraryClick);
  jqAPI.onEvent('body', 'click', '#btn-playlists', playlistsClick);
  jqAPI.onEvent('body', 'click', '#btn-search-tracks', searchTracksClick);
  
});

/* SIDEBAR NAVIGATION */

// Toggle Home view
function homeClick(element) {
    jqAPI.loadPage('#main-container', 'pages/home.html');
    domAPI.managedSetHTML('main-header', '<h1>Home</h1>');
}

// Toggle Overview (Now Playing) view
function overviewClick(element)  {
    if (!overviewIsExtended) {
        // Toggle extended viewdocument.getElementById('top-container').style['visibility'] =
        domAPI.managedSetStyle('top-container', 'visibility', 'hidden');
        domAPI.managedSetStyle('top-container-extended', 'visibility', 'visible');
        overviewIsExtended = true;
    } else {
        // Toggle default view
        domAPI.managedSetStyle('top-container', 'visibility', 'visible');
        domAPI.managedSetStyle('top-container-extended', 'visibility', 'hidden');
        overviewIsExtended = false;
    }
}

// Toggle Library view
function libraryClick(element) {
    jqAPI.loadPage('#main-container', 'pages/library.html');
    domAPI.managedSetHTML('main-header', '<h1>Library</h1>');
}

// Toggle Playlists view
function playlistsClick(element) {
    jqAPI.loadPage('#main-container', 'pages/playlists.html');
    domAPI.managedSetHTML('main-header', '<h1>Playlists</h1>');
}



// Toggle Search results extended view
function searchTracksClick(element) {
    jqAPI.loadPage('#main-container', 'pages/search_extend.html');
    domAPI.managedSetHTML('main-header', '<h1>Search</h1>');
}