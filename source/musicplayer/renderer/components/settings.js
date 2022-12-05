/* COLOR THEME PICKER */
const themeColorsPrimary = [
	'#8e4f46', // red-ish
	'#de802d', // orange-ish
	'#a98f45', // yellow-ish
	'#3c7f4f', // green-ish
	'#2e436a', // blue-ish
	'#39354d', // indigo-ish
	'#995d9b', // violet-ish
	'#43918b', // teal-ish
	'#1a1a1a', // dark
	'#67878E', // default
];
const themeColorsSecondary = [
	'#8e4f46', // red-ish
	'#de802d', // orange-ish
	'#a98f45', // yellow-ish
	'#3c7f4f', // green-ish
	'#2e436a', // blue-ish
	'#39354d', // indigo-ish
	'#995d9b', // violet-ish
	'#43918b', // teal-ish
	'#1a1a1a', // dark
	'#67878E', // default
];

let themeColorsPrimaryCount = themeColorsPrimary.length;
let themeColorsSecondaryCount = themeColorsPrimary.length;
window.addEventListener('settings-loaded', async ()=> {
	await loadSettingsState();
	await domAPI.addEventListener('settings-rescan', 'click', rescanClick);
	await domAPI.addEventListener('add-paths-button', 'click', addPath);
	await domAPI.addEventListener('enable-scan-on-startup', 'click', enableToggleableSetting);
	await domAPI.addEventListener('enable-dark-mode', 'click', enableToggleableSetting);
	await domAPI.addEventListener('add-playlist-input', 'change', importButtonPressed);
	await updatePlaylistOptionsSettings();

	await domAPI.addEventListener( 'btn-theme-color-primary', 'click', changeThemeColorPrimary);
	await domAPI.addEventListener( 'btn-theme-color-secondary', 'click', changeThemeColorSecondary);
	await domAPI.addEventListener( 'export-selected-playlist', 'click', exportButtonPressed);
});

/**
 * @description OnClick event handler for the settings rescan button.
 * @param {HTMLElement} element
 */
async function rescanClick(element) {
	// let's unhide the progress bar stuff
	await unhideProgressBar();

	const scannedSongs = { };
	const settings = await fsAPI.getSetting('watchedDir');
	if (settings === undefined) return;
	for (const path of settings) {
		const obj = await ffmpegAPI.useMultiFFmpeg(path);
		Object.assign(scannedSongs, obj);
	}
	console.log(scannedSongs);
	await fsAPI.writeSongs(scannedSongs);

	// now that we are done, we hide element again
	await hideProgressBar();
}

/**
 * @description Handles adding paths to the file system.
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
async function addPath(element) {
	const dirs = await genAPI.openDialog({properties: ['openDirectory']});
	await genAPI.debugLog(dirs['filePaths'], 'settings-tests');
	if (!dirs['canceled']) {
		let watched = await fsAPI.getSetting('watchedDir');
		if (watched === undefined) watched = [];
		for (const dir of dirs['filePaths']) {
			watched.push(dir);
		}
		await fsAPI.writeToSetting('watchedDir', watched);
		await updateWatchedFoldersDisplay();
		// we do a rescan because the user just added a folder.
		await rescanClick();
	}
}

/**
 * @description This function is called anytime a toggleable setting is clicked, and writes the setting to storage.
 * Assumes that element id and key in settings exactly match.
 * @param {HTMLElement} element
 */
async function enableToggleableSetting(element) {
	// if we enable dark mode, we want it to take place immediately
	if (element.id == 'enable-dark-mode') {
		await domAPI.toggleDarkTheme();
	}

	const isEnabled = await domAPI.getProperty(element.id, 'checked');
	await fsAPI.writeToSetting(element.id, isEnabled);
}

/**
 * @description removes the watched directory from the list
 * @param {HTMLElement} element
 *
 */
async function removeDirectory(element) {
	const watchedDirs = await fsAPI.getSetting('watchedDir');
	if (watchedDirs === undefined) return;
	const index = watchedDirs.indexOf(element.id);
	if (index > -1) {
		watchedDirs.splice(index, 1);
	}
	await fsAPI.writeToSetting('watchedDir', watchedDirs);
	await updateWatchedFoldersDisplay();
}

/**
 * @description updates the watched folders div based on stored settings
 * Note that you cannot add multiple of the same event listeners to the same object,
 * so this function should not impact performance adding event listeners every time
 */
async function updateWatchedFoldersDisplay() {
	const watchedDirs = await fsAPI.getSetting('watchedDir');
	if (watchedDirs !== undefined) {
		// watchedDir is a list of directories. we will format watchedDirDisplay
		// to be the inner HTML for the 'watched-folders' div
		let watchedDirDisplay = '';
		for (const dir of watchedDirs) {
			if (!dir) continue;
			watchedDirDisplay +=
				`<div class="watched-folders-element"> <p> ${dir} </p> <button id="${dir}"> - </button></div>`;
		}
		await domAPI.setHTML('watched-folders', watchedDirDisplay);

		// adding event listeners to the buttons
		for (const dir of watchedDirs) {
			await domAPI.addEventListener(`${dir}`, 'click', removeDirectory);
		}
	}
}

