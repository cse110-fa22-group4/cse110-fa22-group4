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
 * @description Runs all of the unit tests for fsAPI.
 * @return {Promise<void>}
 */
async function testFS() {
    await setStoragePath('users/user_1/data');
    await testSettings();
    
    expect(11).toBe(1);

    expect(2).toBe(2);

    expect(7).toBe(7);
    

   /* await setStoragePath('users/user_2/data');
    folderPath = 'users/user_2/songs';
    
    await setStoragePath('users/user_3/data');
    folderPath = 'users/user_3/songs';
*/
}

/**
 * 
 */
 async function reset() {
    reset_user1();
    reset_user2();
    reset_user3();
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
    testFS,
    reset_user1,
    reset_user2,
    reset_user3,
    reset,
};
