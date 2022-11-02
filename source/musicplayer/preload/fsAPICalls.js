const fs = require('fs');
const { app } = require('electron');
const path = require('path');

let storagePath = app.getPath('userData');

/* File Structure in userData
.../userData
    |-- playlists
    |   |-- myPlaylist.mmp
    |-- lyrics
    |   |-- myLyrics.(?)
    |-- settings.json
    |-- songs.json
    |-- stats.json
 */

function getSettings() {
    let settingsPath = path.join(storagePath, "/settings.json");
    if (!fs.existsSync(settingsPath)) {
        fs.writeFile(settingsPath, "{ }", () => { });
    }
    return JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
}
function writeSettings(settings) {
    let settingsPath = path.join(storagePath, "/settings.json");
    fs.writeFile(settingsPath, JSON.stringify(settings), () => { });
}
function writeToSetting(setting, val) {
    let settingsPath = path.join(storagePath, "/settings.json");
    let settings = getSettings();
    settings[setting] = val;
    writeSettings(settings);
}
function deleteSetting(setting) {
    let settingsPath = path.join(storagePath, "/settings.json");
    let settings = getSettings();
    delete settings[setting];
    writeSettings(settings);
}

function getSongs() {
    let songPath = path.join(storagePath, "/songs.json");
    if (!fs.existsSync(songPath)) {
        fs.writeFile(songPath, "{ }", () => { });
    }
    return JSON.parse(fs.readFileSync(songPath, 'utf8'));
}
function writeSongs(songs) {
    let songPath = path.join(storagePath, "/songs.json");
    fs.writeFile(songPath, JSON.stringify(songs), () => { });
}
function appendSong(newSong) {
    let songPath = path.join(storagePath, "/songs.json");

    let songs = getSongs();
    songs.push(newSong);
    writeSongs(songs);
}
function removeSong(oldSong) {
    let songPath = path.join(storagePath, "/songs.json");
    let songs = getSongs();
    delete songs[oldSong];
    writeSongs(songs);
}

function getStats() {
    let statsPath = path.join(storagePath, "/stats.json");
    if (!fs.existsSync(statsPath)) {
        fs.writeFile(statsPath, "{ }", () => { });
    }
    return JSON.parse(fs.readFileSync(statsPath, 'utf8'));
}
function writeStats(stats) {
    let statsPath = path.join(storagePath, "/stats.json");
    fs.writeFile(statsPath, JSON.stringify(stats), () => { });
}
function writeToStat(stat, val) {
    let statsPath = path.join(storagePath, "/stats.json");
    let stats = getStats();
    stats[stat] = val;
    writeStats(stats);
}
function deleteStat(stat) {
    let statsPath = path.join(storagePath, "/stats.json");
    let stats = getStats();
    delete stats[stat];
    writeStats(stats);
}

function getAllPlaylists() {
    let playlistPath = path.join(storagePath, "/playlists");
    return fs.readdirSync(playlistPath); // may not return file types
}
function getPlaylist(playlist) {
    let playlistPath = path.join(storagePath, "/playlists/", playlist);
    return JSON.parse(fs.readFileSync(playlistPath, 'utf8'));
}
function removePlaylist(playlist) {

}
function addPlaylist(playlist) {

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
    writeNewStats,
    writeToStat,
    deleteStat,
    getPlaylists,
    removePlaylist,
    addPlaylist
}