const path = require('path');
const fs = require('../preload/fsAPICalls');

function testgetSettings() {
    console.log('Settings file: ' + fs.getSettings());
}

function testWriteSongs() {
    let songPaths = fs.recursiveSearchAtPath(path.join(fs.getSourceFolder(), 'user/songs'));
    fs.writeSongs(songPaths);
}

function testgetSongs() {
    console.log('Songs:' + fs.getSongs());
}

function testAll() {
    fs.setStoragePath('user/data');
    

    testWriteSongs();
    testgetSongs();

    testgetSettings();
}


module.exports = {
    testAll
}