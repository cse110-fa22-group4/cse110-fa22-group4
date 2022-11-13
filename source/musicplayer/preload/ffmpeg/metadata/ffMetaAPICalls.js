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
    ffplayPath,
    ffProbePath,
    getReadCMD,
    getWriteCMD,
    getReadCMDForSpawn,
} = require('../ffmpegAPICalls');

const {
    spawn,
} = require('child_process');

// noinspection LoopStatementThatDoesntLoopJS
/**
 *
 * @param {string} filepath
 * @return {Promise<string>}
 */
async function ffmpegReadPromise(filepath) {
    const data = await getReadCMDForSpawn(filepath);
    const cmd = spawn(data.cmd, data.args);
    // not sure why this is here, we need to stop using this function anyways.
    // todo: finish homemade cli app to replace this promise nightmare - liam
    // noinspection LoopStatementThatDoesntLoopJS
    for await (const d of cmd.stdout) {
        return d;
    }
    return new Promise((resolve, reject) => {
        try {
            const cmd = spawn(data.cmd, data.args, {shell: false});
            cmd.stdout.on('data', (data) => {
                resolve(data.toString());
            });
            cmd.on('error', (err) => {
                reject(err);
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
    return JSON.parse(await ffmpegReadPromise(filepath));
}

/**
 * @name ffmpegWrite
 * @description Performs an FFmpeg metadata write operation on the command line.
 * @memberOf ffmpegAPI
 * @param {string} filepath The path to the file to modify.
 * @param {Promise<object>} options A dictionary of tags to modify
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
 * @name getMetadataRecursive
 * @description recursively searches the files and prints it to songs.json
 * @memberOf ffmpegAPI
 * @param {Promise<string>} folderPath path to folder where we want to recursively search
 * @todo Do we have to store ALL of the metadata for the tags?
 */
async function getMetadataRecursive(folderPath) {
    const songObj = {};
    const listOfSongs = await recursiveSearchAtPath(folderPath);
    const totalLength = listOfSongs.length;
    const promiseArr = Array(listOfSongs.length);
    const time1 = Date.now();
    for (let i = 0; i < listOfSongs.length; i++) {
        promiseArr[i] = ffmpegReadPromise(listOfSongs[i]);
        console.log(promiseArr[i]);
    }
    const time2 = Date.now();
    await Promise.all(promiseArr).then((results) => {
        results.forEach((unparsedResult) => {
            const result = JSON.parse(unparsedResult);
            if (!result['format'] || !result['format']['filename']) return;
            songObj[result['format']['filename']] = result;
        });
    });
    await appendSongs(songObj);
}

/**
 * @param {string} paths
 * @return {Promise<unknown>}
 */
async function useMultiFFmpeg(paths) {
    const childProcess = require('child_process');
    const cmd = await getMultiCMD(paths);
    return new Promise((resolve, reject) => {
        childProcess.exec(cmd, (error, stdout, stderr) => {
            resolve(stdout);
        });
    });
}

module.exports = {
    ffmpegRead,
    ffmpegWrite,
    getMetadataRecursive,
    useMultiFFmpeg,
};
