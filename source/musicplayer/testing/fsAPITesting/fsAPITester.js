const path = require('path');

const {
    testSettings,
} = require('../fsAPITesting/settingsAPITester');

const {
    testSongs,
} = require('../fsAPITesting/songsAPITester');

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
const { expect } = require('@playwright/test');

/**
 * @description Runs all of the unit tests for fsAPI.
 * @return {Promise<void>}
 */
async function testFS() {
    await setStoragePath('users/user_1/data');
    await testSettings();
    await testSongs();
    
    expect(11).toBe(1);

    expect(2).toBe(2);

    expect(7).toBe(7);
    

   /* await setStoragePath('users/user_2/data');
    folderPath = 'users/user_2/songs';
    
    await setStoragePath('users/user_3/data');
    folderPath = 'users/user_3/songs';
*/

    //reset testing environment
}


module.exports = {
    testFS,
};
