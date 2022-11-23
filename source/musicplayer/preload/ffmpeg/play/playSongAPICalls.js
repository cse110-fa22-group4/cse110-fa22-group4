const {getPaths} = require('../ffmpegAPICalls');
const fs = require('fs');
const {debugLog} = require('../../general/genAPICalls');

let paused = true;
let path = '';
let pauseTime = 0;
let vol = 0;
let instance = undefined;
let pauseSongPath = '';
// TODO: is there a better way to get the duration other than reading directly from metadata?
// Answer: add it in as a parameter
// Front end will add in the song's duration, gathered from metadata reading, as a parameter
// duration in seconds
let duration = 0;
/**
 * @memberOf ffmpegAPI
 * @description Plays a song at a given path with the given info.
 * @param {string} songPath The path of the song to play.
 * @param {number} volume The volume of the song to play.
 * @param {number} seekVal The location to start playing the song at.
 * @return {Promise<void>}
 */
async function playSong(songPath, volume = 100, seekVal = 0, time) {
	vol = Number(volume);
	pauseTime = Number(seekVal);
	paused = false;
	path = `\"${songPath}\"`;
	duration = time;
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
			path,
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
	pauseSongPath = path.substring(1,path.length-1);
	await stopSong(false);
	paused = true;

	//console.log(filtered);
	//console.log(pauseTime);
}

/**
 * @memberOf ffmpegAPI
 * @description Resumes the song.
 * @return {Promise<void>}
 */
async function resumeSong() {
	//console.log(pauseSongPath);
	await playSong(pauseSongPath, vol, pauseTime, duration);
	//console.log(pauseTime);
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
		await require('child_process').spawn('kill', [instance.pid]);
	}
	if (reset) {
		paused = false;
		instance = undefined;
		vol = 100;
		pauseTime = 0;
		path = '';
		duration = 0;
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
	await stopSong(false);
	path = path.substring(1, path.length - 1);
	await playSong(path, vol, ((seekPercentage/100.0) * duration), duration);
}

module.exports = {
	playSong,
	pauseSong,
	resumeSong,
	stopSong,
	seekSong,
};
