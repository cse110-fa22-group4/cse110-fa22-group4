const path = require('path');
const {ipcRenderer} = require('electron');
const {
    getSettings,
    writeSettings,
    recursiveSearchAtPath,
    appendSongs,
} = require('./fsAPICalls.js');

let ffProbePath = '';
let ffmpegPath = '';
let ffplayPath = '';
let psSuspend = '';

/**
 *
 * @param {string} filepath The path of the file to modify
 * @return {string} The command to execute
 */
function getReadCMD(filepath) {
    return ffProbePath + ' -hide_banner -print_format json -show_format -i "' +
        filepath.split(path.sep).join(path.posix.sep) + '"';
}

/**
 *
 * @param {string} filepath The path of the file to modify
 * @param {object} options The tags to modify
 * @return {string} The command to execute
 */
function getWriteCMD(filepath, options) {
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
 *
 * @param {string} filepath
 * @return {Promise<string>}
 */
async function ffmpegReadPromise(filepath) {
    const childProcess = require('child_process');
    return await new Promise((resolve, reject) => {
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
 * @name binPath
 * @description Sets a path to ffprobe and ffmpeg, if it already exists on
 * the  system. If binPath is not passed in, will attempt to use path from
 * settings.
 * @memberOf ffmpegAPI
 * @param {string} binPath The path to ffprobe and ffmpeg.
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

    // Windows uses exe but mac and linux don't
    if (process.platform === 'win32') {
        ffProbePath = path.join(binPath, '/ffprobe.exe');
        ffmpegPath = path.join(binPath, '/ffmpeg.exe');
        ffplayPath = path.join(binPath, '/ffplay.exe');
        psSuspend = path.join(binPath, '/pssuspend.exe');
    } else {
        ffProbePath = path.join(binPath, '/ffprobe');
        ffmpegPath = path.join(binPath, '/ffmpeg');
        ffplayPath = path.join(binPath, '/ffplay');
        // why is windows such a pita?
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

/**
 * @type {string}
 */
let pausePath = '';
/**
 * @type {number}
 */
let pauseTime = 0;
/**
 * @type {number}
 */
let pauseVol = 100;
/**
 * @type {ChildProcessWithoutNullStreams}
 */
let songInstance = undefined;
/**
 * @memberOf ffmpegAPI
 * @name playSong
 * @description Plays a song, starting at the given seek value with the given volume.
 * @param {string} songPath The path to the song.
 * @param {number} volume The volume of the song.
 * @param {number} seekVal The starting time of the song.
 */
function playSong(songPath, volume = 100, seekVal = 0) {
    songInstance = require('child_process').spawn(ffplayPath,
        [
            '-nodisp',
            `-ss ${seekVal}`,
            `-volume ${volume}`,
            songPath,
        ], {shell: true});
    pauseVol = volume;
    pausePath = songPath;
    ipcRenderer.on('window-closed', stopSong);
}

/**
 * @memberOf ffmpegAPI
 * @name playSong
 * @description Stops playing a song, given the song instance returned from playSong.
 */
function stopSong() {
    if (!songInstance) return;
    require('child_process').spawn('taskkill', ['/pid', songInstance.pid, '/f', '/t']);
    songInstance = undefined;
}

/**
 *
 */
function pauseSong() {
    const data = songInstance.stderr.read().toString().split(' ');
    pauseTime = data[data.length - 26];
    stopSong();
}

/**
 *
 */
function resumeSong() {
    playSong(pausePath, pauseVol, pauseTime);
}

module.exports = {
    ffmpegRead,
    ffmpegWrite,
    setPath,
    getMetadataRecursive,
    playSong,
    stopSong,
    pauseSong,
    resumeSong,
};
