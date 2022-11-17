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
	await domAPI.addEventListener( 'btn-home', 'click', homeClick);
	await domAPI.addEventListener( 'btn-overview', 'click', overviewClick);
	await domAPI.addEventListener( 'btn-library', 'click', libraryClick);
	await domAPI.addEventListener( 'btn-library-artists', 'click', libraryArtistsClick);
	await domAPI.addEventListener( 'btn-library-albums', 'click', libraryAlbumsClick);
	await domAPI.addEventListener( 'btn-library-genres', 'click', libraryGenresClick);
	await domAPI.addEventListener( 'btn-library-tags', 'click', libraryTagsClick);
	await domAPI.addEventListener( 'btn-playlists', 'click', playlistsClick);
	await domAPI.addEventListener( 'btn-settings', 'click', settingsClick);
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
	await domAPI.loadPage('top-container-extended', 'components/overviewExtended.html');
	await domAPI.loadPage('ovEx-content-container', 'pages/ovExQueue.html');
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