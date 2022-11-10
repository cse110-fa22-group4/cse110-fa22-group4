const path = require('path');
const fs = require('../preload/fsAPICalls');

function testSettings() {
    settings = fs.getSettings();

    fs.writeToSetting('testingStatus', 'inProgress')

    console.log('Settings contents: ' + JSON.stringify(fs.getSettings()));
    fs.deleteSetting('testingStatus');

    console.log('Settings match after add and delete: ' + (JSON.stringify(settings) == JSON.stringify(fs.getSettings())));
    
    fs.writeSettings((fs.getSettings()));

    console.log('Settings match after rewrite: ' + (JSON.stringify(settings) == JSON.stringify(fs.getSettings())));
}

function testSongs() {

    let songs = fs.getSongs();

    const songPaths = fs.recursiveSearchAtPath(path.join(fs.getSourceFolder(), 'user/songs'));
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

function testAll() {
    fs.setStoragePath('user_1/data');
    
    // read songs from songs folder and write their paths to songs.json.
    // Check if song names are as expected
    testSongs();

    // tests reading, writing, and deleting in settings
    testSettings();
}


module.exports = {
    testAll
}