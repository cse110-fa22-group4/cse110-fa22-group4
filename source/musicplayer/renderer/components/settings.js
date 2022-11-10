window.addEventListener('DOMContentLoaded', ()=> {
    jqAPI.onEvent('body', 'click', '#settings-rescan', rescanClick);
    jqAPI.onEvent('body', 'click', '#add-paths-button', addPath);
});

/**
 * @description OnClick event handler for the settings rescan button.
 * @param {HTMLElement} element
 */
function rescanClick(element) {
    ffmpegAPI.setBinPath();
    const scannedSongs = { };
    const settings = fsAPI.getSetting('watchedDir');
    if (settings === undefined) return;
    settings.forEach((path) => {
        const songs = fsAPI.recursiveSearchAtPath(path[0]);
        songs.forEach((s) => {
            scannedSongs[s] = ffmpegAPI.readMetadata(s);
        });
    });
    fsAPI.writeSongs(scannedSongs);
    console.log(scannedSongs);
}

/**
 * @description Handles adding paths to the file system.
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
async function addPath(element) {
    const dirs = await genAPI.openDialog({properties: ['openDirectory']});
    console.log(dirs['filePaths']);
    let watched = fsAPI.getSetting('watchedDir');
    if (watched === undefined) watched = [];
    watched.push(dirs['filePaths']);
    fsAPI.writeToSetting('watchedDir', watched);
}
