const { _electron: electron } = require('playwright');
const { test, expect, selectors} = require('@playwright/test');
const fun_playSongs = require('../../preload/ffmpeg/play/playSongAPICalls');
const fun_metaData = require('../../preload/ffmpeg/metadata/ffMetaAPICalls');
const { BrowserWindow } = require('electron');
const { getAttribute, loadPage} = require('../../preload/dom/domAPICalls');
const { setStoragePath } = require('../../preload/fs/fsAPICalls');
const { removePlaylist } = require('../../preload/fs/playlists/playlistAPICalls');

let electronApp;
let window;

/**
 * @description Grabs the contents of a locator query
 * @param {string} query Search Query
 * @returns Contents of the found html element
 */
async function getContents(query) {
    let loc = await window.locator(query); 
    return await loc.allTextContents();
}

/**
 * @description Waits for a period of time
 * @param {int} time amount of milliseconds to wait
 * @returns {Promise<void>}
 */
async function sleep(time=500) {
    return new Promise(resolve => setTimeout(resolve, time));
}

/**
 * Test Playback features
 */
test('Check Playback Functions', async () => {
    const electronApp = await electron.launch({args: ['main/main.js']});
    const appPath = await electronApp.evaluate(async ({app}) => {
        return app.getAppPath();
    });
    window = await electronApp.firstWindow();
    test.setTimeout(120000);

    await window.pause();

    // reset environment
    await removePlaylist('some-playlist-name');
    await removePlaylist('another-playlist-name');
    await removePlaylist('bad-playlist');

    // Navigate to Library
    await window.locator('#btn-library').click();
    await sleep();

    // Navigate to Playlists
    await window.locator('#btn-playlists').click();
    await sleep();

    // Navigate to Home
    await window.locator('#btn-home').click();
    await sleep();
    

    // Navigate to Settings
    await window.locator('#btn-settings').click();
    await sleep();
    
    // Close Settings
    await window.locator('#btn-settings').click();
    await sleep();

    // Navigate to Library
    await window.locator('#btn-library').click();
    await sleep();

    // lower volume to 50%
    await window.locator('#audio-fader').click();
    await sleep();

    // add third song in library to queue
    await window.locator('#library-container :text("+")').nth(2).click();
    await sleep();

    // add first song in library to queue
    await window.locator('#library-container :text("+")').nth(0).click();
    await sleep();

    // add second song in library to queue
    await window.locator('#library-container :text("+")').nth(1).click();
    await sleep();

    // click shuffle twice
    await window.locator('#shuffle-btn').click();
    await sleep();
    await window.locator('#shuffle-btn').click();
    await sleep();

    //open queue
    await window.locator('#playlists-bottom-btn').click();
    await sleep();

    // Click play
    await window.locator('#play-btn').click();
    await sleep(5000);


    // Click next track
    await window.locator('#next-btn').click();
    await sleep(2000);
    
    // Click prev track
    await window.locator('#prev-btn').click();
    await sleep(2000);

    // Delete second track in queue
    await window.locator('.btn-queue-track-delete').nth(1).click();
    await sleep();

    // Click next track
    await window.locator('#next-btn').click();
    await sleep(1000);
    
    // add first song in library to queue
    await window.locator('#library-container :text("+")').nth(0).click();
    await sleep(1000);

    // clear queue
    await window.locator('#btn-queue-clear').click();
    await sleep();

    // select all songs to be added to queue
    await window.locator('.gridjs-checkbox').nth(0).click();
    await window.locator('.gridjs-checkbox').nth(1).click();
    await window.locator('.gridjs-checkbox').nth(2).click();
    await sleep();

    // add all selected items to queue
    await window.locator('#btn-addQueue').click();
    await sleep();

    //open playlist popup
    await window.locator('#btn-playlist').click();
    await sleep();

    // type in textbox
    await window.locator('#input-playlist-create').type("some-playlist-name");
    await sleep();
    
    // create playlist
    await window.locator('#btn-playlist-create').click();
    await sleep();

    // select all songs to be added to playlist
    await window.locator('.gridjs-checkbox').nth(0).click();
    await window.locator('.gridjs-checkbox').nth(1).click();
    await window.locator('.gridjs-checkbox').nth(2).click();
    await sleep();

    // Add selected items to playlist
    await window.locator('#btn-playlist-add').click();
    await sleep();

    // Go to Playlist page
    await window.locator('#btn-playlists').click();
    await sleep();


    // click on playlist
    await window.locator('.library-card-info :text("some-playlist-name")').click();
    await sleep();


    // play from playlist
    await window.locator('#btn-playlist-playAll').click();
    await sleep();

    // Click play
    await window.locator('#play-btn').click();
    await sleep(2000);
    
    // create more playlists
    await window.locator('#input-playlist-create').type("another-playlist-name");
    await sleep();
    await window.locator('#btn-playlist-create').click();
    await sleep();


    // Add songs to playlist
    await window.locator('.gridjs-checkbox').nth(0).click();
    await sleep();
    await window.locator('#btn-playlist-add').click();
    await sleep();

    await window.locator('.gridjs-checkbox').nth(1).click();
    await sleep();
    await window.locator('#btn-playlist-add').click();
    await sleep();

    await window.locator('.gridjs-checkbox').nth(2).click();
    await sleep();
    await window.locator('#btn-playlist-add').click();
    await sleep();

    // create another playlist
    await window.locator('#input-playlist-create').type("bad-playlist");
    await sleep();
    await window.locator('#btn-playlist-create').click();
    await sleep();

    // delete it
    await window.locator('#btn-playlist-delete').click();
    await sleep();

    //open queue
    await window.locator('#playlists-bottom-btn').click();
    await sleep();
    
    // Go to Playlist page
    await window.locator('#btn-playlists').click();
    await sleep();

    // click on playlist
    await window.locator('.library-card-info :text("another-playlist-name")').click();
    await sleep();
    
    // click shuffle button
    await window.locator('#shuffle-btn').click();
    await sleep();

    // click playlist play
    await window.locator('#btn-playlist-playAll').click();
    await sleep();

    // Click play
    await window.locator('#play-btn').click();
    await sleep(5000);

    // Click next track 3 times
    await window.locator('#next-btn').click();
    await sleep(2000);
    await window.locator('#next-btn').click();
    await sleep(2000);
    await window.locator('#next-btn').click();
    await sleep(2000);

    // click prev button 2 times
    await window.locator('#prev-btn').click();
    await sleep(2000);
    await window.locator('#prev-btn').click();
    await sleep(2000);

    // turn off shuffle
    await window.locator('#shuffle-btn').click();
    await sleep();

    // click loop button
    await window.locator('#loop-btn').click();
    await sleep();

    // click playlist play
    await window.locator('#btn-playlist-playAll').click();
    await sleep();

    // Click play
    await window.locator('#play-btn').click();
    await sleep(3000);

    // Click next track twice
    await window.locator('#next-btn').click();
    await sleep(3000);
    await window.locator('#next-btn').click();
    await sleep(3000);

    // clear queue
    await window.locator('#btn-queue-clear').click();
    await sleep(2000);

    await window.pause();

   await electronApp.close();

});
