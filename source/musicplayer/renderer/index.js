/**
 * @namespace Renderer
 */

let topContainerIsExtended = false; // helper to track extended overview
let mainButtonsIsOn = false; // helper to track main buttons visibility
const searchQuery = ''; // the current query entered into the search bar
let searchQueryGlobal = '';
const currentPage = { // helper to track current page
	home: true,
	library: false,
	playlists: false,
};

window.addEventListener('DOMContentLoaded', async () => {
    // load page components
	await domAPI.setStyle('main-buttons-container', 'visibility', 'hidden');
    await domAPI.loadPage('top-container-extended', 'pages/settings.html');
	await domAPI.setStyle('top-container-extended', 'visibility', 'hidden');
	await domAPI.loadPage('sidebar-container', 'components/sidebar.html');
	await domAPI.setStyleClassToggle('sidebar-btn-container-home', 'sidebar-btn-active', true);
	await domAPI.loadPage('overview-container', 'components/overview.html');
	await domAPI.loadPage('main-header-container', 'components/mainHeader.html');
	await domAPI.loadPage('main-container', 'pages/home.html');
	await domAPI.loadPage('playback-container', 'components/playback.html');
	await domAPI.loadPage('searchbar-container', 'components/searchbar.html');

    // set theme color
	await domAPI.setThemeColor(await fsAPI.getSetting('primaryColor'), await fsAPI.getSetting('secondaryColor'));
	if (await fsAPI.getSetting('enable-dark-mode') == true) {
		await domAPI.toggleDarkTheme();
	}

    // navigation event listeners
	await domAPI.addEventListener( 'btn-home', 'click', homeClick);
	await domAPI.addEventListener( 'btn-library', 'click', libraryClick);
	await domAPI.addEventListener( 'btn-playlists', 'click', playlistsClick);
	await domAPI.addEventListener( 'btn-settings', 'click', settingsClick);
	// await domAPI.addEventListener( 'playbackArt', 'click', queueClick);          - moved to mainHeader.js momentarily
	// await domAPI.addEventListener( 'playlists-bottom-btn', 'click', queueClick); - moved to mainHeader.js mo
	// await domAPI.addEventListener( 'btn-overview', 'click', overviewClick);
});

/**
 * @name homeClick
 * @description Navigate to Home view.
 * @param {HTMLElement} element
 */
async function homeClick(element) {
    // turn off main extended buttons
    await mainButtonsOff();

    // load page
	await domAPI.loadPage('main-container', 'pages/home.html');

    // set the header values
	await domAPI.setHTML('header-title', 'Home');
	await domAPI.setHTML('header-subtitle', '');

    // update the sidebar
	await resetSidebarButtons();
	await domAPI.setStyleClassToggle('sidebar-btn-container-home', 'sidebar-btn-active', true);

    // turn off overview extension if on
	await topExtensionOff();

    // set as current page
    await setCurrentPage('home');
}

/**
 * @name libraryClick
 * @description Navigate to Library view.
 * @param {HTMLElement} element
 */
async function libraryClick(element) {
    // turn off main extended buttons
    await mainButtonsOff();

    // load page
	await domAPI.loadPage('main-container', 'pages/library.html');

    // set the header values
	await domAPI.setHTML('header-title', 'Library');
	await domAPI.setHTML('header-subtitle', 'All');

    // update the sidebar
	await resetSidebarButtons();
	await domAPI.setStyleClassToggle('sidebar-btn-container-library', 'sidebar-btn-active', true);

    // turn off overview extension if on
	await topExtensionOff();

    // set as current page
    await setCurrentPage('library');
}

/**
 * @name playlistsClick
 * @description Navigate to Playlists view.
 * @param {HTMLElement} element
 */
