const {ffplayPath} = require('../ffmpegAPICalls');

let paused = true;
let path = '';
let pauseTime = 0;
let vol = 0;
let instance = undefined;
//TODO: is there a better way to get the duration other than reading directly from metadata?
//From stderr perhaps?
let duration;
/**
 * @memberOf ffmpegAPI
 * @description Plays a song at a given path with the given info.
 * @param {string} songPath The path of the song to play.
 * @param {number} volume The volume of the song to play.
 * @param {number} seekVal The location to start playing the song at.
 * @return {Promise<void>}
 */
async function playSong(songPath, volume = 100, seekVal = 0) {
	vol = volume;
	pauseTime = seekVal;
	paused = false;
	path = songPath;

	instance = await require('child_process').spawn(ffplayPath,
		[
			'-nodisp',
			`-ss ${seekVal}`,
			`-volume ${volume}`,
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
	// console data visualization.
	pauseTime = data[data.length - 26];
	await stopSong();
}

/**
 * @memberOf ffmpegAPI
 * @description Resumes the song.
 * @return {Promise<void>}
 */
async function resumeSong() {
	await playSong(path, vol, pauseTime);
}

/**
 * @memberOf ffmpegAPI
 * @description Stops the song.
 * @return {Promise<void>}
 */
async function stopSong() {
	if (!instance) return;
	if (process.platform === 'win32') {
		await require('child_process').spawn('taskkill', ['/pid', instance.pid, '/f', '/t']);
	} else {
		// use the macos version of kill process
	}
	instance = undefined;
	vol = 100;
	pauseTime = 0;
	path = '';
}

/**
 * @memberOf ffmpegAPI
 * @description seeks to the song 
 * given the progress bar's percentage
 * in whole percents(e.g. 85 for 85%)
 * This is made for convenience, as you can take the progress bar's
 * input using a dom call
 * @param seekPercentage the percentage
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
