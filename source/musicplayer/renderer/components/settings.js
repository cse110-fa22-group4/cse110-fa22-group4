window.addEventListener("DOMContentLoaded", ()=> {
    jqAPI.onEvent('body', 'click', '#settings-rescan', rescanClick);
    jqAPI.onEvent('body', 'click', '#add-paths-button', addPath);
});

function rescanClick(element) {
    let scannedSongs = [];
    let settings = fsAPI.getSetting('watchedFile');
    if (settings === undefined) return;
    for (let song in settings) {
        scannedSongs.push(fsAPI.recursiveSearchAtPath(song));
    }
    fsAPI.writeSongs(scannedSongs);
}

function addPath(element) {
    window.showDirectoryPicker();
}