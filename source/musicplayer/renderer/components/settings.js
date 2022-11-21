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

	await domAPI.addEventListener( 'btn-theme-color-primary', 'click', changeThemeColorPrimary);
	await domAPI.addEventListener( 'btn-theme-color-secondary', 'click', changeThemeColorSecondary);
});

/**
 * @description OnClick event handler for the settings rescan button.
 * @param {HTMLElement} element
 */
async function rescanClick(element) {
	await ffmpegAPI.setBinPath();
	const scannedSongs = { };
	const settings = await fsAPI.getSetting('watchedDir');
	if (settings === undefined) return;
	for (const path of settings) {
		// todo: implement cli app
	}
	await fsAPI.writeSongs(scannedSongs);
	await genAPI.debugLog(scannedSongs, 'settings-tests');
}

/**
 * @description Handles adding paths to the file system.
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
async function addPath(element) {
	const dirs = await genAPI.openDialog({properties: ['openDirectory']});
	await genAPI.debugLog(dirs['filePaths'], 'settings-tests');
	let watched = await fsAPI.getSetting('watchedDir');
	if (watched === undefined) watched = [];
	watched.push(dirs['filePaths']);
	await fsAPI.writeToSetting('watchedDir', watched);
}

/**
 * @description This function is called anytime a toggleable setting is clicked, and writes the setting to storage.
 * Assumes that element id and key in settings exactly match.
 * @param {HTMLElement} element
 */
async function enableToggleableSetting(element) {
	const isEnabled = await domAPI.getProperty(element.id, 'checked');
	console.log(isEnabled);
	fsAPI.writeToSetting(element.id, isEnabled);
}

/**
 * @description Displays loaded settings on page load. Adds watched directories
 * to the 'watched-folders' div and changes toggles to the correct state. Assumes
 * the settings match their respective id name.
 */
async function loadSettingsState() {
	genAPI.debugLog('im in the settings function', 'settings-tests');

	const watchedDirs = await fsAPI.getSetting('watchedDir');
	if (watchedDirs !== undefined) {
		// watchedDir is a list of directories. we will format watchedDirDisplay
		// to be the inner HTML for the 'watched-folders' div
		let watchedDirDisplay = '';
		for (const dir in watchedDirs) {
			if (!dir) continue;
			watchedDirDisplay += '<p>' + dir + '</p><br>';
		}
		await domAPI.setHTML('watched-folders', watchedDirDisplay);
	}

	// These are the keys relevant to the settings menu
	const relevantSettings = ['enable-scan-on-startup', 'enable-dark-mode'];
	const allSettings = await fsAPI.getSettings();

	for (let i=0; i < relevantSettings.length; i++) {
		if (relevantSettings[i] in allSettings) {
			await domAPI.setProperty(relevantSettings[i], 'checked', 'true');
		}
	}
}

/**
 * Set Primary Theme Color
 */
async function changeThemeColorPrimary() {
	await domAPI.setThemeColor(themeColorsPrimary[themeColorsPrimaryCount % themeColorsPrimary.length], '');
	themeColorsPrimaryCount++;
}

/**
 * Set Secondary Theme Color
 */
async function changeThemeColorSecondary() {
	await domAPI.setThemeColor('', themeColorsSecondary[themeColorsSecondaryCount % themeColorsSecondary.length]);
	themeColorsSecondaryCount--;
	if (themeColorsSecondaryCount == 0) {
		themeColorsSecondaryCount = themeColorsSecondary.length;
	}
}
