const path = require('path');
const fs = require('fs');
const {getStoragePath, makeDirIfNotExists,
	throwErr, throwErrOpen} = require('../fsAPICalls');
const {getSongs} = require('../songs/songsAPICalls');
const {Grid} = require('gridjs');
const {debugLog} = require("../../general/genAPICalls");
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
	//Sorry, but with readdir, the
	//filenames would've gone out of scope in the callback
	//As a result, we can't return them
	return fs.readdirSync(playlistPath)
}

/**
 * @name getPlaylist
 * @description Gets a single playlist by name.
 * @memberOf fsAPI
 * @param {string} playlist The name of the playlist to get.
 * @return {Promise<object>} A map that represents a playlist.
 */
async function getPlaylist(playlist) {
	const storagePath = await getStoragePath();
	const playlistPath = path.join(storagePath, 'playlists', playlist);

	await makeDirIfNotExists('playlists');

	await fs.exists(playlistPath, async(e) => {
		if(!e) {
			await fs.open(playlistPath, 'w', throwErrOpen);
			await fs.writeFile(playlistPath, '{ songs: [ ], }', throwErr);
		}
	});
	//Again, the data would be a param in the callback
	//That we can't access again
	//Also Map parsing from https://codingbeautydev.com/blog/javascript-convert-json-to-map/
	const playlistObj = JSON.parse(fs.readFileSync(playlistPath, 'utf8'));
	const allSongs = await getSongs();
	const ret = [];

	await debugLog(playlistObj, 'playlists-test');
	 /* PLAYLIST JSON SCHEMA
		{
			"meta": {
				"creator": "UserA",
				"time": 3452397592387, (seconds since 0)
			},
			"tags": {
				"tagA": "expectedValue",
				"album_artist": "NCS",
			}
		}
	 */

	/*
	 So this is how search is going to work:
	 1. Get playlist as a json object (we should just be reading and writing it as a json object, don't need to do
	 			map stuff
	 2. Create a new gridJS instance with the columns being every *key* in "tags", and the data being the correct data
	 			from every song returned by getSongs()
	 				(note - the first column must be song path)
	 3. For each kvp in "tags":
	 	i. Update the grid config, overriding the search keyword
	 	ii. Use the callback described before to append the paths of songs with matching metadata to a list
	 4. Return the list of song paths.

	 */

	// todo: THIS SHOULD BE CREATED ONCE, NOT EVERY PLAYLIST CALL
	// the logic of making this needs to be reworked if this is only created once!
	// its possible that we can isolate the column logic from playlists, and make a
	// column for every possible unique tag. The hard part of that is ensuring that data
	// lines up for every song.
	const cols = ['path'].concat(Array.from(Object.keys(playlistObj['tags'])));
	const data = [];
	for (const songFormat in allSongs) {

		const song = allSongs[songFormat]['format'];
		const temp = { };
		temp['filename'] = song['filename']
		for (const tag in playlistObj['tags']) {
			if (tag in song) {
				temp[tag] = song[tag];
			}
			else if ('tags' in song && tag in song['tags']) {
				temp[tag] = song['tags'][tag];
			}
			else {
				temp[tag] = '';
			}
		}
		data.push(temp);
	}

	const grid = new Grid({
		columns: cols,
		data: data,
	});

	for (const tag in playlistObj['tags']) {

		grid.updateConfig({
			columns: cols,
			data: data,
			search: {
				enabled: true,
				keyword: '',
				/* The first column will be file path!!
				* how does one ensure the above statement without creating a new gridJS every time?*/
				selector: async (cell, rowIndex, cellIndex) => {
					await debugLog(cell, 'playlist-test');
					if (cellIndex !== 0) return;
					if (!ret.includes(cell)) ret.push(cell);
				},
			},
		});
		await debugLog(grid, 'playlists-test');

	}

	return ret;
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
 * @param {Object} playlist A map containing the playlist
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
		JSON.stringify(playlist),
		throwErr);
}

/**
 */
async function playlistSearch(keyword) {
	const gridSearcher = new Grid({
		sort: true,
		columns: ['names'],
		data: [await getAllPlaylists()],
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