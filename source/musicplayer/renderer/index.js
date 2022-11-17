/* GLOBAL VARS */
let topContainerIsExtended = false; // to toggle extended view of top container
const searchQuery = ''; // the current query entered into the search bar
let currentSearchCategory;

/* GENERATE HOME PAGE */
window.addEventListener('DOMContentLoaded', async () => {
	await domAPI.setStyle('top-container-extended', 'visibility', 'hidden');
	await domAPI.loadPage('sidebar-container', 'components/sidebar.html');
	await domAPI.loadPage('overview-container', 'components/overview.html');
	await domAPI.loadPage('main-header-container', 'components/mainHeader.html');
	await domAPI.loadPage('main-container', 'pages/home.html');
	await domAPI.loadPage('playback-container', 'components/playback.html');
	await domAPI.loadPage('searchbar-container', 'components/searchbar.html');
	await domAPI.addEventListener('btn-home', 'click', homeClick);
	await domAPI.addEventListener( 'btn-overview', 'click', overviewClick);
	await domAPI.addEventListener( 'btn-library', 'click', libraryClick);
	await domAPI.addEventListener( 'btn-library-artists', 'click', libraryArtistsClick);
	await domAPI.addEventListener( 'btn-library-albums', 'click', libraryAlbumsClick);
	await domAPI.addEventListener( 'btn-library-genres', 'click', libraryGenresClick);
	await domAPI.addEventListener( 'btn-library-tags', 'click', libraryTagsClick);
	await domAPI.addEventListener( 'btn-playlists', 'click', playlistsClick);
	await domAPI.addEventListener( 'btn-search-tracks', 'click', searchTracksClick);
	await domAPI.addEventListener( 'btn-search-artists', 'click', searchArtistsClick);
	await domAPI.addEventListener( 'btn-search-albums', 'click', searchAlbumsClick);
	await domAPI.addEventListener( 'btn-search-genres', 'click', searchGenresClick);
	await domAPI.addEventListener( 'btn-search-playlists', 'click', searchPlaylistsClick);
	await domAPI.addEventListener( 'btn-search-tags', 'click', searchTagsClick);
	await domAPI.addEventListener( 'btn-search-all', 'click', searchAllClick);
	await domAPI.addEventListener( 'btn-settings', 'click', settingsClick);
	await domAPI.addEventListener( 'btn-queue', 'click', ovExQueueClick);
	await domAPI.addEventListener( 'btn-track', 'click', ovExTrackClick);
	await domAPI.addEventListener( 'btn-lyrics', 'click', ovExLyricsClick);
});

/* SIDEBAR NAVIGATION */

/**
 * Navigate to Home view
 * @param {HTMLElement} element
 */
async function homeClick(element) {
	await domAPI.loadPage('main-container', 'pages/home.html');
	await domAPI.setHTML('header-title', 'Home');
  await domAPI.setHTML('header-subtitle', '');
	await topExtensionOff();
}

/**
 * Navigate to Overview (Now Playing) view
 * @param {HTMLElement} element
 */
async function overviewClick(element) {
	await domAPI.loadPage('top-container-extended', 'pages/overviewExtended.html');
	await topExtensionOn();
}

/**
 * Navigate to Library view
 * @param {HTMLElement} element
 */
async function libraryClick(element) {
	await domAPI.loadPage('main-container', 'pages/library.html', postLibraryLoad);
	await domAPI.setHTML('header-title', 'Library');
  await domAPI.setHTML('header-subtitle', 'All');
	await topExtensionOff();
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
	await domAPI.setHTML('header-title', 'Library');
  await domAPI.setHTML('header-subtitle', 'Artists');
	await topExtensionOff();
}

/**
 * Navigate to Library > Albums view
 * @param {HTMLElement} element
 */
async function libraryAlbumsClick(element) {
	await domAPI.loadPage('main-container', 'pages/libraryAlbums.html');
	await domAPI.setHTML('header-title', 'Library');
  await domAPI.setHTML('header-subtitle', 'Albums');
	await topExtensionOff();
}

/**
 * Navigate to Library > Genres view
 * @param {HTMLElement} element
 */
async function libraryGenresClick(element) {
	await domAPI.loadPage('main-container', 'pages/libraryGenres.html');
	await domAPI.setHTML('header-title', 'Library');
  await domAPI.setHTML('header-subtitle', 'Genres');
	await topExtensionOff();
}

/**
 * Navigate to Library > Tags view
 * @param {HTMLElement} element
 */
async function libraryTagsClick(element) {
	await domAPI.loadPage('main-container', 'pages/libraryTags.html');
	await domAPI.setHTML('header-title', 'Library');
  await domAPI.setHTML('header-subtitle', 'Tags');
	await topExtensionOff();
}