/**
 * @description Displays loaded settings on page load. Adds watched directories
 * to the 'watched-folders' div and changes toggles to the correct state. Assumes
 * the settings match their respective id name.
 */
async function loadSettingsState() {
	await updateWatchedFoldersDisplay();

	// These are the toggles relevant to the settings menu
	const relevantToggles = ['enable-scan-on-startup', 'enable-dark-mode']; /* 'enable-dark-mode' */
	const allSettings = await fsAPI.getSettings();
	for (let i=0; i < relevantToggles.length; i++) {
		if (relevantToggles[i] in allSettings) {
			await domAPI.setProperty(relevantToggles[i], 'checked', 'true');
		}
	}
}

/**
 * @description Set Primary Theme Color
 */
async function changeThemeColorPrimary() {
	await domAPI.setThemeColor(themeColorsPrimary[themeColorsPrimaryCount % themeColorsPrimary.length], '');
	await fsAPI.writeToSetting('primaryColor', themeColorsPrimary[themeColorsPrimaryCount % themeColorsPrimary.length]);
	themeColorsPrimaryCount++;
}

/**
 * @description Set Secondary Theme Color
 */
async function changeThemeColorSecondary() {
	await domAPI.setThemeColor('', themeColorsSecondary[themeColorsSecondaryCount % themeColorsSecondary.length]);
	await fsAPI.writeToSetting('secondaryColor',
		themeColorsSecondary[themeColorsSecondaryCount % themeColorsSecondary.length]);
	themeColorsSecondaryCount--;
	if (themeColorsSecondaryCount === 0) {
		themeColorsSecondaryCount = themeColorsSecondary.length;
	}
}

/**
 * @description Unhide the progress bar elements for when we start loading in a library.
 */
async function unhideProgressBar() {
	domAPI.setProperty('rescan-progress', 'value', 0);
	domAPI.setProperty('rescan-progress-container', 'hidden', false);
	domAPI.setProperty('rescan-progress', 'hidden', false);
}

/**
 * @description After library loading is done,  hide the progress bar again
 */
async function hideProgressBar() {
	domAPI.setProperty('rescan-progress-container', 'hidden', true);
	domAPI.setProperty('rescan-progress', 'hidden', true);
}

/**
 * @name updatePlaylistOptionsSettings
 * @description Update menu options for playlists drop-down. Originally in playlists.js
 * but copied over and modified to prevent scoping issues
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
async function updatePlaylistOptionsSettings() {
	let playlistMenuOptions = '<option value="" selected disabled>Select a playlist...</option>';
	const userPlaylists = await fsAPI.getAllPlaylists();
	for (let i = 0; i < userPlaylists.length; i++) {
		const option = `<option id="playlist-option-${userPlaylists[i]}" value="${userPlaylists[i]}">
            ${userPlaylists[i]}</option>`;
		playlistMenuOptions += option;
	}

	// Insert playlist options into container
	await domAPI.setHTML('select-playlist-export', playlistMenuOptions);
}

/**
 * @description This function exports the playlist selected folder
 */
async function exportButtonPressed() {
	// let's get the selected playlist
	const selectedPlaylist = await domAPI.getProperty('select-playlist-export', 'value');

	// if there is nothing selected, let's let the user know that is a problem.
	if (await selectedPlaylist == '') {
		await giveUserFeedback('No playlist selected');
		return 0;
	}

	// if there is something selected, let's have the user select a directory to export to
	const dirs = await genAPI.openDialog({properties: ['openDirectory']});
	await genAPI.debugLog(dirs['filePaths'], 'settings-tests');
	if (!dirs['canceled']) {
		const exportPath = dirs['filePaths'][0];
		fsAPI.exportPlaylist(selectedPlaylist, exportPath);
	}
}

/**
 * @description this function will import a playlist file. It will write the playlist
 * name into the readonly textbox as well
 * @param {*} event
 */
async function importButtonPressed(event) {
	// there is no way to detect if the user pressed cancel on the file picker
	const file = event.files[0];
	const reader = new FileReader();
	let playlist;
	reader.addEventListener('load', async (event)=>{
		// play list file
		playlist = JSON.parse(event.target.result);

		// play list name
		// if there is no name in the field, we will stop, and tell the user
		// that they need to input a name
		// otherwise we use what the user typed in
		const typedName = await domAPI.getProperty('new-playlist-name', 'value');
		let playlistName;
		if (typedName == '') {
			await giveUserFeedback('Please type a playlist name');
			return;
		} else {
			playlistName = typedName;
		}

		// now let's write it
		fsAPI.writePlaylist(playlistName, playlist);

		// let's tell the user it was successfuly
		await giveUserFeedback(`Imported playlist ${playlistName}`);
	});
	reader.readAsText(file);
}
