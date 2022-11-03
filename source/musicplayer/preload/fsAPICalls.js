const fs = require('fs');
const { ipcRenderer } = require('electron');
const path = require('path');

let storagePath = '';

/**
 * @description MUST BE CALLED ON STARTUP. Sets the path to userData, which can only be done from main.js.
 * @return {void}
 */
async function fsInit() {
    storagePath = await ipcRenderer.invoke('getUserData');
    storagePath = path.join(storagePath, "MixMatch");
    if (!fs.existsSync(storagePath)) {
        console.log(storagePath);
        fs.mkdirSync(storagePath);
    }
    /*
        Bro this function can't call any APIs since it is used before the initialization
        of the APIs, so we don't get any custom debug log functions.
     */
    // genAPI.debugLog("UserData Storage Path: " + storagePath, this);
    console.log("UserData Storage Path: " + storagePath); //todo: figure out cross apis
}

/**
 * @name devClear
 * @description Deletes every file. Useful for development and unit tests. Can only be called from whitelisted callers.
 * @memberOf fsAPI
 * @param caller {object} A reference to the caller. This function can only be called from whitelisted callers.
 * @return {null}
 */
function devClear(caller) {
    let settingPath = path.join(storagePath, "settings.json");
    let songsPath = path.join(storagePath, "songs.json");
    let statsPath = path.join(storagePath, "stats.json");
    let playlistPath = path.join(storagePath, "playlists");

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
        fs.rmdirSync(playlistPath, { recursive: true });
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
 * @returns {object} A JSON formatted object of all the current settings
 */
function getSettings() {
    let settingsPath = path.join(storagePath, "settings.json");
    if (!fs.existsSync(settingsPath)) {
        fs.closeSync(fs.openSync(settingsPath, 'w'));
        fs.writeFileSync(settingsPath, "{ }", );
    }
    return JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
}
/**
 * @name writeSettings
 * @description Rewrites the entire settings file using the given JSON. This rewrites the entire settings, if you
 *              want to only write one setting use writeToSetting()!
 * @memberOf fsAPI
 * @param settings {object} The new settings to set, in JSON format.
 * @returns {void}
 */
function writeSettings(settings) {
    let settingsPath = path.join(storagePath, "settings.json");
    if (!fs.existsSync(settingsPath)) {
        fs.closeSync(fs.openSync(settingsPath, 'w'));
    }
    fs.writeFileSync(settingsPath, JSON.stringify(settings), );
}
/**
 * @name writeToSetting
 * @description Writes a single setting to the settings.
 * @memberOf fsAPI
 * @param setting {string} The name of the setting to write to.
 * @param val {string} The value to set the setting to.
 * @returns {void}
 */
function writeToSetting(setting, val) {
    let settings = getSettings();
    settings[setting] = val;
    writeSettings(settings);
}
/**
 * @name deleteSetting
 * @description Removes a setting from the settings file entirely.
 * @memberOf fsAPI
 * @param setting The name of the setting to remove from the settings file.
 * @returns {void}
 */
function deleteSetting(setting) {
    let settings = getSettings();
    delete settings[setting];
    writeSettings(settings);
}
/**
 * @name getSongs
 * @description Gets the JSON formatted object that contains all songs and their paths.
 * @memberOf fsAPI
 * @returns {object} A JSON formatted object containing all songs.
 */
function getSongs() {
    let songPath = path.join(storagePath, "songs.json");
    if (!fs.existsSync(songPath)) {
        fs.closeSync(fs.openSync(songPath, 'w'));
        fs.writeFileSync(songPath, "{ }");
    }
    return JSON.parse(fs.readFileSync(songPath, 'utf8'));
}
/**
 * @name writeSongs
 * @description Rewrites the songs.json file with new content. If you want to modify a single song, use writeSongs() or
 *              readSongs()!
 * @memberOf fsAPI
 * @param songs {object} The JSON formatted object to write to songs.json
 * @returns {void}
 */
function writeSongs(songs) {
    let songPath = path.join(storagePath, "songs.json");
    if (!fs.existsSync(songPath)) {
        fs.closeSync(fs.openSync(songPath, 'w'));
    }
    fs.writeFileSync(songPath, JSON.stringify(songs));
}
/**
 * @name appendSong
 * @description Adds a new song to the songs.json file.
 * @memberOf fsAPI
 * @param newSongKey {string} The key used to insert into the songs.json file
 * @param newSongVal {object} The value used to insert into the songs.json file
 * @returns {void}
 */
function appendSong(newSongKey, newSongVal) {
    let songs = getSongs();
    songs[newSongKey] = newSongVal; // TODO: change me to only be value instead of kvp
    writeSongs(songs);
}
/**
 * @name removeSong
 * @description Removes a song from the songs.json folder
 * @memberOf fsAPI
 * @param oldSong {string} The name of the old song
 * @returns {void}
 */
function removeSong(oldSong) {
    let songs = getSongs();
    delete songs[oldSong]; // TODO: change me to remove from array instead of remove from dict
    writeSongs(songs);
}
/**
 * @name getStats
 * @description Gets the stats as a JSON formatted object.
 * @memberOf fsAPI
 * @returns {object} A JSON formatted object representing the stats.
 */
function getStats() {
    let statsPath = path.join(storagePath, "stats.json");
    if (!fs.existsSync(statsPath)) {
        fs.closeSync(fs.openSync(statsPath, 'w'));
        fs.writeFileSync(statsPath, "{ }");
    }
    return JSON.parse(fs.readFileSync(statsPath, 'utf8'));
}
/**
 * @name writeStats
 * @description Rewrites the stats file using the given JSON formatted object. To modify a single stat, use
 *              writeToStat() or deleteStat()!
 * @memberOf fsAPI
 * @param stats {object} A JSON formatted object representing the entire stats file.
 * @returns {void}
 */
function writeStats(stats) {
    let statsPath = path.join(storagePath, "stats.json");
    if (!fs.existsSync(statsPath)) {
        fs.closeSync(fs.openSync(statsPath, 'w'));
    }
    fs.writeFileSync(statsPath, JSON.stringify(stats));
}
/**
 * @name writeToStat
 * @description Modifies a single stat.
 * @memberOf fsAPI
 * @param stat {string} The stat to write to.
 * @param val {string} The value of the stat to set.
 * @returns {void}
 */
function writeToStat(stat, val) {
    let stats = getStats();
    stats[stat] = val;
    writeStats(stats);
}
/**
 * @name deleteStat
 * @description Removes a stat from stats.json
 * @memberOf fsAPI
 * @param stat {string} The name of the stat to remove.
 * @returns {void}
 */
function deleteStat(stat) {
    let stats = getStats();
    delete stats[stat];
    writeStats(stats);
}
/**
 * @name getAllPlaylists
 * @description Gets an array that contains the names of every playlist.
 * @memberOf fsAPI
 * @returns {object} An array of strings containing the name of every playlist.
 * @todo May or may not return file extensions, which could cause catastrophic errors if it doesn't. Testing needed.
 */
function getAllPlaylists() {
    let playlistPath = path.join(storagePath, "playlists");
    if (!fs.existsSync(playlistPath)) {
        fs.mkdirSync(playlistPath);
    }
    return fs.readdirSync(playlistPath); // may not return file types
}
/**
 * @name getPlaylist
 * @description Gets a single playlist by name.
 * @memberOf fsAPI
 * @param playlist {string} The name of the playlist to get.
 * @returns {Object} A JSON formatted object that represents a playlist.
 */
function getPlaylist(playlist) {
    let playlistPath = path.join(storagePath, "playlists", playlist);
    if (!fs.existsSync(playlistPath)) {
        fs.closeSync(fs.openSync(playlistPath, 'w'));
        fs.writeFileSync(playlistPath, "{ }");
    }
    return JSON.parse(fs.readFileSync(playlistPath, 'utf8'));
}
/**
 * @name removePlaylist
 * @description Deletes a playlist by name.
 * @memberOf fsAPI
 * @param playlistName The name of the playlist to delete
 * @returns {void}
 * @todo Right now file extension must be passed in, this should be fixed!
 */
function removePlaylist(playlistName) {
    let playlistPath = path.join(storagePath, "playlists", playlistName);
    if (!fs.existsSync(playlistPath)) return;
    fs.rmSync(playlistPath);
}
/**
 * @name writePlaylist
 * @description Writes a playlist. If it does not exist, creates a new playlist. If the playlist exists, it is
 *              overwritten.
 * @memberOf fsAPI
 * @param playlistName {string} The name of the playlist to write to.
 * @param playlist {object} A JSON formatted object containing the playlist information.
 * @returns {void}
 * @todo Right now file extension must be passed in, this should be fixed!
 */
function writePlaylist(playlistName, playlist) {
    let playlistPath = path.join(storagePath, "playlists", playlistName);
    if (!fs.existsSync(playlistPath)) {
        fs.closeSync(fs.openSync(playlistPath, 'w'));
    }
    fs.writeFileSync(playlistPath, JSON.stringify(playlist));
}
/**
 * @name getSRCString
 * @description Gets a string that, when passed into the src of a HTML Audio element will play the sound.
 * @memberOf fsAPI
 * @param path {string} The path to an audio file on the computer
 * @returns {string} A HTML Audio compatible src string.
 * @todo May not work on all (or any) OS! May need to give filesystem access!
 */
function getSRCString(path) {
    return "file:///" + path;
}

/**
 * @name recursiveSearchAtPath
 * @description Recursively searches every subdirectory at a given directory to return every song.
 * @memberOf fsAPI
 * @param searchPath {string} The pat at which to recursively search
 * @return {string[]}  An array of every song path that exists recursiveliy within the directory.
 */
function recursiveSearchAtPath(searchPath) {
    try {
        let ret = [];
        let dirs = fs.readdirSync(searchPath, {withFileTypes: true }).filter(d => d.isDirectory()).map(d => d.name);
        dirs.forEach(dir => {
            let dirPath = path.join(searchPath, dir);
            if (fs.existsSync(dirPath)) {
                let paths = recursiveSearchAtPath(dirPath);
                paths.forEach(p => ret.push(p));
            }
        });

        let files = fs.readdirSync(searchPath, {withFileTypes: true }).filter(d => d.isFile()).filter(d => d.name.split('.').pop() === "mp3").map(d => d.name);
        files.forEach(f => ret.push(path.join(searchPath, f)));

        return ret;
    }
    catch (e) {
        console.log(e);
        return [];
    }

}

module.exports = {
    getSettings,
    writeSettings,
    writeToSetting,
    deleteSetting,
    getSongs,
    writeSongs,
    appendSong,
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
    recursiveSearchAtPath
}