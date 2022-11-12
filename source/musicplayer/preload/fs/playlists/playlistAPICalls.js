const {path} = require('path');
const {fs} = require('fs');
const {getStoragePath, makeDirIfNotExists} = require('../fsAPICalls');

/**
 * @name getAllPlaylists
 * @description Gets an array that contains the names of every playlist.
 * @memberOf fsAPI
 * @return {object} An array of strings containing the name of every playlist.
 */
async function getAllPlaylists() {
    let storagePath = await getStoragePath();
    const playlistPath = path.join(storagePath, 'playlists');

    await makeDirIfNotExists('playlists');
    return fs.readdirSync(playlistPath); // may not return file types
}

/**
 * @name getPlaylist
 * @description Gets a single playlist by name.
 * @memberOf fsAPI
 * @param {string} playlist The name of the playlist to get.
 * @return {Object} A JSON formatted object that represents a playlist.
 */
async function getPlaylist(playlist) {
    let storagePath = await getStoragePath();
    const playlistPath = path.join(storagePath, 'playlists', playlist);

    await makeDirIfNotExists('playlists');
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
async function removePlaylist(playlistName) {
    let storagePath = await getStoragePath();
    const playlistPath = path.join(storagePath, 'playlists', playlistName);
    await makeDirIfNotExists('playlists');
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
async function writePlaylist(playlistName, playlist) {
    let storagePath = await getStoragePath();
    const playlistPath = path.join(storagePath, 'playlists', playlistName);
    await makeDirIfNotExists('playlists');
    if (!fs.existsSync(playlistPath)) {
        fs.closeSync(fs.openSync(playlistPath, 'w'));
    }
    fs.writeFileSync(playlistPath, JSON.stringify(playlist));
}

module.exports = {
    getAllPlaylists,
    getPlaylist,
    removePlaylist,
    writePlaylist,
};
