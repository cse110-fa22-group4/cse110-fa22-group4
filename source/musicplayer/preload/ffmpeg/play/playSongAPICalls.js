const {getPaths} = require('../ffmpegAPICalls');
const fs = require('fs');
const {debugLog} = require('../../general/genAPICalls');

let paused = true;
let path = '';
let pauseTime = 0;
let vol = 100;
let instance = undefined;
let pauseSongPath = '';
let loop = false;
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
 * @param {number} durationParam, how long the song lasts
 * @param {bool} loopParam whether or not to loop
 * @param {async function} callback, the callback that calls after the song
 * @todo set -loglevel quiet and -stats
 * @return {Promise<void>}
 */
async function playSong(songPath, volume = vol, seekVal = pauseTime, 
	durationParam = duration, loop_param=loop, callback = async() => {}) {
	vol = Number(volume);
	pauseTime = Number(seekVal);
	paused = false;
	path = `\"${songPath}\"`;
	loop = loop_param;
	duration = durationParam;
	const ffPaths = await getPaths();
	if (!fs.existsSync(songPath)) {
		await debugLog(`Could not find song at path: ${songPath}`, 'fsplay-error');
		return;
	}
	if (!fs.existsSync(ffPaths[0])) {
		await debugLog(`Could not find ffplay at path: ${ffPaths[0]}`, 'fsplay-error');
		return;
	}

	let options = [
			'-nodisp', '-hide_banner',
			'-autoexit',
			'-ss', seekVal,
			'-volume', volume,
	]
	//if we loop AND we seek to the begin
	//Don't want to start looping at seekVal forever
	if(loop && seekVal == 0) {
		options.push('-loop');
		options.push('0');
	}
	options.push(path);
	instance = await require('child_process').spawn(ffPaths[0],
	options,{shell: true});
	setBehaviorUponEnd(callback);
}
/**
 * @name toggleLooping
 * @memberOf ffmpegAPI
 * @description toggles looping on songs
 * @return {Promise<void>}
 */
async function toggleLooping() {
	await pauseSong();
	loop = !loop;
	await resumeSong();
}

/**
 * @name setBehaviorUponEnd
 * @memberOf ffmpegAPI
 * @description sets the behavior of the
 * ffplay instance after the song ends
 * @param callback the async callback that it calls
 */
async function setBehaviorUponEnd(callback = async () => {}) {
	instance.on('close', async (code) => {
		//if it closed "naturally"
		if(code == 0) {
			await callback();
			//if we loop, 
			//but we didn't pause at the start
			if(loop && pauseTime != 0) {
				await handleLooping();
			}
		}
	})
}

/**
 * @name handleLooping
 * @memberOf None
 * @description if we seek and loop, it loops
 * upon the time that we seeked to
 * And that's no good!
 * So, in response, we don't initially loop, but once it ends,
 * we seek to the beginning then loop
 * @return {Promise<void>}
 */
async function handleLooping() {
	await playSong(path, vol, 0);
}
/**
 * @name changeVolume
 * @memberOf ffmpegAPI
 * @description changes the volume
 * @param {number} volume from 0 to 100
 * @return {Promise<void>} 
 */
async function changeVolume(volume) {
	await pauseSong();
	await playSong(path, volume, pauseTime);
	pause = false;
}
/**
 * @name getCurrentTime
 * @memberOf ffmpegAPI
 * @description gets the current time in the song
 * @return {Promise<number>} time the current time
 */
async function getCurrentTime() {
	if (!instance) return;
	const data = instance.stderr.read().toString().split(' ');
	// The number 26 is a constant that emerges as a consequence of ffPlay's implementation of
	// console data visualization. One could also get duration in a similar way if they so chose, to find the magic
	// number place a breakpoint below and search the array manually.
	const filtered = data.filter((value, index) => {
		if (index < data.length - 30) return false;
		return value && value.includes('.');
	});
	return filtered[0];

}

/**
 * @name pauseSong
 * @memberOf ffmpegAPI
 * @description Pauses the song.
 * @return {Promise<void>}
 * @todo maybe the top half should use getCurrentTime
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

	await debugLog(filtered, 'play-song-tests');
	await debugLog(pauseTime, 'play-song-tests');
}

/**
 * @memberOf ffmpegAPI
 * @description Resumes the song.
 * @return {Promise<void>}
 */
async function resumeSong() {
	await debugLog(pauseSongPath, 'play-song-tests');
	await playSong(pauseSongPath, vol, pauseTime);
	await debugLog(pauseTime, 'play-song-tests');
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
		loop = false;
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
	await playSong(path, vol, ((seekPercentage/100.0) * duration), duration, loop);
}

module.exports = {
	playSong,
	pauseSong,
	resumeSong,
	stopSong,
	seekSong,
	setBehaviorUponEnd,
	changeVolume,
	getCurrentTime,
};
