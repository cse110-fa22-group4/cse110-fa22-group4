window.addEventListener("DOMContentLoaded", ()=> {
    jqAPI.onEvent('body', 'click', '#settings-rescan', rescanClick);
    jqAPI.onEvent('body', 'click', '#add-paths-button', addPath);
});

function rescanClick(element) {
    ffmpegAPI.setBinPath();
    let scannedSongs = { };
    let settings = fsAPI.getSetting('watchedDir');
    if (settings === undefined) return;
    settings.forEach(path => {
        let songs = fsAPI.recursiveSearchAtPath(path[0]);
        songs.forEach(s => {
            scannedSongs[s] = ffmpegAPI.readMetadata(s);
        });
    });
    fsAPI.writeSongs(scannedSongs);
    console.log(scannedSongs);
}

async function addPath(element) {
    let dirs = await genAPI.openDialog({ properties: ['openDirectory']});
    console.log(dirs["filePaths"]);
    let watched = fsAPI.getSetting('watchedDir');
    if (watched === undefined) watched = [];
    watched.push(dirs["filePaths"]);
    fsAPI.writeToSetting('watchedDir', watched);
}