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
async function testSettings() {
    const settings = getSettings();

    await writeToSetting('testingStatus', 'inProgress');

    console.log('Settings contents: ' + await getSettings());
    await deleteSetting('testingStatus');

    console.log(
        'Settings match after add and delete: ' +
        (JSON.stringify(settings) === JSON.stringify(await getSettings())));

    await writeSettings((getSettings()));

    console.log('Settings match after rewrite: ' + (JSON.stringify(settings) === JSON.stringify(await getSettings())));
}

/**
 * @description Tests the songs API.
 */
async function testSongs() {
    let songs = await getSongs();

    const songPaths = recursiveSearchAtPath(path.join(await getSourceFolder(), 'user/songs'));
    const songList = {};
    for (const song in songPaths) {
        if (!song) continue;
        songList[songPaths[song].split('\\').pop().split('/').pop()] = songPaths[song];
    }
    await writeSongs(songList);

    console.log('Songs match after reload: ' + (JSON.stringify(songs) === JSON.stringify(await getSongs())));

    const names = Object.keys(songList);
    if (
        names[0] === 'Tobu - Hope [NCS Release].mp3' &&
        names[1] === 'Tobu - Infectious [NCS Release].mp3' &&
        names[2] === 'Different Heaven & EH!DE - My Heart [NCS Release].mp3') {
        console.log('Songs loaded in correctly!');
    } else {
        console.log('Warning: songs not loaded in correctly');
    }

    songs = await getSongs();

    const testSongName = 'Alan Walker - Fade.mp3';
    const testSongPath = path.join(await getSourceFolder(), 'user/songs/Alan Walker - Fade.mp3');
    await appendSong(testSongName, testSongPath);
    await removeSong(testSongName);

    console.log('Songs match after remove and append: ' + (JSON.stringify(songs) === JSON.stringify(await getSongs())));
}

/**
 * @description Runs all of the unit tests for APIs.
 * @return {Promise<void>}
 */
async function testAll() {
    await setStoragePath('user/data');

    // read songs from songs folder and write their paths to songs.json.
    // Check if song names are as expected
    await testSongs();

    // tests reading, writing, and deleting in settings
    await testSettings();
}


module.exports = {
    testAll,
};
