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
    getSongs,
    writeSongs,
    appendSong,
    appendSongs,
    removeSong,
    cullShortAudio,
} = require('../../preload/fs/songs/songsAPICalls');

/**
 * @description Tests the songs API.
 * @param {object[]} songFolderPaths An array of string paths to the 'watch' folders containing songs
 */
 async function testSongs(songFolderPaths) {
    /*
     * song folder path setup
     * Takes an array of paths to simulate the 'watch folders'
     */

    let songPaths = []

    for (let songFolderPath in songFolderPaths) {
        const localPath = await getSourceFolder();
        let paths = await recursiveSearchAtPath(path.join(localPath, songFolderPaths[songFolderPath]));
        for(let p in paths) {
            songPaths.push(paths[p]);
        }
    }
    
    //await testGetSong();

}

/**
 * 
 */
async function testGetSong() {
}

/**
 * 
 */
async function testAppendSong() {
    
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