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
    ffplayPath,
    ffProbePath,
    getReadCMD,
    getWriteCMD,
    recursiveSearchAtPath,
} = require('../../fs/fsAPICalls');

/**
 *
 * @param {string} filepath
 * @return {Promise<string>}
 */
async function ffmpegReadPromise(filepath) {
    const childProcess = require('child_process');
    return new Promise((resolve, reject) => {
        childProcess.exec(getReadCMD(filepath), (error, stdout, stderr) => {
            resolve(stdout);
        });
    });
}

/**
 * @name ffmpegRead
 * @description Performs an FFmpeg metadata read operation on the command line.
 * @memberOf ffmpegAPI
 * @param {string} filepath The path to the file to modify.
 * @return {Object} A json object of the read metadata
 */
async function ffmpegRead(filepath) {
    return JSON.parse(await ffmpegReadPromise(filepath));
}

/**
 * @name ffmpegWrite
 * @description Performs an FFmpeg metadata write operation on the command line.
 * @memberOf ffmpegAPI
 * @param {string} filepath The path to the file to modify.
 * @param {object} options A dictionary of tags to modify
 */
function ffmpegWrite(filepath, options) {
    const childProcess = require('child_process');
    childProcess.execSync(getWriteCMD(filepath, options)).toString();
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
 * @param {string} folderPath path to folder where we want to recursively search
 * @todo Do we have to store ALL of the metadata for the tags?
 */
async function getMetadataRecursive(folderPath) {
    const songObj = {};
    const listOfSongs = recursiveSearchAtPath(folderPath);
    const totalLength = listOfSongs.length;
    const promiseArr = [];
    for (const song of listOfSongs) {
        const index = listOfSongs.indexOf(song);
        console.log(index / totalLength);
        promiseArr.push(new Promise((resolve, reject) => {
            ffmpegReadPromise(song).then((res) => resolve(res));
        }));
    }
    await Promise.all(promiseArr).then((results) => {
        results.forEach((unparsedResult) => {
            const result = JSON.parse(unparsedResult);
            if (!result['format'] || !result['format']['filename']) return;
            songObj[result['format']['filename']] = result;
        });
    });
    console.log(songObj);
    appendSongs(songObj);
}

module.exports = {
    ffmpegRead,
    ffmpegWrite,
    getMetadataRecursive,
};
