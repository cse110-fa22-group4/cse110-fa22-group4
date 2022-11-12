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

function testSettings() {

    let settingName = 'testingStatus';
    testGetSettings();

    // run twice to test override
    testWriteToSetting(settingName);
    testWriteToSetting(settingName);

    // run twice to test deleting non-existent setting
    testDeleteSetting(settingName);
    testDeleteSetting(settingName);

    settings = fs.getSettings();
    testWriteSettings(settings);

}

function testGetSettings() {
    settings = fs.getSettings();
    console.log('settings file: ' + JSON.stringify(settings));
}

function testWriteToSetting(name) {
    let val = true;
    fs.writeToSetting(name, val);
    setting = JSON.parse(fs.getSettings()[name]);
    console.log('Write to Setting Test Passed: ' + (setting==val));
}

function testDeleteSetting(name) {
    fs.deleteSetting(name);
    settings = fs.getSettings();
    console.log("Setting 'testingStatus' successfully removed: " + (settings['testingStatus']==null));
}

function testWriteSettings(settings) {
    fs.writeSettings(settings);
    settingsNew = fs.getSettings();
    console.log('WriteSettings successful: ' + (JSON.stringify(settings) == JSON.stringify(settingsNew)));
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
    }
    else
        console.log("Warning: songs not loaded in correctly");
    
    songs = fs.getSongs();

    testSongName = 'Alan Walker - Fade.mp3';
    testSongPath = path.join(fs.getSourceFolder(), 'user/songs/Alan Walker - Fade.mp3');
    //fs.appendSong(testSongName, testSongPath);
    //fs.removeSong(testSongName);
    
    console.log('Songs match after remove and append: ' + (JSON.stringify(songs) == JSON.stringify(fs.getSongs())));

    songs = getSongs();

    const testSongName = 'Alan Walker - Fade.mp3';
    const testSongPath = path.join(getSourceFolder(), 'user/songs/Alan Walker - Fade.mp3');
    appendSong(testSongName, testSongPath);
    removeSong(testSongName);

    console.log('Songs match after remove and append: ' + (JSON.stringify(songs) === JSON.stringify(getSongs())));
}

function testWriteSong() {

}

/**
 * @description Runs all of the unit tests for APIs.
 * @return {Promise<void>}
 */
async function testAll() {
    await setStoragePath('user_1/data');
    let folderPath = 'user_1/songs';
    testSettings();
    //testSongs(folderPath);

    await setStoragePath('user_2/data');
    folderPath = 'user_2/songs';
    testSettings();
    //testSongs(folderPath);

    await setStoragePath('user_3/data');
    folderPath = 'user_3/songs';
    testSettings();
    //testSongs(folderPath);

    //reset testing environment



}


module.exports = {
    testAll,
};
