const path = require('path');
const {ipcRenderer} = require('electron');
const {
    recursiveSearchAtPath,
} = require('../fs/fsAPICalls.js');

const {
    getSettings,
    writeSettings,
} = require('../fs/settings/settingsAPICalls');


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
            '-print_format json',
            'show_format',
            `-i "${filepath.split(path.sep).join(path.posix.sep)}"`,
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
 * @param {string} paths
 * @return {Promise<string>}
 */
async function getMultiCMD(paths) {
    let cmd = '';
    cmd += multiPath;
    paths.forEach((p) => cmd += ` ${p}`);
    return cmd;
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
            console.log('Found Path!');
        } else {
            return;
        }
    }

    // Windows uses exe but mac and linux don't
    if (process.platform === 'win32') {
        ffProbePath = path.join(binPath, '/ffprobe.exe');
        ffmpegPath = path.join(binPath, '/ffmpeg.exe');
        ffplayPath = path.join(binPath, '/ffplay.exe');
        multiPath = 'C:/Users/LPG/source/repos/multi_ffmpeg/bin/debug/net6.0/multi_ffmpeg.exe';
    } else {
        ffProbePath = path.join(binPath, '/ffprobe');
        ffmpegPath = path.join(binPath, '/ffmpeg');
        ffplayPath = path.join(binPath, '/ffplay');
        // why is windows such a pita?
    }
    settings['ffmpegPath'] = binPath;
    await writeSettings(settings);
}

module.exports = {
    ffplayPath,
    ffProbePath,
    ffmpegPath,
    setPath,
    getReadCMD,
    getWriteCMD,
    getMultiCMD,
    getReadCMDForSpawn,
};
