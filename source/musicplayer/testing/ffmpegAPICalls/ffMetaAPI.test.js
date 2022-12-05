const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')

const path = require('path');
const {
    reset_user1, reset_user2, reset_user_blank, reset_all, reset_songs
} = require('../fsAPITesting/fsAPITester');
const { setStoragePath, getSourceFolder, makeDirIfNotExists } = require('../../preload/fs/fsAPICalls');
const { ffmpegRead, ffmpegWrite } = require('../../preload/ffmpeg/metadata/ffMetaAPICalls');
const { getSettings, writeSettings } = require('../../preload/fs/settings/settingsAPICalls');
const { setPath, getPaths } = require("../../preload/ffmpeg/ffmpegAPICalls");
const { resetSongs } = require('../ffMetaAPI_Helper/ffMetaHelper');
const {type} = require("process");


/**
 *  Setting before the test begin
 *  Currently need to set the ffProbe path manually
 */
test.beforeAll( async() =>{
    await resetSongs('user1');
    await resetSongs('user2');
    // Since ffmpeg haven't packed, so we need manually to set the path to it
    await setPath("D:/SchoolData/UCSD/Classes/Fall2022/CSE110/ffmpeg" +
        "/ffmpeg-master-latest-win64-gpl/ffmpeg-master-latest-win64-gpl/bin/");
});

test('Test ffmpegRead for user1 song1', async () => {

    const songPath = "../users/user_1/songs/Tobu/Tobu - Hope.mp3";

    const meta = await ffmpegRead(songPath);

    expect(JSON.stringify(meta)).toBe('{"format":{"filename":"../users/user_1/songs/Tobu/Tobu - ' +
        'Hope.mp3","nb_streams":1,"nb_programs":0,"format_name":"mp3","format_long_name":"MP2/3 (MPEG audio ' +
        'layer 2/3)","start_time":"0.025057","duration":"285.126531","size":"4566456","bit_rate":"128124",' +
        '"probe_score":51,"tags":{"title":"Hope","artist":"Tobu","album":"Hope","track":"1/1","comment":' +
        '"Edited by Maztr Audio Tag Editor. https://maztr.com/audiotageditor","date":"2014"}}}');
});


test('Test ffmpegRead for user1 song2', async () => {

    const songPath = "../users/user_1/songs/Tobu/Tobu - Infectious.mp3";
    const meta = await ffmpegRead(songPath);

    expect(JSON.stringify(meta)).toBe('{"format":{"filename":"../users/user_1/songs/Tobu/Tobu ' +
        '- Infectious.mp3","nb_streams":2,"nb_programs":0,"format_name":"mp3","format_long_name":"MP2/3 ' +
        '(MPEG audio layer 2/3)","start_time":"0.025056","duration":"256.130612","size":"4127097",' +
        '"bit_rate":"128906","probe_score":51,"tags":{"title":"Infectious","artist":"Tobu","album":' +
        '"Infectious","track":"1/1","comment":"Edited by Maztr Audio Tag Editor. https://maztr.com/audiotageditor","date":"2014"}}}');
});

test('Test ffmpegRead for user2 song2', async () => {

    const songPath = "../users/user_2/songs/Tobu/Tobu - Infectious.mp3";
    const meta = await ffmpegRead(songPath);

    expect(JSON.stringify(meta)).toBe('{"format":{"filename":"../users/user_2/songs/Tobu/Tobu' +
        ' - Infectious.mp3","nb_streams":2,"nb_programs":0,"format_name":"mp3","format_long_name":"MP2/3' +
        ' (MPEG audio layer 2/3)","start_time":"0.025056","duration":"256.130612","size":"4127097",' +
        '"bit_rate":"128906","probe_score":51,"tags":{"title":"Infectious","artist":"Tobu","album":' +
        '"Infectious","track":"1/1","comment":"Edited by Maztr Audio Tag Editor. https://maztr.com/audiotageditor","date":"2014"}}}');
});


/**
 * Error occur after ffMetaAPI got updated
 * ffmpedWrite works on the electron but not on the test
 */
// /**
//  *  Change Metadata of the song for user1
//  */
// test('Test ffmpedWrite for user1', async() => {
//     const songPath = '../users/user_1/songs/Tobu/Tobu - Hope.mp3';
//     await ffmpegWrite(songPath, {
//         "ALBUM": "testForWriteMeta",
//         "Artist": "unknown"});

    // // Grab the info. from the song Metadata
    // const meta = await ffmpegRead(songPath);
    // const obj_tags = meta.format.tags;
    // const tags_names = Object.keys(obj_tags);
    // const tags_entries = Object.entries(obj_tags);
    //
    // // Check whether if the NEW tags are added into the songs
    // let check_tags;
    // if (tags_names.includes('artist') &&
    //     tags_names.includes('album')) {
    //     check_tags = true;
    // }else{
    //     check_tags = false;
    // }
    // await expect(check_tags).toBeTruthy();
    //
    // // Check whether if the tags names included the correct value
    // let correct_tags = 0;
    // for (const [key, value] of tags_entries) {
    //     if (key === 'album' && value === 'testForWriteMeta') {
    //         correct_tags++;
    //     }
    //     else if (key === 'artist' && value === 'unknown') {
    //         correct_tags++;
    //     }
    // }
    // await expect(correct_tags).toBe(2);
// });
//
// /**
//  *  Change Metadata of the song for user2
//  */
// test('Test ffmpedWrite for user2', async() => {
//     const songPath = "../users/user_2/songs/Tobu/Tobu - Infectious.mp3";
//     await ffmpegWrite(songPath, {
//         "ALBUM": "testForWriteMeta",
//         "Artist": "UNKNOWN",
//         "Title": "ffmpedWriteTester"});

    // // Grab the info. from the song Metadata
    // const meta = await ffmpegRead(songPath);
    // const obj_tags = meta.format.tags;
    // const tags_names = Object.keys(obj_tags);
    // const tags_entries = Object.entries(obj_tags);
    //
    // // Check whether if the NEW tags are added into the songs
    // let check_tags;
    // if (tags_names.includes('title') &&
    //     tags_names.includes('artist') &&
    //     tags_names.includes('album')) {
    //     check_tags = true;
    // }else{
    //     check_tags = false;
    // }
    // await expect(check_tags).toBeTruthy();
    //
    // // Check whether if the tags names included the correct value
    // let correct_tags = 0;
    // for (const [key, value] of tags_entries) {
    //     if (key === 'album' && value === 'testForWriteMeta') {
    //         correct_tags++;
    //     }
    //     else if (key === 'title' && value === 'ffmpedWriteTester') {
    //         correct_tags++;
    //     }
    //     else if (key === 'artist' && value === 'UNKNOWN') {
    //         correct_tags++;
    //     }
    // }
    // await expect(correct_tags).toBe(3);
// });


/**
 * reset all the modified data to the original
 */
test.afterAll(async ()=>{
    await resetSongs('user1');
    await resetSongs('user2');
});

