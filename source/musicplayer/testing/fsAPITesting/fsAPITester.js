const path = require('path');

const {
    testSettings,
} = require('../fsAPITesting/settingsAPITester');


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
    getSettings,
    writeSettings,
} = require('../../preload/fs/settings/settingsAPICalls');

const {
    getSongs,
    writeSongs,
} = require('../../preload/fs/songs/songsAPICalls');


const { expect } = require('@playwright/test');

/**
 * 
 */
 async function reset() {
    await reset_user1();
    await reset_user2();
    await reset_user3();
 }

/**
 * 
 */
async function reset_user1() {

    await setStoragePath('users/user_reset/user_1/data');
    let settings = await getSettings();
    let songs = await getSongs();
    await setStoragePath('users/user_1/data');
    await writeSongs(songs);
    await writeSettings(settings);

}

/**
 * 
 */
 async function reset_user2() {

    await setStoragePath('users/user_reset/user_2/data');
    let settings = await getSettings();
    let songs = await getSongs();
    await setStoragePath('users/user_2/data');
    await writeSongs(songs);
    await writeSettings(settings);

}

/**
 * 
 */
 async function reset_user3() {

    await setStoragePath('users/user_reset/user_3/data');
    let settings = await getSettings();
    let songs = await getSongs();
    await setStoragePath('users/user_3/data');
    await writeSongs(songs);
    await writeSettings(settings);

}


module.exports = {
    reset_user1,
    reset_user2,
    reset_user3,
    reset,
};
