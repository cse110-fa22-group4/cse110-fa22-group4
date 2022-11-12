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

async function testSettings() {

    let settingName = 'testingStatus';
    await testGetSettings();

    // run twice to test override
    await testWriteToSetting(settingName);
    await testWriteToSetting(settingName);

    // run twice to test deleting non-existent setting
    await testDeleteSetting(settingName);
    await testDeleteSetting(settingName);

    settings = await getSettings();
    await testWriteSettings(settings);

}

async function testGetSettings() {
    settings = await getSettings();
    console.log('settings file: ' + JSON.stringify(settings));
}

async function testWriteToSetting(name) {
    let val = true;
    await writeToSetting(name, val);
    setting = JSON.parse((await getSettings())[name]);
    console.log('Write to Setting Test Passed: ' + (setting==val));
}

async function testDeleteSetting(name) {
    await deleteSetting(name);
    settings = await getSettings();
    console.log("Setting 'testingStatus' successfully removed: " + (settings['testingStatus']==null));
}

async function testWriteSettings(settings) {
    await writeSettings(settings);
    settingsNew = await getSettings();
    console.log('WriteSettings successful: ' + (JSON.stringify(settings) == JSON.stringify(settingsNew)));
}



/**
 * @description Tests the songs API.
 */
function testSongs(songFolderPaths) {
    //songfolderpaths
    songPaths = []

    for (songFolderPath in songFolderPaths) {
        songPaths.push(recursiveSearchAtPath(path.join(getSourceFolder(), songFolderPath)));
    }
/*
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
*/
}

/*async function testGetSong() {
    settings = await getSettings();
    console.log('settings file: ' + JSON.stringify(settings));
}

async function testAppendSong() {
    let val = true;
    await writeToSetting(name, val);
    setting = JSON.parse(await getSettings()[name]);
    console.log('Write to Setting Test Passed: ' + (setting==val));
}

async function testDeleteSong() {
    await deleteSetting(name);
    settings = await getSettings();
    console.log("Setting 'testingStatus' successfully removed: " + (settings['testingStatus']==null));
}

async function testWriteSongs(songs) {
    await writeSettings(settings);
    settingsNew = await getSettings();
    console.log('WriteSettings successful: ' + (JSON.stringify(settings) == JSON.stringify(settingsNew)));
}*/

/**
 * @description Runs all of the unit tests for APIs.
 * @return {Promise<void>}
 */
async function testAll() {
    await setStoragePath('users/user_1/data');
    let folderPath = [];
    //folderPath.push('users/user_1/songs');
    await testSettings();
    //testSongs(folderPath);

    await setStoragePath('users/user_2/data');
    folderPath = 'users/user_2/songs';
    await testSettings();
    //testSongs(folderPath);

    await setStoragePath('users/user_3/data');
    folderPath = 'users/user_3/songs';
    await testSettings();
    //testSongs(folderPath);

    //reset testing environment



}


module.exports = {
    testAll,
};