async function playlistsClick(element) {
    // turn off main extended buttons
    await mainButtonsOff();

    // load page
	await domAPI.loadPage('main-container', 'pages/libraryPlaylists.html');

    // set the header values
	await domAPI.setHTML('header-title', 'Playlists');
	await domAPI.setHTML('header-subtitle', 'All');

    // update the sidebar
	await resetSidebarButtons();
	await domAPI.setStyleClassToggle('sidebar-btn-container-playlists', 'sidebar-btn-active', true);

    // turn off overview extension if on
	await topExtensionOff();

    // set as current page
    await setCurrentPage('playlists');
}

/**
 * @name settingsClick
 * @description Navigate to Settings view.
 * @param {HTMLElement} element
 */
async function settingsClick(element) {
    // turn off main extended buttons
    await mainButtonsOff();
    
    if(topContainerIsExtended) {
        await topExtensionOff();
    } else {
        await topExtensionOn();
    }

	await updatePlaylistOptionsSettings();
}

/**
 * @name topExtensionOff
 * @description Toggles extended overview off.
 * @return {Promise<void>}
 */
async function topExtensionOff() {
	if (topContainerIsExtended) {
		await domAPI.setStyle('top-container', 'visibility', 'visible');
		await domAPI.setStyle('top-container-extended', 'visibility', 'hidden');
		topContainerIsExtended = false;
	}
}

/**
 * @name topExtensionOn
 * @description Toggles extended overview on.
 * @return {Promise<void>}
 */
async function topExtensionOn() {
	if (!topContainerIsExtended) {
		await domAPI.setStyle('top-container', 'visibility', 'hidden');
		await domAPI.setStyle('top-container-extended', 'visibility', 'visible');
		topContainerIsExtended = true;
	}
}

/**
 * @name mainButtonsOff
 * @description Toggles main buttons off.
 * @return {Promise<void>}
 */
 async function mainButtonsOff() {
	if (mainButtonsIsOn) {
        await domAPI.setStyle('main-buttons-container', 'visibility', 'visible');
        await domAPI.setStyle('main-buttons-container', 'visibility', 'hidden');
		mainButtonsIsOn = false;
	}
}

/**
 * @name mainButtonsOn
 * @description Toggles main buttons on.
 * @param {string} pathHTML The path of the html to load.
 * @return {Promise<void>}
 */
async function mainButtonsOn(pathHTML) {
	if (!mainButtonsIsOn) {
        await domAPI.setStyle('main-buttons-container', 'visibility', 'hidden');
        await domAPI.setStyle('main-buttons-container', 'visibility', 'visible');
		mainButtonsIsOn = true;
	}
	await domAPI.loadPage('main-buttons-container', pathHTML);
}

/**
 * @name resetSidebarButtons
 * @description Reset active sidebar button.
 * @return {Promise<void>}
 */
async function resetSidebarButtons() {
	await domAPI.setStyleClassToggle('sidebar-btn-container-home', 'sidebar-btn-active', false);
	await domAPI.setStyleClassToggle('sidebar-btn-container-library', 'sidebar-btn-active', false);
	await domAPI.setStyleClassToggle('sidebar-btn-container-playlists', 'sidebar-btn-active', false);
}

/**
 * @name setCurrentPage
 * @description Sets current page value.
 * @param {string} currPage The name of the page to set as current.
 * @return {Promise<void>}
 */
async function setCurrentPage(currPage) {
    for (const [key, value] of Object.entries(currentPage)) {
        currentPage[key] = false;
    }
    currentPage[currPage] = true;
}

/**
 * @name getCurrentPage
 * @description Gets current page value.
 * @return {string} The current page.
 */
 async function getCurrentPage() {
    for (const [key, value] of Object.entries(currentPage)) {
        if(value == true) {
            return key;
        }
    }
}


/**
 * @name giveUserFeedback
 * @description Displays feedback to the user.
 * @param {string} feedback The feedback to send to the user.
 * @return {Promise<void>}
 */
 async function giveUserFeedback(feedback) {
    let messageBox = document.querySelector('#user-feedback-container');
    messageBox.innerHTML = `<div id="user-feedback">${feedback}</div>`;

    setTimeout(() => {
        messageBox.innerHTML = '';
    }, 2500)
}