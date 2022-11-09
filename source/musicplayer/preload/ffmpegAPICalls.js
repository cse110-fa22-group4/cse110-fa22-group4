const path = require('path');
const {ipcRenderer} = require('electron');
const child_process = require('child_process');
const {getSettings, writeSettings, recursiveSearchAtPath, writeSongs} = require('./fsAPICalls.js');

let ffProbePath = '';
let ffmpegPath = '';

/**
 *
 * @param filepath The path of the file to modify
 * @return {string} The command to execute
 */
function getReadCMD(filepath) {
    return ffProbePath + ' -hide_banner -print_format json -show_format -i "' +
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
    let res = child_process.execSync(getReadCMD(filepath));
    return JSON.parse(res.toString());
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
    if(process.platform === 'win32') {
        child_process.execSync('move /y out.' + filepath.split('.').pop() + ' ' + filepath);
    }
    else {
        child_process.execSync('mv out.' + filepath.split('.').pop() + ' ' + filepath);
    }
}
/**
 * @name binPath
 * @description Sets a path to ffprobe and ffmpeg, if it already exists on the system. If binPath is not
 *              passed in, will attempt to use path from settings.
 * @memberOf ffmpegAPI
 * @param binPath The path to ffprobe and ffmpeg.
 */
function setPath(binPath = undefined) {
    const settings = getSettings();

    if (binPath === undefined) {
        if (settings['ffmpegPath'] !== undefined) {
            binPath = settings['ffmpegPath'];
            console.log('Found Path!');
        } else {
            return;
        }
    }

    //Windows uses exe but mac and linux don't
    if(process.platform === 'win32') {
            ffProbePath = path.join(binPath, '/ffprobe.exe');
            ffmpegPath = path.join(binPath, '/ffmpeg.exe');
    }
    else {
            ffProbePath = path.join(binPath, '/ffprobe');
            ffmpegPath = path.join(binPath, '/ffmpeg');
    }
    settings['ffmpegPath'] = binPath;
    writeSettings(settings);
}

/**
 * @name getMetadataRecursive
 * @description recursively searches the files and prints it to songs.json
 * @memberOf ffmpegAPI
 * @param {string} folderPath path to folder where we want to recursively search
 * @todo Do we have to store ALL of the metadata for the tags?
 */
function getMetadataRecursive(folderPath) {
    let songObj = { };
    let listOfSongs = recursiveSearchAtPath(folderPath);
    const totalLength = listOfSongs.length;
    listOfSongs.forEach((song, index) => {
        console.log(index / totalLength);
        songObj[song] = ffmpegRead(song);

    });
    console.log(songObj);
    writeSongs(songObj);
}

module.exports = {
    ffmpegRead,
    ffmpegWrite,
    setPath,
    getMetadataRecursive,
};
