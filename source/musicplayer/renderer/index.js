/**
 * @namespace Renderer
 */

/* GLOBAL VARS */
let topContainerIsExtended = false; // to toggle extended view of top container
const searchQuery = ''; // the current query entered into the search bar
let searchQueryGlobal;
let currentSearchCategory;
const currentPage = { // helper to track current page
	home: true,
	overview: false,
	library: false,
	artists: false,
	albums: false,
	tags: false,
	playlists: false,
	settings: false,
};

/* GENERATE HOME PAGE */
window.addEventListener('DOMContentLoaded', async () => {
	await domAPI.setStyle('top-container-extended', 'visibility', 'hidden');
	await domAPI.loadPage('sidebar-container', 'components/sidebar.html');
	await domAPI.setThemeColor(await fsAPI.getSetting('primaryColor'), await fsAPI.getSetting('secondaryColor'));
	await domAPI.setStyleClassToggle('sidebar-btn-container-home', 'sidebar-btn-active', true);
	await domAPI.loadPage('overview-container', 'components/overview.html');
	await domAPI.loadPage('main-header-container', 'components/mainHeader.html');
	await domAPI.loadPage('main-container', 'pages/home.html');
	await domAPI.loadPage('playback-container', 'components/playback.html');
	await domAPI.loadPage('searchbar-container', 'components/searchbar.html');
	await domAPI.addEventListener( 'btn-home', 'click', homeClick);
	await domAPI.addEventListener( 'btn-overview', 'click', overviewClick);
	await domAPI.addEventListener( 'btn-library', 'click', libraryClick);
	await domAPI.addEventListener( 'btn-playlists', 'click', playlistsClick);
	await domAPI.addEventListener( 'btn-settings', 'click', settingsClick);



	await domAPI.addEventListener( 'playbackArt', 'click', overviewClick);
	await domAPI.addEventListener( 'playlists-bottom-btn', 'click', playlistsClick);
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
	await resetSidebarButtons();
	await domAPI.setStyleClassToggle('sidebar-btn-container-home', 'sidebar-btn-active', true);
	await topExtensionOff();
}

/**
 * Navigate to Overview (Now Playing) view
 * @param {HTMLElement} element
 */
async function overviewClick(element) {
	await domAPI.loadPage('top-container-extended', 'components/overviewExtended.html');
	await domAPI.loadPage('ovEx-content-container', 'pages/ovExQueue.html');
	await resetSidebarButtons();
	await domAPI.setStyleClassToggle('sidebar-btn-container-nowPlaying', 'sidebar-btn-active', true);
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
	await resetSidebarButtons();
	await domAPI.setStyleClassToggle('sidebar-btn-container-library', 'sidebar-btn-active', true);
	await topExtensionOff();
}
/**
 * Post library loading function callback.
 */
async function postLibraryLoad() {

}

/**
 * Navigate to Playlists view
 * @param {HTMLElement} element
 */
async function playlistsClick(element) {
	await domAPI.loadPage('main-container', 'pages/libraryPlaylists.html');
	await domAPI.setHTML('header-title', 'Playlists');
	await domAPI.setHTML('header-subtitle', 'All');
	await resetSidebarButtons();
	await domAPI.setStyleClassToggle('sidebar-btn-container-playlists', 'sidebar-btn-active', true);
	await topExtensionOff();
}

/**
 * Navigate to Search results extended view > All
 * @param {HTMLElement} element
 */
async function settingsClick(element) {
	await domAPI.loadPage('top-container-extended', 'pages/settings.html');
	if (topContainerIsExtended) {
		await topExtensionOff();
	} else {
		await topExtensionOn();
	}
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
 * Toggles off background highlight of sidebar buttons.
 */
async function resetSidebarButtons() {
	await domAPI.setStyleClassToggle('sidebar-btn-container-home', 'sidebar-btn-active', false);
	await domAPI.setStyleClassToggle('sidebar-btn-container-nowPlaying', 'sidebar-btn-active', false);
	await domAPI.setStyleClassToggle('sidebar-btn-container-library', 'sidebar-btn-active', false);
	await domAPI.setStyleClassToggle('sidebar-btn-container-playlists', 'sidebar-btn-active', false);
}

/**
 *  Resets page values to false.
 */
async function resetCurrentPage() {
	Object.values(currentPage).forEach((page) => {
		page = false;
	});
}
