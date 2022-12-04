const { _electron: electron } = require('playwright');
const { test, expect, selectors} = require('@playwright/test');
const fun_playSongs = require('../../preload/ffmpeg/play/playSongAPICalls');
const fun_metaData = require('../../preload/ffmpeg/metadata/ffMetaAPICalls');
const { BrowserWindow } = require('electron');
const { getAttribute, loadPage} = require('../../preload/dom/domAPICalls');
const { setStoragePath } = require('../../preload/fs/fsAPICalls');

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
 * 
 */
test('Start', async () => {
    const electronApp = await electron.launch({args: ['main/main.js']});
    const appPath = await electronApp.evaluate(async ({app}) => {
        return app.getAppPath();
    });
    //console.log(appPath);
    window = await electronApp.firstWindow();
    //console.log(await window.title());

    // Show the console in electron in the current console
    //await window.on('console', console.log);
    //console.log(window);
    //await window.pause();

    //await window.click('settings');
    //console.log(await window.locator('text=Library'));
    //await window.locator('#sidebar :text("Library")').click();
    //await window.click('sidebar-btn-container-library');

    //await window.pause();

    //await window.locator('text=Library').first().click();
    //await window.locator('button:text("Library")').click();

    //await window.locator('#btn-playlists').click(); //works

    //await window.pause();

    //await window.locator('#btn-home').click(); //works
    
    
    
    
    

    //await window.locator('#btn-settings').click(); //works

    //await window.pause();
    
    
    /*await window.click('btn-settings');
    
    await window.locator('text=Library').click();

    await window.click('sidebar-btn-container-library');

    await window.locator(':has-text("Playlists")').click();*/

    

    await electronApp.close()
});

/**
 * 
 */
test('Check Page Navigation', async () => {
    const electronApp = await electron.launch({args: ['main/main.js']});
    const appPath = await electronApp.evaluate(async ({app}) => {
        return app.getAppPath();
    });
    window = await electronApp.firstWindow();

    // allow for 5 minutes for debugging
    test.setTimeout(300000);

    // Navigate to Library
    await window.locator('#btn-library').click();
    expect(await getContents('#header-title')).toStrictEqual(
        ["Library"]);
    //console.log(await library.allInnerTexts());

    // Navigate to Playlists
    await window.locator('#btn-playlists').click();
    expect(await getContents('#header-title')).toStrictEqual(
        ["Playlists"]);

    // Navigate to Home
    await window.locator('#btn-home').click();
    expect(await getContents('#header-title')).toStrictEqual(
        ["Home"]);

    // Navigate to Settings
    await window.locator('#btn-settings').click();
    expect(await window.locator('#top-container-extended').getAttribute('style')).toStrictEqual("visibility: visible;");

    // Close Settings
    await window.locator('#btn-settings').click();

    // Navigate to Library
    await window.locator('#btn-library').click();

    // lower volume to 50%
    await window.locator('#audio-fader').click();

    await window.pause();

    // add third song in library to queue
    await window.locator('#library-container :text("+")').nth(2).click();

    // add first song in library to queue
    await window.locator('#library-container :text("+")').nth(0).click();

    // add second song in library to queue
    await window.locator('#library-container :text("+")').nth(1).click();

    // click shuffle (for some reason needs to be clicked twice)
    await window.locator('#shuffle-btn').click();
    await window.locator('#shuffle-btn').click();

    //open queue
    await window.locator('#playlists-bottom-btn').click();

    // Click play
    await window.locator('#play-btn').click();


    // Click next track
    await window.locator('#next-btn').click();
    
    // Click prev track
    await window.locator('#prev-btn').click();

    // Delete second track in queue
    await window.locator('.btn-queue-track-delete').nth(1).click();

    // Click next track
    await window.locator('#next-btn').click();

    // Click loop (causes problems rn)
    //await window.locator('#loop-btn').click();
    
    // add first song in library to queue
    await window.locator('#library-container :text("+")').nth(0).click();

    // clear queue
    await window.locator('#btn-queue-clear').click();

    // select all songs to be added to queue
    await window.locator('.gridjs-checkbox').nth(0).click();
    await window.locator('.gridjs-checkbox').nth(1).click();
    await window.locator('.gridjs-checkbox').nth(2).click();

    // add all selected items to queue
    await window.locator('#btn-addQueue').click();

    await window.pause();

    //open playlist popup
    await window.locator('#btn-playlist').click();

    // type in textbox
    await window.locator('#input-playlist-create').type("some-playlist-name");
    
    // create playlist
    await window.locator('#btn-playlist-create').click();

    // select all songs to be added to playlist
    await window.locator('.gridjs-checkbox').nth(0).click();
    await window.locator('.gridjs-checkbox').nth(1).click();
    await window.locator('.gridjs-checkbox').nth(2).click();

    // Add selected items to playlist
    await window.locator('#btn-playlist-add').click();

    // Go to Playlist page
    await window.locator('#btn-playlists').click();

    await window.pause();

    // click on playlist
    //await window.locator('.library-card-artwork').nth(0).click();

    await window.pause();

    //await window.locator('#btn-playlist-playAll').click();
    

    // '#button-queue-clear'
    // '.gridjs-checkbox'
    // '#btn-addQueue'
    // '#btn-playlist'

    await window.pause();

   //await window.pause();
   await electronApp.close();

});


/*
Next Steps:

<---Test Full Workflow--->
- Reset user environment
- go through all pages
- then go to settings
- add a watch folder
- rescan watch folder
- wait a little bit
- set the color for the app
- close settings
- double check that we are still on the same page
- go to library
- check that the songs are there
- make sure the songs play
- go to playlists
- make a new playlist
- search for songs
- add songs to playlist
- search for the playlist?
- play from the playlist
- stop playing
- close the app
- open the app
- make sure the playlist still exists and the right color settings are being used
- delete the playlist
- make sure all songs can be played?
- finish??
*/

