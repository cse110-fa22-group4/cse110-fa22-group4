const path = require('path');
const fs = require('fs');
const fsPromises = require('fs').promises;
const {setStoragePath, getStoragePath, throwErr, throwErrOpen} = require('../fsAPICalls');
/**
 * @name getSongs
 * @description Gets the JSON formatted object that contains all songs and
 *                  their paths.
 * @memberOf fsAPI
 * @return {Promise<object>} A JSON formatted object containing all songs.
 */
async function getSongs() {
	const storagePath = await getStoragePath();
	const songPath = path.join(storagePath, 'songs.json');
	try {
		let songData = await fsPromises.readFile(songPath, 'utf8');
		return JSON.parse(songData);
	} catch (e) {
		await fsPromises.writeFile(songPath, "{ }");
		let songData = await fsPromises.readFile(songPath, 'utf8');
		return JSON.parse(songData);
	}
}

/**
 * @name getSongsTrackData
 * @memberOf fsAPI
 * @description Gets all songs in the user's library, in track data format.
 * @returns {Promise<object>} An array of track data.
 */
async function getSongsTrackData() {
	const songs = await getSongs();
	const ret = [];
	for (const songPath in songs) {
		const song = songs[songPath]['format'];
		const title = 'tags' in song && 'title' in song['tags'] ? song['tags']['title'] : '';
		const artist = 'tags' in song && 'artist' in song['tags'] ? song['tags']['artist'] : '';
		const album = 'tags' in song && 'album' in song['tags'] ? song['tags']['album'] : '';
		const year = 'tags' in song && 'date' in song['tags'] ? song['tags']['date'] : '';
		const duration = 'duration' in song ? song['duration']: '';
		const genre = 'tags' in song && 'genre' in song['tags'] ? song['tags']['genre'] : '';
		ret.push( {
			'title': title,
			'path': songPath,
			'artist': artist,
			'album': album,
			'year': year,
			'duration': duration,
			'genre': genre,
		});
	}
	return ret;
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
	const storagePath = await getStoragePath();
	const songPath = path.join(storagePath, 'songs.json');

	await fsPromises.writeFile(songPath, JSON.stringify(songs));
}

/**
 * @name appendSong
 * @description Adds a new song to the songs.json file.
 * @memberOf fsAPI
 * @param {object} newSong The path of the new song file as a key, and
 *                          metadata as a value.
 * @todo Kind of redundant with appendSongs around, isn't it?
 * @return {Promise<void>}
 */
async function appendSong(newSong) {
	const songs = await getSongs();
	for(const song in newSong)
		songs[song] = newSong[song];
	await writeSongs(songs);
}

/**
 * @name appendSongs
 * @description Appends multiple songs to the songs.json file.
 * @param {object} newSongs An array of new songs to be appended.
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
	getSongsTrackData,
	writeSongs,
	appendSong,
	appendSongs,
	removeSong,
	cullShortAudio,
};
