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
    if (!fs.existsSync(storagePath)) {
        console.log(storagePath);
        fs.mkdirSync(storagePath);
    }
    /**
     * Bro this function can't call any APIs since it is used before the
     * initialization of the APIs, so we don't get any custom debug log
     * functions.
     * @todo try to find a workaround and uncomment the following line of code.
     */
    // genAPI.debugLog("UserData Storage Path: " + storagePath, this);
    console.log('UserData Storage Path: ' + storagePath);
}

function setStoragePath(newStoragePath) {
    localpath = getSourceFolder();
    storagePath = path.join(localpath, newStoragePath);
    if (!fs.existsSync(storagePath)) {
        console.log(storagePath);
        fs.mkdirSync(storagePath);
    }
    console.log('UserData Storage Path: ' + storagePath);
}

function getSourceFolder() {
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
function devClear(caller) {
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
 * @name getSettings
 * @description Gets the full settings as an object in JSON format.
 * @memberOf fsAPI
 * @return {object} A JSON formatted object of all the current settings
 */
function getSettings() {
    const settingsPath = path.join(storagePath, 'settings.json');
    if (!fs.existsSync(settingsPath)) {
        fs.closeSync(fs.openSync(settingsPath, 'w'));
        fs.writeFileSync(settingsPath, '{ }');
    }
    return JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
}

/**
 * @name getSetting
 * @memberOf fsAPI
 * @description Gets a setting if it exists, and returns undefined otherwise.
 * @param {string} setting
 * @return {object | undefined} The setting if it exists, else undefined.
 */
function getSetting(setting) {
    const settings = getSettings();
    if (setting in settings) {
        return JSON.parse(settings[setting]);
    }
    return undefined;
}

/**
 * @name writeSettings
 * @description Rewrites the entire settings file using the given JSON.
 * This rewrites the entire settings, if you want to only write one setting
 * use writeToSetting()!
 * @memberOf fsAPI
 * @param {object} settings The new settings to set, in JSON format.
 * @return {void}
 */
function writeSettings(settings) {
    const settingsPath = path.join(storagePath, 'settings.json');
    if (!fs.existsSync(settingsPath)) {
        fs.closeSync(fs.openSync(settingsPath, 'w'));
    }
    fs.writeFileSync(settingsPath, JSON.stringify(settings));
}

/**
 * @name writeToSetting
 * @description Writes a single setting to the settings.
 * @memberOf fsAPI
 * @param {string} setting The name of the setting to write to.
 * @param {object} val The value to set the setting to.
 * @return {void}
 */
function writeToSetting(setting, val) {
    const settings = getSettings();
    settings[setting] = JSON.stringify(val);
    writeSettings(settings);
}

/**
 * @name deleteSetting
 * @description Removes a setting from the settings file entirely.
 * @memberOf fsAPI
 * @param {string} setting The name of the setting to remove from the settings
 * file.
 * @return {void}
 */
function deleteSetting(setting) {
    const settings = getSettings();
    delete settings[setting];
    writeSettings(settings);
}

/**
 * @name getSongs
 * @description Gets the JSON formatted object that contains all songs and
 *                  their paths.
 * @memberOf fsAPI
 * @return {object} A JSON formatted object containing all songs.
 */
function getSongs() {
    const songPath = path.join(storagePath, 'songs.json');
    if (!fs.existsSync(songPath)) {
        fs.closeSync(fs.openSync(songPath, 'w'));
        fs.writeFileSync(songPath, '{ }');
    }
    const res = fs.readFileSync(songPath, 'utf8');

    return JSON.parse(res);
}

/**
 * @name writeSongs
 * @description Rewrites the songs.json file with new content. If you want to
 *              modify a single song, use writeSongs() or readSongs()!
 * @memberOf fsAPI
 * @param {object} songs The JSON formatted object to write to songs.json
 * @return {void}
 */
function writeSongs(songs) {
    const songPath = path.join(storagePath, 'songs.json');
    if (!fs.existsSync(songPath)) {
        fs.closeSync(fs.openSync(songPath, 'w'));
    }
    fs.writeFileSync(songPath, JSON.stringify(songs));
}

/**
 * @name appendSong
 * @description Adds a new song to the songs.json file.
 * @memberOf fsAPI
 * @param {object} newSong The path of the new song file as a key, and
 *                          metadata as a value.
 * @return {void}
 */
function appendSong(newSong) {
    const songs = getSongs();
    songs.push(newSong);
    writeSongs(songs);
}

/**
 * @name appendSongs
 * @description Appends multiple songs to the songs.json file.
 * @param {object[]} newSongs An array of new songs to be appended.
 * @return {void}
 */
function appendSongs(newSongs) {
    const songs = getSongs();
    for (const song in newSongs) {
        if (!song) continue;
        songs[song] = newSongs[song];
    }
    writeSongs(songs);
}

/**
 * @name removeSong
 * @description Removes a song from the songs.json folder
 * @memberOf fsAPI
 * @param {string} oldSong The name of the old song.
 * @return {void}
 */
function removeSong(oldSong) {
    const songs = getSongs();
    delete songs[oldSong];
    writeSongs(songs);
}

/**
 * @name getStats
 * @description Gets the stats as a JSON formatted object.
 * @memberOf fsAPI
 * @return {object} A JSON formatted object representing the stats.
 */
function getStats() {
    const statsPath = path.join(storagePath, 'stats.json');
    if (!fs.existsSync(statsPath)) {
        fs.closeSync(fs.openSync(statsPath, 'w'));
        fs.writeFileSync(statsPath, '{ }');
    }
    return JSON.parse(fs.readFileSync(statsPath, 'utf8'));
}

/**
 * @name writeStats
 * @description Rewrites the stats file using the given JSON formatted object.
 *               To modify a single stat, use writeToStat() or deleteStat()!
 * @memberOf fsAPI
 * @param {object} stats A JSON formatted object representing the entire
 * stats file.
 * @return {void}
 */
function writeStats(stats) {
    const statsPath = path.join(storagePath, 'stats.json');
    if (!fs.existsSync(statsPath)) {
        fs.closeSync(fs.openSync(statsPath, 'w'));
    }
    fs.writeFileSync(statsPath, JSON.stringify(stats));
}

/**
 * @name writeToStat
 * @description Modifies a single stat.
 * @memberOf fsAPI
 * @param {string} stat The stat to write to.
 * @param {string} val The value of the stat to set.
 * @return {void}
 */
function writeToStat(stat, val) {
    const stats = getStats();
    stats[stat] = val;
    writeStats(stats);
}

/**
 * @name deleteStat
 * @description Removes a stat from stats.json
 * @memberOf fsAPI
 * @param {string} stat The name of the stat to remove.
 * @return {void}
 */
function deleteStat(stat) {
    const stats = getStats();
    delete stats[stat];
    writeStats(stats);
}

/**
 * @name makeDirIfExists
 * @description checks if the folder exists in appdata and if not creates it
 * @memberOf fsAPI
 * @param {string} folder the folder to be checked for
 * @todo name of the function may be kind of long and cumbersome to use
 */
function makeDirIfNotExists(folder) {
    const folderPath = path.join(storagePath, folder);
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath);
    }
}

