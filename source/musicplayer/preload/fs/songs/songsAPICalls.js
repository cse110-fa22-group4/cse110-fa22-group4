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
	//if (!(await fs.exists(songPath))) {
	await fs.exists(songPath, async (e) => {
		if(!e) {
				await fsPromises.close(await fsPromises.open(songPath, 'w'));
				await fsPromises.writeFile(songPath, '{ }');
		}
	});
	let songData = await fsPromises.readFile(songPath, 'utf8');
	return JSON.parse(songData);


}

/*
async function test () {
	await setStoragePath('users/user_reset/user_1/data');
	let songs = await getSongs();
	await setStoragePath('users/user_1/data');
	await writeSongs(songs);
	await setStoragePath('users/user_1/data');
	let so = await getSongs();

}
*/

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
	//if (!(await fs.exists(songPath))) {
	await fs.exists(songPath, async (e) => {
		if(!e)
			await fsPromises.close(await fs.open(songPath, 'w'));
	});
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
	for(const song in newSongs)
		songs[song] = newSong[song];
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

async function songsGrid() {
	//TODO: returns a grid of the songs
	
}
async function songsSearch() {
	//TODO:
}

module.exports = {
	getSongs,
	writeSongs,
	appendSong,
	appendSongs,
	removeSong,
	cullShortAudio,
};
