const path = require('path');
const {
    getStoragePath,
    makeDirIfNotExists,
    getSRCString,
    fsInit,
    devClear,
    recursiveSearchAtPath,
    setStoragePath,
    getSourceFolder,
} = require('../../preload/fs/fsAPICalls');

const {
    ffmpegRead,
} = require('../../preload/ffmpeg/metadata/ffMetaAPICalls');

const {
    getSongs,
    writeSongs,
    appendSong,
    appendSongs,
    removeSong,
    cullShortAudio,
} = require('../../preload/fs/songs/songsAPICalls');

/**
 * @description Tests the songs API.
 * 
 */
 async function testSongs() {
    
    //await testWriteSongs(getSongs());
    
    await testGetSong();

    //await testAppendSong();

}

/**
 * 
 */
async function testGetSong() {
    let songs = await getSongs();
    //console.log('settings file: ' + JSON.stringify(songs));
}

/**
 * 
 */
async function testAppendSong() {
    let info = Object;
    info.title = "Hope";
    info.artist = "Tobu";
    let song = Object;
    song["/Users/jeremylei/untitled folder/cse110-fa22-group4/source/user_1/songs/Tobu/Tobu - Hope [NCS Release].mp3"] = info;
    console.log(song);
    appendSong(song);
}

/**
 * 
 */
async function testDeleteSong() {
    
}

/**
 * 
 * @param {*} songs 
 */
async function testWriteSongs(songs) {
    
}

module.exports = {
    testSongs,
};