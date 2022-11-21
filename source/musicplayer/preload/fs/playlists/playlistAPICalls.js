// remove {} surround the path variable fix the path not defined problem
const path = require('path');
// remove {} surround the fs variable fix the readdirSync not defined problem
const fs = require('fs');
const {getStoragePath, makeDirIfNotExists} = require('../fsAPICalls');
const {Grid} = require('gridjs');
/**
 * @name getAllPlaylists
 * @description Gets an array that contains the names of every playlist.
 * @memberOf fsAPI
 * @return {Promise<object>} An array of strings containing the name of every playlist.
 */
async function getAllPlaylists() {
	const storagePath = await getStoragePath();
	const playlistPath = path.join(storagePath, 'playlists');
	await makeDirIfNotExists('playlists');
	return await fs.readdir(playlistPath); // may not return file types
}

/**
 * @name getPlaylist
 * @description Gets a single playlist by name.
 * @memberOf fsAPI
 * @param {string} playlist The name of the playlist to get.
 * @return {Promise<Object>} A JSON formatted object that represents a playlist.
 */
async function getPlaylist(playlist) {
	const storagePath = await getStoragePath();
	const playlistPath = path.join(storagePath, 'playlists', playlist);

	await makeDirIfNotExists('playlists');
	if (!(await fs.exists(playlistPath))) {
		await fs.close(await fs.open(playlistPath, 'w'));
		await fs.writeFile(playlistPath, '{ songs: [ ], }');
	}
	return JSON.parse(await fs.readFile(playlistPath, 'utf8'));
}

/**
 * @name removePlaylist
 * @description Deletes a playlist by name.
 * @memberOf fsAPI
 * @param {string} playlistName The name of the playlist to delete
 * @return {Promise<void>}
 */
async function removePlaylist(playlistName) {
	const storagePath = await getStoragePath();
	const playlistPath = path.join(storagePath, 'playlists', playlistName);
	await makeDirIfNotExists('playlists');
	if (!(await fs.exists(playlistPath))) return;
	await fs.rm(playlistPath);
}

/**
 * @name writePlaylist
 * @description Writes a playlist. If it does not exist, creates a new
 * playlist.  If the playlist exists, it is overwritten.
 * @memberOf fsAPI
 * @param {string} playlistName The name of the playlist to write to.
 * @param {object} playlist A JSON formatted object containing the playlist
 * information.
 * @return {Promise<void>}
 */
async function writePlaylist(playlistName, playlist) {
	//TODO: test if it doesn't exist
	const storagePath = await getStoragePath();
	
	const playlistPath = path.join('~/Desktop', 'playlists', 'asdf.json');
	console.log(playlistPath);
	if (!(await fs.exists('~/Desktop/asdf.json'))) {
		await fs.close(await fs.open(playlistPath, 'w'));
	}
	await fs.writeFile(playlistPath, JSON.stringify(playlist));
}

/**
 */
async function playlistSearch(keyword) {
	const gridSearcher = new Grid({
		sort: true,
		columns: ['names'],
		data: [getAllPlaylists()],
		search: {
			enabled: true,
			selector: (cell, rowIndex, cellIndex) => {
			if (cellIndex === 1) console.log(cell);
				return cell;
			},
			keyword: keyword,
		},
	});
	
	//TODO: how do we iterate through the data?
	

}

async function exportPlaylist(playlistName) {
	//TODO: should just cp it if it exists
}
module.exports = {
	getAllPlaylists,
	getPlaylist,
	removePlaylist,
	writePlaylist,
};
