/* GLOBAL VARS */
let topContainerIsExtended = false; // to toggle extended view of top container
let searchQuery = ''; // the current query entered in the search bar
let currentTrack; // object? of the currently playing track
let currentSearchCategory;

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
    jqAPI.onEvent('body', 'click', '#btn-library-artists', libraryArtistsClick);
    jqAPI.onEvent('body', 'click', '#btn-library-albums', libraryAlbumsClick);
    jqAPI.onEvent('body', 'click', '#btn-library-genres', libraryGenresClick);
    jqAPI.onEvent('body', 'click', '#btn-library-tags', libraryTagsClick);
    jqAPI.onEvent('body', 'click', '#btn-playlists', playlistsClick);
    jqAPI.onEvent('body', 'click', '#btn-search-tracks', searchTracksClick);
    jqAPI.onEvent('body', 'click', '#btn-search-artists', searchArtistsClick);
    jqAPI.onEvent('body', 'click', '#btn-search-albums', searchAlbumsClick);
    jqAPI.onEvent('body', 'click', '#btn-search-genres', searchGenresClick);
    jqAPI.onEvent('body', 'click', '#btn-search-playlists', searchPlaylistsClick);
    jqAPI.onEvent('body', 'click', '#btn-search-tags', searchTagsClick);
    jqAPI.onEvent('body', 'click', '#btn-search-all', searchAllClick);
    jqAPI.onEvent('body', 'click', '#btn-settings', settingsClick);
    jqAPI.onEvent('body', 'click', '#btn-queue', ovExQueueClick);
    jqAPI.onEvent('body', 'click', '#btn-track', ovExTrackClick);
    jqAPI.onEvent('body', 'click', '#btn-lyrics', ovExLyricsClick);
});

/* SIDEBAR NAVIGATION */

// Navigate to Home view
function homeClick(element) {
    jqAPI.loadPage('#main-container', 'pages/home.html');
    domAPI.managedSetHTML('main-header', '<h1>Home</h1>');
    topExtensionOff();
}

// Navigate to Overview (Now Playing) view
function overviewClick(element) {
    jqAPI.loadPage('#top-container-extended', 'pages/overviewExtended.html');
    topExtensionOn();
}

// Navigate to Library view
function libraryClick(element) {
    jqAPI.loadPage('#main-container', 'pages/library.html');
    domAPI.managedSetHTML('main-header', '<h1>Library</h1>');
    topExtensionOff();
}

// Navigate to Library > Artists view
function libraryArtistsClick(element) {
    jqAPI.loadPage('#main-container', 'pages/library_artists.html');
    domAPI.managedSetHTML('main-header', '<h1>Artists</h1>');
    topExtensionOff();
}

// Navigate to Library > Albums view
function libraryAlbumsClick(element) {
    jqAPI.loadPage('#main-container', 'pages/library_albums.html');
    domAPI.managedSetHTML('main-header', '<h1>Albums</h1>');
    topExtensionOff();
}

// Navigate to Library > Genres view
function libraryGenresClick(element) {
    jqAPI.loadPage('#main-container', 'pages/library_genres.html');
    domAPI.managedSetHTML('main-header', '<h1>Genres</h1>');
    topExtensionOff();
}

// Navigate to Library > Tags view
function libraryTagsClick(element) {
    jqAPI.loadPage('#main-container', 'pages/library_Tags.html');
    domAPI.managedSetHTML('main-header', '<h1>Tags</h1>');
    topExtensionOff();
}

// Navigate to Playlists view
function playlistsClick(element) {
    jqAPI.loadPage('#main-container', 'pages/playlists.html');
    domAPI.managedSetHTML('main-header', '<h1>Playlists</h1>');
    topExtensionOff();
}

// Navigate to Search results extended view > Tracks
function searchTracksClick(element) {
    jqAPI.loadPage('#main-container', 'pages/search_extended.html');
    domAPI.managedSetHTML('main-header', `<h1>Track results for: '${searchQuery}'</h1>`);
    currentSearchCategory = 'tracks';
    topExtensionOff();
}

// Navigate to Search results extended view > Artists
function searchArtistsClick(element) {
  jqAPI.loadPage('#main-container', 'pages/search_extended.html');
  domAPI.managedSetHTML('main-header', `<h1>Artist results for: '${searchQuery}'</h1>`);
  currentSearchCategory = 'artists';
  topExtensionOff();
}

// Navigate to Search results extended view > Albums
function searchAlbumsClick(element) {
  jqAPI.loadPage('#main-container', 'pages/search_extended.html');
  domAPI.managedSetHTML('main-header', `<h1>Album results for: '${searchQuery}'</h1>`);
  currentSearchCategory = 'albums';
  topExtensionOff();
}

// Navigate to Search results extended view > Genres
function searchGenresClick(element) {
  jqAPI.loadPage('#main-container', 'pages/search_extended.html');
  domAPI.managedSetHTML('main-header', `<h1>Genre results for: '${searchQuery}'</h1>`);
  currentSearchCategory = 'genres';
  topExtensionOff();
}

// Navigate to Search results extended view > Playlists
function searchPlaylistsClick(element) {
  jqAPI.loadPage('#main-container', 'pages/search_extended.html');
  domAPI.managedSetHTML('main-header', `<h1>Playlist results for: '${searchQuery}'</h1>`);
  currentSearchCategory = 'playlists';
  topExtensionOff();
}

// Navigate to Search results extended view > Tags
function searchTagsClick(element) {
  jqAPI.loadPage('#main-container', 'pages/search_extended.html');
  domAPI.managedSetHTML('main-header', `<h1>Tag results for: '${searchQuery}'</h1>`);
  currentSearchCategory = 'tags';
  topExtensionOff();
}

// Navigate to Search results extended view > All
function searchAllClick(element) {
  jqAPI.loadPage('#main-container', 'pages/search_extended.html');
  domAPI.managedSetHTML('main-header', `<h1>All results for: '${searchQuery}'</h1>`);
  currentSearchCategory = 'all';
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

// Navigate to Overview extended > Queue view
function ovExQueueClick(element) {
    jqAPI.loadPage('#top-container-extended', 'pages/overviewExtended.html');
    topExtensionOn();
}

// Navigate to Overview extended > Lyrics view
function ovExLyricsClick(element) {
    jqAPI.loadPage('#top-container-extended', 'pages/ovExLyrics.html');
    topExtensionOn();
}

// Navigate to Overview extended > Track view
function ovExTrackClick(element) {
    jqAPI.loadPage('#top-container-extended', 'pages/ovExTrack.html');
    topExtensionOn();
}
