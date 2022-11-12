const path = require('path');
const {
    getSettings,
    writeToSetting,
    deleteSetting,
    writeSettings,
} = require('../preload/fs/settings/settingsAPICalls');

const {
    getSongs,
    appendSong,
    appendSongs,
    writeSongs,
    removeSong,
} = require('../preload/fs/songs/songsAPICalls');

const {
    recursiveSearchAtPath,
    getSourceFolder,
    setStoragePath,
} = require('../preload/fs/fsAPICalls');

/**
 * @description Tests the settings API.
 */
function testSettings() {
    const settings = getSettings();

    writeToSetting('testingStatus', 'inProgress');

    console.log('Settings contents: ' + getSettings());
    deleteSetting('testingStatus');

    console.log('Settings match after add and delete: ' + (JSON.stringify(settings) === JSON.stringify(getSettings())));

    writeSettings((getSettings()));

    console.log('Settings match after rewrite: ' + (JSON.stringify(settings) === JSON.stringify(getSettings())));
}

/**
 * @description Tests the songs API.
 */
function testSongs() {
    let songs = getSongs();

    const songPaths = recursiveSearchAtPath(path.join(getSourceFolder(), 'user/songs'));
    const songList = {};
    for (const song in songPaths) {
        if (!song) continue;
        songList[songPaths[song].split('\\').pop().split('/').pop()] = songPaths[song];
    }
    writeSongs(songList);

    console.log('Songs match after reload: ' + (JSON.stringify(songs) === JSON.stringify(getSongs())));

    const names = Object.keys(songList);
    if (
        names[0] === 'Tobu - Hope [NCS Release].mp3' &&
        names[1] === 'Tobu - Infectious [NCS Release].mp3' &&
        names[2] === 'Different Heaven & EH!DE - My Heart [NCS Release].mp3') {
        console.log('Songs loaded in correctly!');
    } else {
        console.log('Warning: songs not loaded in correctly');
    }

    songs = getSongs();

    const testSongName = 'Alan Walker - Fade.mp3';
    const testSongPath = path.join(getSourceFolder(), 'user/songs/Alan Walker - Fade.mp3');
    appendSong(testSongName, testSongPath);
    removeSong(testSongName);

    console.log('Songs match after remove and append: ' + (JSON.stringify(songs) === JSON.stringify(getSongs())));
}

/**
 * @description Runs all of the unit tests for APIs.
 * @return {Promise<void>}
 */
async function testAll() {
    await setStoragePath('user/data');

    // read songs from songs folder and write their paths to songs.json.
    // Check if song names are as expected
    testSongs();

    // tests reading, writing, and deleting in settings
    testSettings();
}


module.exports = {
    testAll,
};
