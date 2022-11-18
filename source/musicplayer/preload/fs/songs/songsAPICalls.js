const path = require('path');
const fs = require('fs');
const {getStoragePath} = require('../fsAPICalls');

/**
 * @name getSongs
 * @description Gets the JSON formatted object that contains all songs and
 *                  their paths.
 * @memberOf fsAPI
 * @return {Promise<object>} A JSON formatted object containing all songs.
 */
async function getSongs() {
    let storagePath = await getStoragePath();
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
 * @return {Promise<void>}
 */
async function writeSongs(songs) {
    let storagePath = await getStoragePath();
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
 * @return {Promise<void>}
 */
async function appendSong(newSong) {
    const songs = await getSongs();
    songs.push(newSong);
    await writeSongs(songs);
}

/**
 * @name appendSongs
 * @description Appends multiple songs to the songs.json file.
 * @param {object[]} newSongs An array of new songs to be appended.
 * @return {Promise<void>}
 */
async function appendSongs(newSongs) {
    const songs = await getSongs();
    for (const song in newSongs) {
        if (!song) continue;
        songs[song] = newSongs[song];
    }
    await writeSongs(songs);
}

/**
 * @name removeSong
 * @description Removes a song from the songs.json folder
 * @memberOf fsAPI
 * @param {string} oldSong The name of the old song.
 * @return {Promise<void>}
 */
async function removeSong(oldSong) {
    const songs = await getSongs();
    delete songs[oldSong];
    await writeSongs(songs);
}

/**
 * @name cullShortAudio
 * @memberOf fsAPI
 * @return {Promise<void>}
 */
async function cullShortAudio() {
    const songs = await getSongs();
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
    await writeSongs(songs);
}

module.exports = {
    getSongs,
    writeSongs,
    appendSong,
    appendSongs,
    removeSong,
    cullShortAudio,
};
