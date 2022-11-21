const {getPaths} = require('../ffmpegAPICalls');
const fs = require('fs');
const {debugLog} = require('../../general/genAPICalls');

let paused = true;
let path = '';
let pauseTime = 0;
let vol = 0;
let instance = undefined;
// TODO: is there a better way to get the duration other than reading directly from metadata?
// From stderr perhaps?
// Duration can be scraped from the stderr, if you want to try what you can do is place a breakpoint on line
// 48, and look for the index in the data array (offset from the end, not the start) of the duration, and from there can
// scrape it in playSong().
const duration = 0;
/**
 * @memberOf ffmpegAPI
 * @description Plays a song at a given path with the given info.
 * @param {string} songPath The path of the song to play.
 * @param {number} volume The volume of the song to play.
 * @param {number} seekVal The location to start playing the song at.
 * @return {Promise<void>}
 */
async function playSong(songPath, volume = 100, seekVal = 0) {
	vol = Number(volume);
	pauseTime = Number(seekVal);
	paused = false;
	path = String(songPath);
	const ffPaths = await getPaths();
	if (!fs.existsSync(songPath)) {
		await debugLog(`Could not find song at path: ${songPath}`, 'fsplay-error');
		return;
	}
	if (!fs.existsSync(ffPaths[0])) {
		await debugLog(`Could not find ffplay at path: ${ffPaths[0]}`, 'fsplay-error');
		return;
	}

	instance = await require('child_process').spawn(ffPaths[0],
		[
			'-nodisp', '-hide_banner',
			'-ss', seekVal,
			'-volume', volume,
			songPath,
		], {shell: true});
}

/**
 * @memberOf ffmpegAPI
 * @description Pauses the song.
 * @return {Promise<void>}
 */
async function pauseSong() {
	if (!instance) return;
	const data = instance.stderr.read().toString().split(' ');
	// The number 26 is a constant that emerges as a consequence of ffPlay's implementation of
	// console data visualization. One could also get duration in a similar way if they so chose, to find the magic
	// number place a breakpoint below and search the array manually.
	const filtered = data.filter((value, index) => {
		if (index < data.length - 30) return false;
		return value && value.includes('.');
	});
	pauseTime = filtered[0];
	await stopSong(false);
	paused = true;

	console.log(filtered);
	console.log(pauseTime);
}

/**
 * @memberOf ffmpegAPI
 * @description Resumes the song.
 * @return {Promise<void>}
 */
async function resumeSong() {
	await playSong(path, vol, pauseTime);
	console.log(pauseTime);
	paused = false;
}

/**
 * @memberOf ffmpegAPI
 * @description Stops the song.
 * @param {boolean} reset Resets the local variables, don't touch if you don't know what you are doing.
 * @return {Promise<void>}
 */
async function stopSong(reset = true) {
	if (!instance) return;
	if (process.platform === 'win32') {
		await require('child_process').spawn('taskkill', ['/pid', instance.pid, '/f', '/t']);
	} else {
		await require('child_process').spawn('kill ' + instance.pid);
	}
	if (reset) {
		paused = false;
		instance = undefined;
		vol = 100;
		pauseTime = 0;
		path = '';
	}
}

/**
 * @memberOf ffmpegAPI
 * @description seeks to the song
 * given the progress bar's percentage
 * in whole percents(e.g. 85 for 85%)
 * This is made for convenience, as you can take the progress bar's
 * input using a dom call
 * @param {number} seekPercentage the percentage
 */
async function seekSong(seekPercentage) {
	await stopSong();
	await playSong(path, vol, ((seekPercentage/100.0) * duration));
}

module.exports = {
	playSong,
	pauseSong,
	resumeSong,
	stopSong,
};
