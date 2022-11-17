const path = require('path');
const {
    testSettings,
} = require('../testing/settingsAPITester');

const {
    testSongs,
} = require('../testing/songsAPITester');

const {
    getStoragePath,
    makeDirIfNotExists,
    getSRCString,
    fsInit,
    devClear,
    recursiveSearchAtPath,
    setStoragePath,
    getSourceFolder,
} = require('../preload/fs/fsAPICalls');

/**
 * @description Runs all of the unit tests for APIs.
 * @return {Promise<void>}
 */
async function testAll() {
    await setStoragePath('users/user_1/data');
    let folderPath = [];
    folderPath.push('users/user_1/songs');
    await testSettings();
    await testSongs(folderPath);

   /* await setStoragePath('users/user_2/data');
    folderPath = 'users/user_2/songs';
    
    await setStoragePath('users/user_3/data');
    folderPath = 'users/user_3/songs';
*/

    //reset testing environment
}


module.exports = {
    testAll,
};
