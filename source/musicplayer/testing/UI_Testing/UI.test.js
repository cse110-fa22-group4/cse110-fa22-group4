const { _electron: electron } = require('playwright');
const { test, expect, selectors} = require('@playwright/test');
const fun_playSongs = require('../../preload/ffmpeg/play/playSongAPICalls');
const fun_metaData = require('../../preload/ffmpeg/metadata/ffMetaAPICalls');

let electronApp;
let window;

/**
 * Setting before every tests
 */
test.beforeEach(async () => {
    const electronApp = await electron.launch({args: ['main/main.js']});
    const appPath = await electronApp.evaluate(async ({app}) => {
        return app.getAppPath();
    });
    console.log(appPath);

    window = await electronApp.firstWindow();
    console.log(await window.title());

    // Show the console in electron in the current console
    // await window.on('console', console.log);
});

