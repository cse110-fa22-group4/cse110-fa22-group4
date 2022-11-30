const path = require('path');
const {
	getSettings, writeSettings,
} = require('../../fs/settings/settingsAPICalls');
const {
	appendSongs,
} = require('../../fs/songs/songsAPICalls');
const {
	childProcess,
} = require('child_process');
const {
	recursiveSearchAtPath,
} = require('../../fs/fsAPICalls');

const {
	getMultiCMD,
	removeTempFile,
	getPaths,
	getReadCMD,
	getWriteCMD,
	getReadCMDForSpawn,
} = require('../ffmpegAPICalls');

const {
	spawn,
} = require('child_process');
const {debugLog} = require('../../general/genAPICalls');
const {clipboard} = require('electron');
const {promises: fs} = require('fs');

// noinspection LoopStatementThatDoesntLoopJS
/**
 *
 * @param {string} filepath
 * @return {Promise<string>}
 */
async function ffmpegReadPromise(filepath) {
	const data = await getReadCMDForSpawn(filepath);
	await debugLog(data.cmd + ' ' + data.args, 'unit-tests');
	return new Promise((resolve, reject) => {
		try {
			const cmd = spawn(data.cmd, data.args);
			let retval = '';
			cmd.stdout.on('data', async (data) => {
				retval += data.toString();
			});
			cmd.stderr.on('data', async (data) => {
				// we don't have to do anything here, it just prints the same thing twice.
			});
			cmd.on('close', async (code) => {
				resolve(retval);
			});
		} catch (e) {
			reject(e);
		}
	});
}

/**
 * @name ffmpegRead
 * @description Performs an FFmpeg metadata read operation on the command line.
 * @memberOf ffmpegAPI
 * @param {string} filepath The path to the file to modify.
 * @return {Promise<Object>} A json object of the read metadata
 */
async function ffmpegRead(filepath) {
	const data = await ffmpegReadPromise(filepath);
	await debugLog(data.replace('/\n|  */g', ''), 'unit-tests');
	return JSON.parse(data.split('\n').join(''));
}

/**
 * @name ffmpegWrite
 * @description Performs an FFmpeg metadata write operation on the command line.
 * @memberOf ffmpegAPI
 * @param {string} filepath The path to the file to modify.
 * @param {object} options A dictionary of tags to modify
 * @return {Promise<void>}
 */
async function ffmpegWrite(filepath, options) {
	const childProcess = require('child_process');
	childProcess.execSync(await getWriteCMD(filepath, options)).toString();
	if (process.platform === 'win32') {
		childProcess.execSync('move /y out.' +
			filepath.split('.').pop() + ' ' + filepath);
	} else {
		childProcess.execSync('mv out.' +
			filepath.split('.').pop() + ' ' + filepath);
	}
}

/**
 * @param {string} path The paths to search.
 * @return {Promise<object>}
 */
async function createMultiFFmpegPromise(path) {
	const childProcess = require('child_process');
	const fs = require('fs').promises;
	const {debugLog} = require('../../general/genAPICalls');
	const commands = await getMultiCMD(await recursiveSearchAtPath(path));
	return new Promise((resolve, reject) => {
		try {
			const proc = childProcess.spawn(
				commands.cmd,
				[
					'-i', commands.args.input,
					'-o', commands.args.output,
					'-p', commands.args.probe,
					'-t',
				]);
			let errFlag = false;

			proc.stdout.on('data', async (data) => {
				if (data) {
					await debugLog(data.toString(), 'multi-ffmpeg-loading-progress');
				}
			});

			proc.stderr.on('data', async (data) => {
				errFlag = true;
				// await removeTempFile();
				reject(data.toString());
			});

			proc.on('close', async (code) => {
				if (!errFlag) {
					try {
						const fileData = await fs.readFile(commands.args.output);
						const stringData = fileData.toString();
						const data = JSON.parse(stringData);
						// await removeTempFile();
						resolve(data);
					} catch (error) {
						console.log(error);
					}
				}
			});
		} catch (e) {
			console.log(e);
			reject(e);
		}
	});
}

/**
 * @memberOf ffmpegAPI
 * @name createMultiFFmpegPromise
 * @param {string[]} paths The paths to search.
 * @return {Promise<Object>}
 */
async function useMultiFFmpeg(paths) {
	return await createMultiFFmpegPromise(paths);
}

module.exports = {
	ffmpegRead,
	ffmpegWrite,
	useMultiFFmpeg,
};
