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
    writeToSetting,
} = require('../../preload/fs/settings/settingsAPICalls');

const {
    getSongs,
    writeSongs,
} = require('../../preload/fs/songs/songsAPICalls');

const { 
    getStats,
    writeStats,
} = require('../../preload/fs/stats/statsAPICalls');


const { expect } = require('@playwright/test');

/**
 * 
 */
 async function reset_all() {
    await reset_user1();
    await reset_user2();
    await reset_user_blank();
 }

/**
 * 
 */
async function reset_user1() {

    await setStoragePath('users/user_reset/user_1/data');
    let settings = await getSettings();
    let songs = await getSongs();
    let stats = await getStats();
    await setStoragePath('users/user_1/data');
    await writeSongs(songs);
    await writeSettings(settings);
    await writeStats(stats);

}

/**
 * 
 */
 async function reset_user2() {

    await setStoragePath('users/user_reset/user_2/data');
    let settings = await getSettings();
    let songs = await getSongs();
    let stats = await getStats();
    await setStoragePath('users/user_2/data');
    await writeSongs(songs);
    await writeSettings(settings);
    await writeStats(stats);

}

/**
 * 
 */
 async function reset_user_blank() {

    await setStoragePath('users/user_blank/data');
    await devClear()

}

/**
 * 
 */
 async function reset_stats() {

    await setStoragePath('users/user_reset/user_1/data');
    let stats = await getStats();
    await setStoragePath('users/user_1/data');
    await writeStats(stats);

    await setStoragePath('users/user_reset/user_2/data');
    stats = await getStats();
    await setStoragePath('users/user_2/data');
    await writeStats(stats);

}

/**
 * 
 */
 async function reset_songs() {

    await setStoragePath('users/user_reset/user_1/data');
    let songs = await getSongs();
    await setStoragePath('users/user_1/data');
    await writeSongs(songs);

    await setStoragePath('users/user_reset/user_2/data');
    songs = await getSongs();
    await setStoragePath('users/user_2/data');
    await writeSongs(songs);

}

/**
 * 
 */
 async function reset_settings() {

    await setStoragePath('users/user_reset/user_1/data');
    let settings = await getSettings();
    await setStoragePath('users/user_1/data');
    await writeSettings(settings);

    await setStoragePath('users/user_reset/user_2/data');
    settings = await getSettings();
    await setStoragePath('users/user_2/data');
    await writeSettings(settings);

}


module.exports = {
    reset_user1,
    reset_user2,
    reset_user_blank,
    reset_all,
    reset_settings,
    reset_songs,
    reset_stats,
};
