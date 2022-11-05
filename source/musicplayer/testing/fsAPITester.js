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
    let songPaths = fs.recursiveSearchAtPath(path.join(fs.getSourceFolder(), 'user/songs'));
    fs.writeSongs(songPaths);
    songs = fs.getSongs();
    //console.log('Songs:' + songs);
    let songList = [];
    for (song in songs) {
        // prints the file names w/ directories
        songList[song] = (songs[song].split('\\').pop().split('/').pop());
    }
    if(songList[0] == 'Tobu - Hope [NCS Release].mp3' &&
    songList[1] == 'Tobu - Infectious [NCS Release].mp3' &&
    songList[2] == 'Different Heaven & EH!DE - My Heart [NCS Release].mp3') {
        console.log("Songs loaded in correctly!");
    }
    else
        console.log("Warning: songs not loaded in correctly")
    
    //fs.removeSong('Different Heaven & EH!DE - My Heart [NCS Release].mp3');

}

function testAll() {
    fs.setStoragePath('user/data');
    
    // read songs from songs folder and write their paths to songs.json.
    // Check if song names are as expected
    testSongs();

    // tests reading, writing, and deleting in settings
    testSettings();
}


module.exports = {
    testAll
}