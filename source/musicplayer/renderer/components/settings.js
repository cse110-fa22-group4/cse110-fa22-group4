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
/**
 * @description Displays loaded settings on page load. Adds watched directories
 * to the 'watched-folders' div and changes toggles to the correct state. Assumes
 * the settings match their respective id name.
 * 
 * WIP
 */
 async function loadSettingsState(){	
	genAPI.debugLog("im in the settings function", 'settings-tests')
	let settings = await fsAPI.getSettings()

	if ('watchedDir' in settings){
		//watchedDir is a list of directories. we will format watchedDirDisplay 
		//to be the inner HTML for the 'watched-folders' div
		let watchedDirDisplay = '';
		for(dir in settings[watchedDir]){
			watchedDirDisplay += '<p>' + dir + '</p><br>';
		}
		await domAPI.setHTML('watched-folders', watchedDirDisplay);

		//done with this key, so let's delete it so we can loop through the rest.
		delete settings['watchedDir']
	}

	//miscellaneous deletions
	delete settings['wrong_file']

	for(let setting in settings){
		genApi.debugLog(`checking setting ${setting}`, 'settings-tests');
		await domAPI.setValue(setting, 'checked', 'true');
	}
}