const path = require('path');
const {ipcRenderer} = require('electron');
const child_process = require('child_process');
const {getSettings} = require('./fsAPICalls.js');

let ffProbePath = '';
let ffmpegPath = '';

/**
 *
 * @param filepath The path of the file to modify
 * @return {string} The command to execute
 */
function getReadCMD(filepath) {
    return ffProbePath + ' -hide_banner -print_format json -show_format -show_streams -i "' +
        filepath.split(path.sep).join(path.posix.sep) + '"';
}

/**
 *
 * @param filepath The path of the file to modify
 * @param options The tags to modify
 * @return {string} The command to execute
 */
function getWriteCMD(filepath, options) {
    let cmd = '';
    cmd += ffmpegPath + ' -i "' + filepath.split(path.sep).join(path.posix.sep) + '"';
    Object.keys(options).forEach((tag) => {
        cmd += ' -metadata ';
        cmd += tag + '="' + options[tag] + '" ';
    });
    cmd += ' out.' + filepath.split('.').pop(); // a very smart answer from wallacer on stackoverflow. qid: 190852
    return cmd;
}

/**
 * @name ffmpegRead
 * @description Performs an FFmpeg metadata read operation on the command line.
 * @memberOf ffmpegAPI
 * @param {string} filepath The path to the file to modify.
 * @return {string} A JSON string of the metadata of the file
 */
function ffmpegRead(filepath) {
    return JSON.parse(child_process.execSync(getReadCMD(filepath)).toString());
}
/**
 * @name ffmpegWrite
 * @description Performs an FFmpeg metadata write operation on the command line.
 * @memberOf ffmpegAPI
 * @param {string} filepath The path to the file to modify.
 * @param {object} options A dictionary of tags to modify
 */
function ffmpegWrite(filepath, options) {
    child_process.execSync(getWriteCMD(filepath, options)).toString();
    // TODO: THIS ONLY WORKS ON WINDOWS!!
    const outPath = filepath.split('/');
    child_process.execSync('move /y out.' + filepath.split('.').pop() + ' ' + filepath);
}
/**
 * @name binPath
 * @description Sets a path to ffprobe and ffmpeg, if it already exists on the system. If binPath is not
 *              passed in, will attempt to use path from settings.
 * @memberOf ffmpegAPI
 * @param binPath The path to ffprobe and ffmpeg.
 */
function setPath(binPath = undefined) {
    if (binPath === undefined) {
        const settings = getSettings();
        if (settings['ffmpegPath'] !== undefined) {
            binPath = settings['ffmpegPath'];
            console.log('Found Path!');
        } else {
            return;
        }
    }
    ffProbePath = path.join(binPath, '/ffprobe.exe');
    ffmpegPath = path.join(binPath, '/ffmpeg.exe');
}

module.exports = {
    ffmpegRead,
    ffmpegWrite,
    setPath,
};
