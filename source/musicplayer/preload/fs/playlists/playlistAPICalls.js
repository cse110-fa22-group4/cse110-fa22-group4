const path = require('path');
const fs = require('fs');
const fsPromises = fs.promises;
const {getStoragePath, makeDirIfNotExists,
	throwErr, throwErrOpen, convertPathToTrack} = require('../fsAPICalls');
const {getSongs} = require('../songs/songsAPICalls');
const {Grid} = require('gridjs');
const {debugLog} = require('../../general/genAPICalls');

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
	// Sorry, but with readdir, the
	// filenames would've gone out of scope in the callback
	// As a result, we can't return them
	return await fsPromises.readdir(playlistPath);
}

/* PLAYLIST STRUCTURE:
{
	"meta": {
		"creator": "user",
		"date": "199925292"
	},
	"tags": [
		{
			"title": "aaa",
			"artist": "bbb",
			"album": "ccc",
		},
		{
			"album": "ddd",
			"artist": "eee",
		},
	],
}

	- meta contains useful information, such as the creator of the playlist and the time it was created
	- tags contains a sum of products form tag collection, as this allows for a minimal coverage of any set.

 */

/**
 * @name getPlaylist
 * @description Gets a single playlist by name.
 * @memberOf fsAPI
 * @param {string} playlist The name of the playlist to get.
 * @return {Promise<object>} A map that represents a playlist.
 */
async function getPlaylist(playlist) {
	await makeDirIfNotExists('playlists');

	const playlistObj = await getPlaylistObj(playlist);
	const allSongs = await getSongs();
	const foundPaths = [];
	const ret = {'name': playlist, 'trackList': []};

	for (const tagGroup of playlistObj['tags']) {

		const foundSongs = Object.entries(allSongs).filter((val) => {
			const meta = val[1];
			if (!('format' in meta)) return false;
			const metadata = meta['format'];
			for (const tag in tagGroup) {

				if (tag in metadata) {
					if (!metadata[tag].includes(tagGroup[tag])) return false;
				} else if ('tags' in metadata && tag in metadata['tags']) {
					if (!metadata['tags'][tag].includes(tagGroup[tag])) return false;
				} else return false;

			}
			return true;
		});

		for (const foundObj of foundSongs) {
			const foundPath = foundObj[0];
			const foundMeta = foundObj[1];
			if (foundPaths.includes(foundPath)) continue;
			if (!('format' in foundMeta)) continue;
			const song = foundMeta['format'];

			foundPaths.push(foundPath);
			ret['trackList'].push(await convertPathToTrack(foundPath, allSongs));
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
	await makeDirIfNotExists('playlists');
	try {
		await fsPromises.rm(playlistName);
	} catch (e) {

	}
}

/**
 * @memberOf fsAPI
 * @name createPlaylist
 * @description Initializes a new, empty playlist.
 * @param playlistName The playlist to create
 * @returns {Promise<void>}
 */
async function createPlaylist(playlistName) {
	await writeToPlaylist(playlistName, { "meta": {}, "tags": []});
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
 * @description Adds a new tag group to the playlist.
 * @param {string} playlistName The name of the playlist to write to.
 * @param {object} tagGroup A product of tags to add.
 * @example
 * const tags = { };
 * tags['artist'] = 'Dua Lipa';
 * tags['title'] = 'Future Nostalgia';
 * // tags:
 * // {
 * //	'artist': 'Dua Lipa',
 * //	'title': 'Future Nostalgia',
 * // }
 * await fsAPI.writeToPlaylist('myPlaylist', tags);
 * @return {Promise<void>}
 */
async function writeToPlaylist(playlistName, tagGroup) {
	const playlistObj = await getPlaylistObj(playlistName);
	playlistObj['tags'].push(tagGroup);
	await writePlaylist(playlistName, playlistObj);
}

/**
 * @memberOf fsAPI
 * @name writeToPlaylist
 * @description Removes a value from a tag for playlist creation.
 * @param {string} playlistName The name of the playlist.
 * @param {number} index The index of the tag group to remove.
 * @return {Promise<void>}
 */
async function removeFromPlaylist(playlistName, index) {
	const playlistObj = await getPlaylistObj(playlistName);
	playlistObj['tags'].splice(index);
	await writePlaylist(playlistName, playlistObj);

}

/**
 *
 * @param {string} playlistName The name of the playlist to get.
 * @returns {Promise<any>}
 */
async function getPlaylistObj(playlistName) {
	const storagePath = await getStoragePath();
	const playlistPath = path.join(storagePath, 'playlists', playlistName);
	try {
		return JSON.parse(await fsPromises.readFile(playlistPath, 'utf8'));

	} catch (e) {
		return { };
	}
}

async function exportPlaylist(playlistName) {
	// TODO: should just cp it if it exists
}
module.exports = {
	createPlaylist,
	getAllPlaylists,
	writeToPlaylist,
	removeFromPlaylist,
	getPlaylist,
	removePlaylist,
	writePlaylist,
};
