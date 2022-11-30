const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
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
	return await fsPromises.readdir(playlistPath)
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

	const playlistObj = JSON.parse(await fsPromises.readFile(playlistPath, 'utf8'));
	const allSongs = await getSongs();
	const foundPaths = [];
	const ret = { "name": playlist, "trackList": [] };

	for (const tagGroup in playlistObj['tags']) {
		await debugLog(playlistObj['tags'], 'playlists-test');
		for (const tagIndex in playlistObj['tags'][tagGroup]) {
			const tag = playlistObj['tags'][tagGroup][tagIndex];
			for (const songPath in allSongs) {
				const song = allSongs[songPath]['format'];

				if (foundPaths.includes(songPath)) continue;
				if (!(tagGroup in song &&song[tagGroup].includes(tag) ||
					'tags' in song && tagGroup in song['tags'] && song['tags'][tagGroup].includes(tag))) continue;

				foundPaths.push(songPath);
				const title = 'tags' in song && 'title' in song['tags'] ? song['tags']['title'] : '';
				const artist = 'tags' in song && 'artist' in song['tags'] ? song['tags']['artist'] : '';
				const album = 'tags' in song && 'album' in song['tags'] ? song['tags']['album'] : '';
				const year = 'tags' in song && 'date' in song['tags'] ? song['tags']['date'] : '';
				const duration = 'duration' in song ? song['duration']: '';
				const genre = 'tags' in song && 'genre' in song['tags'] ? song['tags']['genre'] : '';
				ret['trackList'].push( {
					'title': title,
					'path': songPath,
					'artist': artist,
					'album': album,
					'year': year,
					'duration': duration,
					'genre': genre,
				});
			}
		}
	}
	ret['numTracks'] = foundPaths.length;

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
			await fsPromises.rm(playlistPath);
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
	await fsPromises.writeFile(playlistPath, JSON.stringify(playlist));
}

/**
 * @memberOf fsAPI
 * @name writeToPlaylist
 * @description Adds a new tag, value pair to search for during playlist creation.
 * @param {string} playlistName The name of the playlist to write to.
 * @param {string} tag The tag to add.
 * @param {string} val The value to search for.
 * @returns {Promise<void>}
 */
async function writeToPlaylist(playlistName, tag, val) {
	const storagePath = await getStoragePath();
	const playlistPath = path.join(storagePath, 'playlists', playlistName);
	const playlistObj = JSON.parse(await fsPromises.readFile(playlistPath, 'utf8'));
	if (!(tag in playlistObj['tags'])) {
		playlistObj['tags'][tag] = [];
	}
	playlistObj['tags'][tag].push(val);
	await writePlaylist(playlistName, playlistObj);
}

/**
 * @memberOf fsAPI
 * @name writeToPlaylist
 * @description Removes a value from a tag for playlist creation.
 * @param {string} playlistName The name of the playlist.
 * @param {string} tag The tag to use.
 * @param {string} val The value to remove.
 * @returns {Promise<void>}
 */
async function removeFromPlaylist(playlistName, tag, val) {
	const storagePath = await getStoragePath();
	const playlistPath = path.join(storagePath, 'playlists', playlistName);
	const playlistObj = JSON.parse(await fsPromises.readFile(playlistPath, 'utf8'));
	if (tag in playlistObj['tags']) {
		const filtered = playlistObj['tags'][tag].filter((value) => value !== val);
		await writePlaylist(playlistName, filtered);
	}
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
	writeToPlaylist,
	removeFromPlaylist,
	getPlaylist,
	removePlaylist,
	writePlaylist,
};
