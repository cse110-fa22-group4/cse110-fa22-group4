/* GLOBAL VARS */
let topContainerIsExtended = false; // to toggle extended view of top container
const searchQuery = ''; // the current query entered into the search bar
let currentTrack; // object? of the currently playing track
let currentSearchCategory;

/* GENERATE HOME PAGE */
window.addEventListener('DOMContentLoaded', async () => {
    domAPI.setStyle('top-container-extended', 'visibility', 'hidden');
    await domAPI.loadPage('sidebar-container', 'components/sidebar.html');
    await domAPI.loadPage('overview-container', 'components/overview.html');
    await domAPI.loadPage('main-header-container', 'components/mainHeader.html');
    await domAPI.loadPage('main-container', 'pages/home.html');
    await domAPI.loadPage('playback-container', 'components/playback.html');
    await domAPI.loadPage('searchbar-container', 'components/searchbar.html');
    domAPI.addEventListener('btn-home', 'click', homeClick);
    domAPI.addEventListener( 'btn-overview', 'click', overviewClick);
    domAPI.addEventListener( 'btn-library', 'click', libraryClick);
    domAPI.addEventListener( 'btn-library-artists', 'click', libraryArtistsClick);
    domAPI.addEventListener( 'btn-library-albums', 'click', libraryAlbumsClick);
    domAPI.addEventListener( 'btn-library-genres', 'click', libraryGenresClick);
    domAPI.addEventListener( 'btn-library-tags', 'click', libraryTagsClick);
    domAPI.addEventListener( 'btn-playlists', 'click', playlistsClick);
    domAPI.addEventListener( 'btn-search-tracks', 'click', searchTracksClick);
    domAPI.addEventListener( 'btn-search-artists', 'click', searchArtistsClick);
    domAPI.addEventListener( 'btn-search-albums', 'click', searchAlbumsClick);
    domAPI.addEventListener( 'btn-search-genres', 'click', searchGenresClick);
    domAPI.addEventListener( 'btn-search-playlists', 'click', searchPlaylistsClick);
    domAPI.addEventListener( 'btn-search-tags', 'click', searchTagsClick);
    domAPI.addEventListener( 'btn-search-all', 'click', searchAllClick);
    domAPI.addEventListener( 'btn-settings', 'click', settingsClick);
    domAPI.addEventListener( 'btn-queue', 'click', ovExQueueClick);
    domAPI.addEventListener( 'btn-track', 'click', ovExTrackClick);
    domAPI.addEventListener( 'btn-lyrics', 'click', ovExLyricsClick);
});

/* SIDEBAR NAVIGATION */

/**
 * Navigate to Home view
 * @param {HTMLElement} element
 */
async function homeClick(element) {
    await domAPI.loadPage('main-container', 'pages/home.html');
    domAPI.setHTML('main-header', '<h1>Home</h1>');
    topExtensionOff();
}

/**
 * Navigate to Overview (Now Playing) view
 * @param {HTMLElement} element
 */
async function overviewClick(element) {
    await domAPI.loadPage('top-container-extended', 'pages/overviewExtended.html');
    const instance = ffmpegAPI.playSong('C:\\Users\\Liam\\Desktop\\bin\\songs.mp3', 100, 20);
    topExtensionOn();
}

/**
 * Navigate to Library view
 * @param {HTMLElement} element
 */
async function libraryClick(element) {
    await domAPI.loadPage('main-container', 'pages/library.html', postLibraryLoad);
    domAPI.setHTML('main-header', '<h1>Library</h1>');
    topExtensionOff();
}
/**
 * Post library loading function callback.
 */
async function postLibraryLoad() {

}

/**
 * Navigate to Library > Artists view
 * @param {HTMLElement} element
 */
async function libraryArtistsClick(element) {
    await domAPI.loadPage('main-container', 'pages/libraryArtists.html');
    domAPI.setHTML('main-header', '<h1>Artists</h1>');
    topExtensionOff();
}

/**
 * Navigate to Library > Albums view
 * @param {HTMLElement} element
 */
async function libraryAlbumsClick(element) {
    await domAPI.loadPage('main-container', 'pages/libraryAlbums.html');
    domAPI.setHTML('main-header', '<h1>Albums</h1>');
    topExtensionOff();
}

/**
 * Navigate to Library > Genres view
 * @param {HTMLElement} element
 */
async function libraryGenresClick(element) {
    await domAPI.loadPage('main-container', 'pages/libraryGenres.html');
    domAPI.setHTML('main-header', '<h1>Genres</h1>');
    topExtensionOff();
}

/**
 * Navigate to Library > Tags view
 * @param {HTMLElement} element
 */
