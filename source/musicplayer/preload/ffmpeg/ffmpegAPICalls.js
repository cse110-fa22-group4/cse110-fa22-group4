const path = require('path');
const {ipcRenderer} = require('electron');
const {
	recursiveSearchAtPath,
} = require('../fs/fsAPICalls.js');
const {
	debugLog,
} = require('../general/genAPICalls');

const {
	getSettings,
	writeSettings,
} = require('../fs/settings/settingsAPICalls');
const {
	getSongs,
} = require('../fs/songs/songsAPICalls');


let ffProbePath = '';
let ffmpegPath = '';
let ffplayPath = '';
let multiPath = '';


/**
 *
 * @param {string} filepath The path of the file to modify
 * @return {Promise<string>} The command to execute
 */
async function getReadCMD(filepath) {
	return ffProbePath + ' -hide_banner -print_format json -show_format -i "' +
        filepath.split(path.sep).join(path.posix.sep) + '"';
}

/**
 *
 * @param {string} filepath
 * @return {Promise<{args: string[], cmd: string}>} args
 */
async function getReadCMDForSpawn(filepath) {
	return {
		cmd: ffProbePath,
		args: [
			'-hide_banner',
			'-print_format', 'json',
			'-show_format',
			`${filepath.split(path.sep).join(path.posix.sep)}`,
		],
	};
}

/**
 *
 * @param {string} filepath The path of the file to modify
 * @param {object} options The tags to modify
 * @return {Promise<string>} The command to execute
 */
async function getWriteCMD(filepath, options) {
	let cmd = '';
	cmd += ffmpegPath + ' -i "' +
        filepath.split(path.sep).join(path.posix.sep) + '"';
	Object.keys(options).forEach((tag) => {
		cmd += ' -metadata ';
		cmd += tag + '="' + options[tag] + '" ';
	});
	// a very smart answer from wallacer on stackoverflow. qid: 190852
	cmd += ' out.' + filepath.split('.').pop();
	return cmd;
}

/**
 * @param {string[]} paths The file paths.
 * @return {Promise<{cmd: string, args: {input: string, output: string, probe:string}}>}
 */
async function getMultiCMD(paths) {
	const fs = require('fs').promises;
	const tempPath = path.join(await ipcRenderer.invoke('getTempPath'), 'songs_temp.txt');
	const outPath = path.join(await ipcRenderer.invoke('getTempPath'), 'out_json.txt');

	const songs = await getSongs();
	let fileContents = '';
	for (const songPath in paths) {
		if (!songPath) continue;
		fileContents += (paths[songPath] + '\n');
	}
	await fs.writeFile(tempPath, fileContents, (err) => {
		if (err) {
			console.log(err);
		}
	});
	return {
		cmd: multiPath,
		args: {
			input: tempPath,
			output: outPath,
			probe: ffProbePath,
		},
	};
}

/**
 * @description Removes the temp file from getMultiCMD.
 * @return {Promise<void>}
 */
async function removeTempFile() {
	const fs = require('fs');
	const tempPath = path.join(await ipcRenderer.invoke('getTempPath'), 'songs_temp.txt');
	const outPath = path.join(await ipcRenderer.invoke('getTempPath'), 'out_json.txt');
	await fs.unlink(tempPath, async (err) => {
		if (err) {
			await debugLog(err, 'general-error');
		}
	});
	await fs.unlink(outPath, async (err) => {
		if (err) {
			await debugLog(err, 'general-error');
		}
	});
}

/**
 * @name binPath
 * @description Sets a path to ffprobe and ffmpeg, if it already exists on
 * the  system. If binPath is not passed in, will attempt to use path from
 * settings.
 * @memberOf ffmpegAPI
 * @param {string} binPath The path to ffprobe and ffmpeg.
 * @return {Promise<void>}
 */
async function setPath(binPath = undefined) {
	const settings = await getSettings();

	if (binPath === undefined) {
		if (settings['ffmpegPath'] !== undefined) {
			binPath = settings['ffmpegPath'];
			await debugLog('Found ffmpeg Path!', 'fs-general');
		} else {
			return;
		}
	}

	// Windows uses exe but mac and linux don't
	if (process.platform === 'win32') {
		ffProbePath = path.join(binPath, '/ffprobe.exe');
		ffmpegPath = path.join(binPath, '/ffmpeg.exe');
		ffplayPath = path.join(binPath, '/ffplay.exe');
		multiPath = path.join(binPath, '/multi_ffmpeg.exe');
	} else {
		ffProbePath = path.join(binPath, '/ffprobe');
		ffmpegPath = path.join(binPath, '/ffmpeg');
		ffplayPath = path.join(binPath, '/ffplay');
		multiPath = path.join(binPath, '/multi_ffmpeg');
	}
	await debugLog(`Set ffPaths to\nffprobe: ${ffProbePath} \nffmpeg: ${ffmpegPath}\nffplay: ${ffplayPath}`,
		'fs-general');
	settings['ffmpegPath'] = binPath;
	await writeSettings(settings);
}

/**
 * @todo format response here.
 * @return {Promise<string[]>} Index 0 = ffPlay Index 1 = ffProbe Index 2 = ffmpeg
 */
async function getPaths() {
	return [ffplayPath, ffProbePath, ffmpegPath];
}

module.exports = {
	getPaths,
	setPath,
	getReadCMD,
	getWriteCMD,
	getMultiCMD,
	removeTempFile,
	getReadCMDForSpawn,
};
