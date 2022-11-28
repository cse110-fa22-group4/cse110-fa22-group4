// fsAPI.test.js
const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')
const functions_playlist = require('../../preload/fs/playlists/playlistAPICalls');
const {fsInit, getStoragePath, setStoragePath, makeDirIfNotExists} = require("../../preload/fs/fsAPICalls");
const path = require("path");
const fs = require("fs");
const {removePlaylist, writePlaylist} = require("../../preload/fs/playlists/playlistAPICalls");
const fsPromises = fs.promises;

let electronApp;

/**
 * Set up the initial stage for the test
 */
test.beforeAll(async () => {
    //electronApp = electron.launch({ args:['../main/main.js'] });

    const testPath = '../source/musicplayer';
    // Read an empty file without any playlist in it.
    await setStoragePath(testPath);

    // Empty the all the files in testing playlist
    const playlistPath = path.join(await getStoragePath(), 'playlists');
    for (const file of await fsPromises.readdir(playlistPath)) {
        const path_songs = path.join(playlistPath, file);
        console.log('songs:', path_songs);
        await fsPromises.unlink(path_songs);
    }
});

/**
 * Check functionality of getAllPlaylists();
 * check the empty playlist in the file
 */
test('Check functionality of getAllPlaylists()', async ()=>{
    // get test the initial stage of getAllPlaylists()
    const str_playlist = JSON.stringify(await functions_playlist.getAllPlaylists());
    // Should be returning an empty object(map)
    expect(str_playlist).toBe('[]');
});

// /**
//  * Check getAllPlaylists() after getting a non-existing playlist
//  */
// test('Check getAllPlaylists() after adding a playlist', async () => {
//     // Getting a non-existing playlist
//     await functions_playlist.getPlaylist('Adding Playlist');
//     const str_playlist = JSON.stringify(await functions_playlist.getAllPlaylists());
//     // expect(str_playlist).toBe('[\"Added Playlist\"]');
//     //expect(str_playlist).toBe('[]');
// });


/**
 * Test after removing a playlist
 */
test('Checking removePlaylist() after removing a playlist', async () => {
    await removePlaylist('Adding Playlist');
    const str_playlist = JSON.stringify(await functions_playlist.getAllPlaylists());
    expect(str_playlist).toBe('[]');
});

// /**
//  * Test functions together
//  */
// test.describe('Checking writePlaylist and removing playlist', () => {
//     test('write a playlist', async () => {
//         await writePlaylist('Testing', )
//     });
// });

/**
 * Close the app after the all the tests ends
 */
test.afterAll(async () =>{
    //electronApp.close();
    // Empty the all the files in testing playlist
    const playlistPath = path.join(await getStoragePath(), 'playlists');
    for (const file of await fsPromises.readdir(playlistPath)) {
        const path_songs = path.join(playlistPath, file);
        console.log('songs:', path_songs);
        await fsPromises.unlink(path_songs);
    }
});