async function libraryTagsClick(element) {
    await domAPI.loadPage('main-container', 'pages/libraryTags.html');
    domAPI.setHTML('main-header', '<h1>Tags</h1>');
    topExtensionOff();
}

/**
 * Navigate to Playlists view
 * @param {HTMLElement} element
 */
async function playlistsClick(element) {
    await domAPI.loadPage('main-container', 'pages/playlists.html');
    domAPI.setHTML('main-header', '<h1>Playlists</h1>');
    topExtensionOff();
}

/**
 * Navigate to Search results extended view > Tracks
 * @param {HTMLElement} element
 */
async function searchTracksClick(element) {
    await domAPI.loadPage('main-container', 'pages/searchExtended.html');
    domAPI.setHTML('main-header', `<h1>Track results for: '${searchQuery}'</h1>`);
    currentSearchCategory = 'tracks';
    topExtensionOff();
}

/**
 * Navigate to Search results extended view > Artists
 * @param {HTMLElement} element
 */
async function searchArtistsClick(element) {
    await domAPI.loadPage('main-container', 'pages/searchExtended.html');
    domAPI.setHTML('main-header', `<h1>Artist results for: '${searchQuery}'</h1>`);
    currentSearchCategory = 'artists';
    topExtensionOff();
}

/**
 * Navigate to Search results extended view > Albums
 * @param {HTMLElement} element
 */
async function searchAlbumsClick(element) {
    await domAPI.loadPage('main-container', 'pages/searchExtended.html');
    domAPI.setHTML('main-header', `<h1>Album results for: '${searchQuery}'</h1>`);
    currentSearchCategory = 'albums';
    topExtensionOff();
}

/**
 * Navigate to Search results extended view > Genres
 * @param {HTMLElement} element
 */
async function searchGenresClick(element) {
    await domAPI.loadPage('main-container', 'pages/searchExtended.html');
    domAPI.stHTML('main-header', `<h1>Genre results for: '${searchQuery}'</h1>`);
    currentSearchCategory = 'genres';
    topExtensionOff();
}

/**
 * Navigate to Search results extended view > Playlists
 * @param {HTMLElement} element
 */
async function searchPlaylistsClick(element) {
    await domAPI.loadPage('main-container', 'pages/searchExtended.html');
    domAPI.setHTML('main-header', `<h1>Playlist results for: '${searchQuery}'</h1>`);
    currentSearchCategory = 'playlists';
    topExtensionOff();
}

/**
 * Navigate to Search results extended view > Tags
 * @param {HTMLElement} element
 */
async function searchTagsClick(element) {
    await domAPI.loadPage('main-container', 'pages/searchExtended.html');
    domAPI.setHTML('main-header', `<h1>Tag results for: '${searchQuery}'</h1>`);
    currentSearchCategory = 'tags';
    topExtensionOff();
}

/**
 * Navigate to Search results extended view > All
 * @param {HTMLElement} element
 */
async function searchAllClick(element) {
    await domAPI.loadPage('main-container', 'pages/searchExtended.html');
    domAPI.setHTML('main-header', `<h1>All results for: '${searchQuery}'</h1>`);
    currentSearchCategory = 'all';
    topExtensionOff();
}

/**
 * Navigate to Search results extended view > All
 * @param {HTMLElement} element
 */
async function settingsClick(element) {
    await domAPI.loadPage('top-container-extended', 'pages/settings.html');
    topExtensionOn();
}

/**
 * Toggles the overview off.
 */
function topExtensionOff() {
    if (topContainerIsExtended) {
        domAPI.setStyle('top-container', 'visibility', 'visible');
        domAPI.setStyle('top-container-extended', 'visibility', 'hidden');
        topContainerIsExtended = false;
    }
}

/**
 * Toggles the overview on.
 */
function topExtensionOn() {
    if (!topContainerIsExtended) {
        domAPI.setStyle('top-container', 'visibility', 'hidden');
        domAPI.setStyle('top-container-extended', 'visibility', 'visible');
        topContainerIsExtended = true;
    }
}

/**
 * Navigate to Overview extended > Queue view
 * @param {HTMLElement} element
 */
async function ovExQueueClick(element) {
    await domAPI.loadPage('top-container-extended', 'pages/overviewExtended.html');
    topExtensionOn();
}

/**
 * Navigate to Overview extended > Lyrics view
 * @param {HTMLElement} element
 */
async function ovExLyricsClick(element) {
    await domAPI.loadPage('top-container-extended', 'pages/ovExLyrics.html');
    topExtensionOn();
}

/**
 * Navigate to Overview extended > Track view
 * @param {HTMLElement} element
 */
async function ovExTrackClick(element) {
    await domAPI.loadPage('top-container-extended', 'pages/ovExTrack.html');
    topExtensionOn();
}
