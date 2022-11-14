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
    ffplayPath,
    ffProbePath,
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
 * @return {Promise<object>}
 */
async function createMultiFFmpegPromise() {
    const childProcess = require('child_process');
    const fs = require('fs').promises;
    const {debugLog} = require('../../general/genAPICalls');
    const commands = await getMultiCMD();
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

            proc.stdout.on('data', async (data)=> {
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
 *
 * @return {Promise<Object>}
 */
async function useMultiFFmpeg() {
    return await createMultiFFmpegPromise();
}

module.exports = {
    ffmpegRead,
    ffmpegWrite,
    useMultiFFmpeg,
};
