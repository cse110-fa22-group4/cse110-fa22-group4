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
	const storagePath = await getStoragePath();
	const playlistPath = path.join(storagePath, 'playlists', playlistName);
	try {
		await fsPromises.rm(playlistPath);
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
	await writePlaylist(playlistName, { "meta": {}, "tags": []});
	await writePlaylist(playlistName, { "meta": {}, "tags": []});
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
 * @name writePlaylistMeta
 * @description Writes metadata to a playlist, such as creator or date created.
 * @example
 * await writePlaylistMeta('myPlaylist', 'creator', 'user1');
 * @param playlistName The name of the playlist
 * @param metaTag The meta tag to add
 * @param metaValue The value to set.
 * @returns {Promise<void>}
 */
async function writePlaylistMeta(playlistName, metaTag, metaValue) {
	const playlist = await getPlaylistObj(playlistName);
	playlist['meta'][metaTag] = metaValue;
	await writePlaylist(playlistName, playlist);
}

/**
 * @memberOf fsAPI
 * @name removePlaylistMeta
 * @description Removes a metadata tag from a playlist.
 * @example
 * await removePlaylistMeta('myPlaylist', 'creator');
 * @param playlistName The name of the playlist
 * @param metaTag The tag to remove from the metadata
 * @returns {Promise<void>}
 */
async function removePlaylistMeta(playlistName, metaTag) {
	const playlist = await getPlaylistObj(playlistName);
	if (!(metaTag in playlist['meta'])) return;
	delete playlist['meta'][metaTag];
	await writePlaylist(playlistName, playlist);
}

/**
 * @memberOf fsAPI
 * @name getPlaylistMeta
 * @description Gets the metadata of a playlist as an object.
 * @example
 * const playlistMeta = await getPlaylistMeta('myPlaylist');
 * // playlistMeta = {
 * //	'creator': 'user1',
 * //	'date': '523470985',
 * //}
 * @param playlistName The name of the playlist.
 * @returns {Promise<object>} The metadata of the playlist.
 */
async function getPlaylistMeta(playlistName) {
	return (await getPlaylistObj(playlistName))['meta'];
}

/**
 * @memberOf fsAPI
 * @name removeFromPlaylist
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
 * @memberOf fsAPI
 * @name getPlaylistObj
 * @description Gets the actual playlist object. Should only be used for internal functions or debugging.
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
	getPlaylistObj,
	writePlaylistMeta,
	removePlaylistMeta,
	getPlaylistMeta,
	createPlaylist,
	getAllPlaylists,
	writeToPlaylist,
	removeFromPlaylist,
	getPlaylist,
	removePlaylist,
	writePlaylist,
};
