const fs = require('fs');
const {ipcRenderer} = require('electron');
const path = require('path');

let storagePath = '';

/**
 * @description MUST BE CALLED ON STARTUP. Sets the path to userData, which can
 * only be done from main.js.
 * @return {void}
 */
async function fsInit() {
    storagePath = await ipcRenderer.invoke('getUserData');
    storagePath = path.join(storagePath, 'MixMatch');
    await makeDirIfNotExists(storagePath);
    /**
     * Bro this function can't call any APIs since it is used before the
     * initialization of the APIs, so we don't get any custom debug log
     * functions.
     * @todo try to find a workaround and uncomment the following line of code.
     */
    // genAPI.debugLog("UserData Storage Path: " + storagePath, this);
    console.log('UserData Storage Path: ' + storagePath);
}

/**
 *
 * @param {string} newStoragePath
 */
async function setStoragePath(newStoragePath) {
    const localPath = getSourceFolder();
    storagePath = path.join(localPath, newStoragePath);
    await makeDirIfNotExists(storagePath);
    console.log('UserData Storage Path: ' + storagePath);
}

/**
 *
 * @return {string}
 */
async function getSourceFolder() {
    return __dirname + '/../..';
}

/**
 * @name devClear
 * @description Deletes every file. Useful for development and unit tests.
 *              Can only be called from whitelisted callers.
 * @memberOf fsAPI
 * @param {object} caller A reference to the caller. This function can only be
 *                      called from whitelisted callers.
 * @return {void}
 */
async function devClear(caller) {
    const settingPath = path.join(storagePath, 'settings.json');
    const songsPath = path.join(storagePath, 'songs.json');
    const statsPath = path.join(storagePath, 'stats.json');
    const playlistPath = path.join(storagePath, 'playlists');

    if (fs.existsSync(settingPath)) {
        fs.rmSync(settingPath);
    }
    if (fs.existsSync(songsPath)) {
        fs.rmSync(songsPath);
    }
    if (fs.existsSync(statsPath)) {
        fs.rmSync(statsPath);
    }
    if (fs.existsSync(playlistPath)) {
        fs.rmdirSync(playlistPath, {recursive: true});
    }
}

/* File Structure in userData
.../MixMatch
    |-- playlists
    |   |-- myPlaylist.mmp
    |-- lyrics
    |   |-- myLyrics.(?)
    |-- settings.json
    |-- songs.json
    |-- stats.json
 */

/**
 * @name makeDirIfExists
 * @description Checks if a folder, and if not creates it.
 * @memberOf fsAPI
 * @param {string} folder The folder to be checked for.
 */
async function makeDirIfNotExists(folder) {
    await fs.opendir(folder, async (err, dir) => {
        if (err) {
            await fs.mkdir(folder, {recursive: false}, () => {
                // Any callback that needs to happen on first folder create
                // can happen here.
            });
        }
    });
}

/**
 * @name getSRCString
 * @description Gets a string that, when passed into the src of a HTML Audio
 * element will play the sound.
 * @memberOf fsAPI
 * @param {string} path The path to an audio file on the computer
 * @return {string} A HTML Audio compatible src string.
 * @todo May not work on all (or any) OS! May need to give filesystem access!
 */
async function getSRCString(path) {
    return 'file:///' + path;
}

// To future people trying to make recursiveSearchAtPath async: don't. seriously. it isn't worth the headache.

/**
 * @name recursiveSearchAtPath
 * @description Recursively searches every subdirectory at a given directory
 * to return every song.
 * @memberOf fsAPI
 * @param {string} searchPath The pat at which to recursively search
 * @return {string[]}  An array of every song path that exists recursively
 * within the directory.
 *
 */
function recursiveSearchAtPath(searchPath) {
    // try and catch to take care of illegal folders/files
    try {
        const ret = [];
        const dirs = fs.readdirSync(
            searchPath,
            {withFileTypes: true},
        ).filter((d) => d.isDirectory()).map((d) => d.name);

        dirs.forEach((dir) => {
            const dirPath = path.join(searchPath, dir);
            if (fs.existsSync(dirPath)) {
                const paths = recursiveSearchAtPath(dirPath);
                paths.forEach((p) => ret.push(p));
            }
        });

        const files = fs.readdirSync(
            searchPath,
            {withFileTypes: true},
        ).filter((d) =>
            d.isFile()).filter((d) =>
            d.name.split('.').pop() === 'mp3').map((d) => d.name);
        files.forEach((f) => ret.push(path.join(searchPath, f)));

        return ret;
    } catch (e) {
        console.log(e);
        return [];
    }
}

module.exports = {
    storagePath,
    makeDirIfNotExists,
    getSRCString,
    fsInit,
    devClear,
    recursiveSearchAtPath,
    setStoragePath,
    getSourceFolder,
};
