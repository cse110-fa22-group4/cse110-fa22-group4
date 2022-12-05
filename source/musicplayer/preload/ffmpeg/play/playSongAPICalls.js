const {getPaths} = require('../ffmpegAPICalls');
const fs = require('fs');
const {debugLog} = require('../../general/genAPICalls');

let paused = true;
let path = '';
let pauseTime = 0;
let vol = 50;
let instance = undefined;
let pauseSongPath = '';
let timeStarted; 
let duration = 0;
/**
 * @memberOf ffmpegAPI
 * @description Plays a song at a given path with the given info.
 * @param {string} songPath The path of the song to play.
 * @param {number} volume The volume of the song to play.
 * @param {number} seekVal The location to start playing the song at.
 * @param {number} durationParam, how long the song lasts
 * @param {function} callback, the callback that calls after the song
 * @todo set -loglevel quiet and -stats
 * @return {Promise<void>}
 */
async function playSong(songPath, volume = vol, seekVal = pauseTime, 
	durationParam = duration, callback = async() => {}) {
	vol = Number(volume);
	pauseTime = Number(seekVal);
	paused = false;
	path = `\"${songPath}\"`;
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
	options.push(path);
	instance = await require('child_process').spawn(ffPaths[0],
	options,{shell: true});
	timeStarted = Date.now() - (seekVal * 1000);
	await setBehaviorUponEnd(callback);
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
		if(code === 0) {
			await callback();
		}
	})
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

	return (Date.now() - timeStarted)/1000.0;


}

/**
 * @name pauseSong
 * @memberOf ffmpegAPI
 * @description Pauses the song.
 * @return {Promise<void>}
 * @todo maybe the top half should use getCurrentTime
 */
async function pauseSong() {
	pauseTime = (Date.now() - timeStarted)/1000.0;
	await stopSong(false);
	pauseSongPath = path.substring(1,path.length-1);
	paused = true;

	//await debugLog(filtered, 'play-song-tests');
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
		vol = 50;
		pauseTime = 0;
		path = '';
		duration = 0;
	}
}

/**
 * @memberOf ffmpegAPI
 * @description Seeks the current song to a song time.
 * @param {number} seekValue the value to seek to
 */
async function seekSong(seekValue) {
	await stopSong(false);
	await playSong(path, vol, seekValue, duration, loop);
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