/**
 * @name getAllPlaylists
 * @description Gets an array that contains the names of every playlist.
 * @memberOf fsAPI
 * @return {object} An array of strings containing the name of every playlist.
 */
function getAllPlaylists() {
    const playlistPath = path.join(storagePath, 'playlists');

    makeDirIfNotExists('playlists');
    return fs.readdirSync(playlistPath); // may not return file types
}

/**
 * @name getPlaylist
 * @description Gets a single playlist by name.
 * @memberOf fsAPI
 * @param {string} playlist The name of the playlist to get.
 * @return {Object} A JSON formatted object that represents a playlist.
 */
function getPlaylist(playlist) {
    const playlistPath = path.join(storagePath, 'playlists', playlist);

    makeDirIfNotExists('playlists');
    if (!fs.existsSync(playlistPath)) {
        fs.closeSync(fs.openSync(playlistPath, 'w'));
        fs.writeFileSync(playlistPath, '{ }');
    }
    return JSON.parse(fs.readFileSync(playlistPath, 'utf8'));
}

/**
 * @name removePlaylist
 * @description Deletes a playlist by name.
 * @memberOf fsAPI
 * @param {string} playlistName The name of the playlist to delete
 * @return {void}
 */
function removePlaylist(playlistName) {
    const playlistPath = path.join(storagePath, 'playlists', playlistName);
    makeDirIfNotExists('playlists');
    if (!fs.existsSync(playlistPath)) return;
    fs.rmSync(playlistPath);
}

/**
 * @name writePlaylist
 * @description Writes a playlist. If it does not exist, creates a new
 * playlist.  If the playlist exists, it is overwritten.
 * @memberOf fsAPI
 * @param {string} playlistName The name of the playlist to write to.
 * @param {object} playlist A JSON formatted object containing the playlist
 * information.
 * @return {void}
 */
function writePlaylist(playlistName, playlist) {
    const playlistPath = path.join(storagePath, 'playlists', playlistName);
    makeDirIfNotExists('playlists');
    if (!fs.existsSync(playlistPath)) {
        fs.closeSync(fs.openSync(playlistPath, 'w'));
    }
    fs.writeFileSync(playlistPath, JSON.stringify(playlist));
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
function getSRCString(path) {
    return 'file:///' + path;
}

/**
 * @name recursiveSearchAtPath
 * @description Recursively searches every subdirectory at a given directory
 * to return every song.
 * @memberOf fsAPI
 * @param {string} searchPath The pat at which to recursively search
 * @return {string[]}  An array of every song path that exists recursively
 * within the directory.
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

/**
 * @name cullShortAudio
 * @memberOf fsAPI
 *
 */
function cullShortAudio() {
    const songs = getSongs();
    const remove = [];
    Object.keys(songs).forEach((song) => {
        console.log(!songs[song]);
        if (!songs[song] ||
            !songs[song]['format'] ||
            !songs[song]['format']['duration'] ||
            !(parseInt(songs[song]['format']['duration']) > 10)) {
            remove.push(song);
        }
    });
    remove.forEach((r) => delete songs[r]);
    writeSongs(songs);
}

module.exports = {
    getSettings,
    writeSettings,
    writeToSetting,
    deleteSetting,
    getSetting,
    getSongs,
    writeSongs,
    appendSong,
    appendSongs,
    removeSong,
    getStats,
    writeStats,
    writeToStat,
    deleteStat,
    getAllPlaylists,
    removePlaylist,
    writePlaylist,
    getSRCString,
    fsInit,
    devClear,
    recursiveSearchAtPath,
    cullShortAudio,
    setStoragePath,
    getSourceFolder,
};
