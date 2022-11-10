const path = require('path');
const fs = require('../preload/fsAPICalls');


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

function testSongs(folderPath) {

    let songs = fs.getSongs();

    const songPaths = fs.recursiveSearchAtPath(path.join(fs.getSourceFolder(), folderPath));
    let songList = {};
    for (song in songPaths) {
        songList[songPaths[song].split('\\').pop().split('/').pop()] = songPaths[song];
    }
    fs.writeSongs(songList);
    
    console.log('Songs match after reload: ' + (JSON.stringify(songs) == JSON.stringify(fs.getSongs())));
    
    let names = Object.keys(songList);
    if(names[0] == 'Tobu - Hope [NCS Release].mp3' &&
    names[1] == 'Tobu - Infectious [NCS Release].mp3' &&
    names[2] == 'Different Heaven & EH!DE - My Heart [NCS Release].mp3') {
        console.log("Songs loaded in correctly!");
    }
    else
        console.log("Warning: songs not loaded in correctly");
    
    songs = fs.getSongs();

    testSongName = 'Alan Walker - Fade.mp3';
    testSongPath = path.join(fs.getSourceFolder(), 'user/songs/Alan Walker - Fade.mp3');
    fs.appendSong(testSongName, testSongPath);
    fs.removeSong(testSongName);
    
    console.log('Songs match after remove and append: ' + (JSON.stringify(songs) == JSON.stringify(fs.getSongs())));

}

function testWriteSong() {

}

function testAll() {

    fs.setStoragePath('user_1/data');
    let folderPath = 'user_1/songs';
    testSettings();
    //testSongs(folderPath);

    fs.setStoragePath('user_2/data');
    folderPath = 'user_2/songs';
    testSettings();
    //testSongs(folderPath);

    fs.setStoragePath('user_3/data');
    folderPath = 'user_3/songs';
    testSettings();
    //testSongs(folderPath);

    //reset testing environment



}


module.exports = {
    testAll
}