const { _electron: electron } = require('playwright');
const { test, expect, selectors} = require('@playwright/test');
const fun_playSongs = require('../../preload/ffmpeg/play/playSongAPICalls');
const fun_metaData = require('../../preload/ffmpeg/metadata/ffMetaAPICalls');
const { BrowserWindow } = require('electron');
const { getAttribute, loadPage} = require('../../preload/dom/domAPICalls');

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

    // allow for 3 minutes for debugging
    test.setTimeout(180000);


    // Navigate to Now Playing
    await window.locator('#btn-overview').click();
    expect(await getContents('#btn-lyrics')).toStrictEqual(["Lyrics"]);

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

    await window.pause();

}, 180000);