/**
 * Navigate to Playlists view
 * @param {HTMLElement} element
 */
async function playlistsClick(element) {
	await domAPI.loadPage('main-container', 'pages/playlists.html');
	await domAPI.setHTML('header-title', 'Playlists');
  await domAPI.setHTML('header-subtitle', 'All');
	await topExtensionOff();
}

/**
 * Navigate to Search results extended view > Tracks
 * @param {HTMLElement} element
 */
async function searchTracksClick(element) {
	await domAPI.loadPage('main-container', 'pages/searchExtended.html');
	await domAPI.setHTML('header-title', `Track results for: '${searchQuery}'`);
	currentSearchCategory = 'tracks';
	await topExtensionOff();
}

/**
 * Navigate to Search results extended view > Artists
 * @param {HTMLElement} element
 */
async function searchArtistsClick(element) {
	await domAPI.loadPage('main-container', 'pages/searchExtended.html');
	await domAPI.setHTML('header-title', `Artist results for: '${searchQuery}'`);
	currentSearchCategory = 'artists';
	await topExtensionOff();
}

/**
 * Navigate to Search results extended view > Albums
 * @param {HTMLElement} element
 */
async function searchAlbumsClick(element) {
	await domAPI.loadPage('main-container', 'pages/searchExtended.html');
	await domAPI.setHTML('header-title', `Album results for: '${searchQuery}'`);
	currentSearchCategory = 'albums';
	await topExtensionOff();
}

/**
 * Navigate to Search results extended view > Genres
 * @param {HTMLElement} element
 */
async function searchGenresClick(element) {
	await domAPI.loadPage('main-container', 'pages/searchExtended.html');
	await domAPI.setHTML('header-title', `Genre results for: '${searchQuery}'`);
	currentSearchCategory = 'genres';
	await topExtensionOff();
}

/**
 * Navigate to Search results extended view > Playlists
 * @param {HTMLElement} element
 */
async function searchPlaylistsClick(element) {
	await domAPI.loadPage('main-container', 'pages/searchExtended.html');
	await domAPI.setHTML('header-title', `Playlist results for: '${searchQuery}'`);
	currentSearchCategory = 'playlists';
	await topExtensionOff();
}

/**
 * Navigate to Search results extended view > Tags
 * @param {HTMLElement} element
 */
async function searchTagsClick(element) {
	await domAPI.loadPage('main-container', 'pages/searchExtended.html');
	await domAPI.setHTML('header-title', `Tag results for: '${searchQuery}'`);
	currentSearchCategory = 'tags';
	await topExtensionOff();
}

/**
 * Navigate to Search results extended view > All
 * @param {HTMLElement} element
 */
async function searchAllClick(element) {
	await domAPI.loadPage('main-container', 'pages/searchExtended.html');
	await domAPI.setHTML('header-title', `All results for: '${searchQuery}'`);
	currentSearchCategory = 'all';
	await topExtensionOff();
}

/**
 * Navigate to Search results extended view > All
 * @param {HTMLElement} element
 */
async function settingsClick(element) {
	await domAPI.loadPage('top-container-extended', 'pages/settings.html');
	await topExtensionOn();
}

/**
 * Toggles the overview off.
 */
async function topExtensionOff() {
	if (topContainerIsExtended) {
		await domAPI.setStyle('top-container', 'visibility', 'visible');
		await domAPI.setStyle('top-container-extended', 'visibility', 'hidden');
		topContainerIsExtended = false;
	}
}

/**
 * Toggles the overview on.
 */
async function topExtensionOn() {
	if (!topContainerIsExtended) {
		await domAPI.setStyle('top-container', 'visibility', 'hidden');
		await domAPI.setStyle('top-container-extended', 'visibility', 'visible');
		topContainerIsExtended = true;
	}
}

/**
 * Navigate to Overview extended > Queue view
 * @param {HTMLElement} element
 */
async function ovExQueueClick(element) {
	await domAPI.loadPage('top-container-extended', 'pages/overviewExtended.html');
	await topExtensionOn();
}

/**
 * Navigate to Overview extended > Lyrics view
 * @param {HTMLElement} element
 */
async function ovExLyricsClick(element) {
	await domAPI.loadPage('top-container-extended', 'pages/ovExLyrics.html');
	await topExtensionOn();
}

/**
 * Navigate to Overview extended > Track view
 * @param {HTMLElement} element
 */
async function ovExTrackClick(element) {
	await domAPI.loadPage('top-container-extended', 'pages/ovExTrack.html');
	await topExtensionOn();
}
