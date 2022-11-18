window.addEventListener('settings-loaded', async ()=> {
	await domAPI.addEventListener('settings-rescan', 'click', rescanClick);
	await domAPI.addEventListener('add-paths-button', 'click', addPath);
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
