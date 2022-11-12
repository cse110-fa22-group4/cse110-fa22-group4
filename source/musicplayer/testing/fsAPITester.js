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
    await testGetSettings();

    // run twice to test override
    await testWriteToSetting(settingName);
    await testWriteToSetting(settingName);

    await testGetSettings();

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
    //could be better check
    console.log('Write to Setting Test Passed: ' + (setting==val));
}

async function testDeleteSetting(name) {
    await deleteSetting(name);
    settings = await getSettings();
    //could be better check
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
async function testSongs(songFolderPaths) {
    //songfolderpaths
    songPaths = []

    for (songFolderPath in songFolderPaths) {
        const localPath = await getSourceFolder();
        //songPaths.push(recursiveSearchAtPath(path.join(localPath, songFolderPaths[songFolderPath])));
        lol = recursiveSearchAtPath(path.join(localPath, "users/user_1/songs"));
    }
}

/*async function testGetSong() {
    
}

async function testAppendSong() {
    
}

async function testDeleteSong() {
    
}

async function testWriteSongs(songs) {
    
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
    //await testSongs(folderPath);
/*
    await setStoragePath('users/user_2/data');
    folderPath = 'users/user_2/songs';
    await testSettings();
    //testSongs(folderPath);

    await setStoragePath('users/user_3/data');
    folderPath = 'users/user_3/songs';
    await testSettings();
    //testSongs(folderPath);

    //reset testing environment*/
}


module.exports = {
    testAll,
};
