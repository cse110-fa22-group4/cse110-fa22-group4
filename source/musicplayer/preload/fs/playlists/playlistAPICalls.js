const path = require('path');
const fs = require('fs');
const {getStoragePath, makeDirIfNotExists,
throwErr, throwErrOpen} = require('../fsAPICalls');
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
	console.log(playlistPath);

	await makeDirIfNotExists(playlistPath);
	//Sorry, but with readdir, the np
	//filenames would've gone out of scope in the callback
	//As a result, we can't return them
	return fs.readdirSync(playlistPath);
}

/**
 * @name getPlaylist
 * @description Gets a single playlist by name.
 * @memberOf fsAPI
 * @param {string} playlist The name of the playlist to get.
 * @return {Promise<Map>} A map that represents a playlist.
 */
async function getPlaylist(playlist) {
	const storagePath = await getStoragePath();
	const playlistPath = path.join(storagePath, 'playlists', playlist);

	await makeDirIfNotExists(playlistPath);
	
	await fs.exists(playlistPath, async(e) => {
		if(!e) {
			await fs.open(playlistPath, 'w', throwErrOpen);
			await fs.writeFile(playlistPath, '{ songs: [ ], }', throwErr);
		}
	});
	//Again, the data would be a param in the callback
	//That we can't access again
	//Also Map parsing from https://codingbeautydev.com/blog/javascript-convert-json-to-map/
	return new Map(Object.entries(JSON.parse(fs.readFileSync(playlistPath, 'utf8'))));
	
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
	//if (!(await fs.exists(playlistPath))) return;
	//await fs.rm(playlistPath);
	await fs.exists(playlistPath, async(e) => {
		if(e) {
			await fs.rm(playlistPath, throwErr);
		}
	});
}

/**
 * @name writePlaylist
 * @description Writes a playlist. If it does not exist, creates a new
 * playlist.  If the playlist exists, it is overwritten.
 * @memberOf fsAPI
 * @param {string} playlistName The name of the playlist to write to.
 * @param {Map} playlist A map containing the playlist
 * information.
 * @return {Promise<void>}
 */
async function writePlaylist(playlistName, playlist) {
	
	const storagePath = await getStoragePath();
	
	const playlistPath = path.join(storagePath, 'playlists', playlistName);

	await fs.exists(playlistPath, async(e) => {
		if(!e) {
			await fs.open(playlistPath, 'w', throwErrOpen);
		}
	});
	//conversion from map to json partially inspired from
	//https://codingbeautydev.com/blog/javascript-convert-json-to-map/
	await fs.writeFile(playlistPath,
	JSON.stringify(Object.fromEntries(playlist)),
	throwErr);
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
