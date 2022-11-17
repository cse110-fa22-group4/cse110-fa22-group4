const path = require('path');
const {
    getAllPlaylists,
    getPlaylist,
    removePlaylist,
    writePlaylist,
} = require('../preload/fs/playlists/playlistAPICalls');

async function testPlaylist() {
    getAllPlaylists();
    getPlaylist();
    removePlaylist();
    writePlaylist();
}

async function getAllPlaylists() {
    
}

async function getPlaylist() {
    
}

async function removePlaylist() {
    
}

async function writePlaylist() {
    
}

module.exports = {
    testPlaylist,
};