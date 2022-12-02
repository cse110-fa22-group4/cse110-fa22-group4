// fsAPI.test.js
const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')
const functions_playlist = require('../../preload/fs/playlists/playlistAPICalls');
const {fsInit, getStoragePath, setStoragePath, makeDirIfNotExists} = require("../../preload/fs/fsAPICalls");
const path = require("path");
const fs = require("fs");
const {removePlaylist, writePlaylist, createPlaylist, getPlaylist, writeToPlaylist, getPlaylistMeta, getPlaylistObj,
    removeFromPlaylist, writePlaylistMeta, removePlaylistMeta
} = require("../../preload/fs/playlists/playlistAPICalls");
const fsPromises = fs.promises;


/**
 * Set up the initial stage for the test
 */
test.beforeAll(async () => {

    const testPath = '../source/users/user_3/songs';
    // Read an empty file without any playlist in it.
    await setStoragePath(testPath);

    // Empty the all the files in testing playlist
    const playlistPath = path.join(await getStoragePath(), 'playlists');
    for (const file of await fsPromises.readdir(playlistPath)) {
        const path_songs = path.join(playlistPath, file);
        console.log('songs:', path_songs);
        await fsPromises.unlink(path_songs);
    }
});

/**
 * Check functionality of getAllPlaylists();
 * check the empty playlist in the file
 */
test('Check functionality of getAllPlaylists()', async ()=>{
    // test the initial stage of getAllPlaylists()
    const str_playlist = JSON.stringify(await functions_playlist.getAllPlaylists());
    // Should be returning an empty object(map)
    expect(str_playlist).toBe('[]');
});

/**
 * Check getAllPlaylists() after getting a playlist
 */
test('Check getAllPlaylists() after adding a playlist', async () => {
    // Creating a playlist
    await functions_playlist.createPlaylist('Added Playlist');
    const str_playlist = JSON.stringify(await functions_playlist.getAllPlaylists());
    expect(str_playlist).toBe('[\"Added Playlist\"]');
});


/**
 * Test after removing a playlist
 */
test('Checking removePlaylist() after removing a playlist', async () => {
    await removePlaylist('Added Playlist');
    const str_playlist = JSON.stringify(await functions_playlist.getAllPlaylists());
    expect(str_playlist).toBe('[]');
});

/**
 * Test after adding a playlist and get the info of the list
 */
test('Checking getPlaylist() after adding a playlist', async () => {
    await createPlaylist('New Playlist');
    const playlist_map = await getPlaylist('New Playlist');

    expect(JSON.stringify(playlist_map)).toBe("{\"name\":\"New Playlist\",\"trackList\":[],\"numTracks\":0}");

    // expect(playlist_map).toBe({ name: 'New Playlist', trackList: [], numTracks: 0 });
});

/**
 * Test write Tags to the playlist
 */
test('Testing writeToPlaylist(playlistName, tagGroup)', async () => {
    const tags = {};
    tags['artist'] = 'unknown';
    tags['title'] = 'playlistTest';
    tags['year'] = '2022';
    // Write the above tags to the playlist
    await writeToPlaylist('New Playlist', tags);

    // Get the data from the playlist
    const obj_playlist = await getPlaylistObj('New Playlist');
    const obj_tags = obj_playlist.tags;

    const str_tags = JSON.stringify(obj_tags[0]);
    expect(str_tags).toBe("{\"artist\":\"unknown\",\"title\":\"playlistTest\",\"year\":\"2022\"}");
});

/**
 * Test Delete Tags from the playlist
 */
test('Testing removeFromPlaylist(playlistName, index)', async () => {

    // write an additional tags to the playlist
    const tags = {};
    tags['artist2'] = 'unknown';
    tags['duration'] = '16 mins';
    tags['album'] = 'Team4';

    // write an additional tags to the playlist
    const tags1 = {};
    tags1['artist3'] = 'unknown';
    tags1['date'] = '2022-11-11';

    // Write the above tags to the playlist
    await writeToPlaylist('New Playlist', tags);
    await writeToPlaylist('New Playlist', tags1);

    let obj_playlist = await getPlaylistObj('New Playlist');
    const obj_tags = obj_playlist.tags;

    let str_tags = JSON.stringify(obj_tags);

    // check if new tags being added
    expect(str_tags).toBe("[{\"artist\":\"unknown\",\"title\":\"playlistTest\",\"year\":\"2022\"}," +
        "{\"artist2\":\"unknown\",\"duration\":\"16 mins\",\"album\":\"Team4\"}," +
        "{\"artist3\":\"unknown\",\"date\":\"2022-11-11\"}]");

    // delete the second tags object
    await removeFromPlaylist('New Playlist', 1);
    obj_playlist = await getPlaylistObj('New Playlist');
    str_tags = JSON.stringify(obj_playlist.tags);
    expect(str_tags).toBe("[{\"artist\":\"unknown\",\"title\":\"playlistTest\",\"year\":\"2022\"},{\"artist3\":\"unknown\",\"date\":\"2022-11-11\"}]");

    // delete the last tags object
    await removeFromPlaylist('New Playlist', 1);
    obj_playlist = await getPlaylistObj('New Playlist');
    str_tags = JSON.stringify(obj_playlist.tags);
    expect(str_tags).toBe("[{\"artist\":\"unknown\",\"title\":\"playlistTest\",\"year\":\"2022\"}]");


    // delete the rest of the tags object
    await removeFromPlaylist('New Playlist', 0);
    obj_playlist = await getPlaylistObj('New Playlist');
    str_tags = JSON.stringify(obj_playlist.tags);
    expect(str_tags).toBe("[]");
});


/**
 * Test write/get/remove Meta to the playlist.
 */
test('Testing write/get/remove Metadata to the playlist', async () =>{

    // testing write and get Meta
    await writePlaylistMeta('New Playlist', 'creator', 'team4');
    let playlist_Meta = await getPlaylistMeta('New Playlist');
    expect(JSON.stringify(playlist_Meta)).toBe("{\"creator\":\"team4\"}");

    // write an additional meta to the playlist
    await writePlaylistMeta('New Playlist', 'created',"2022-11-11");
    playlist_Meta = await getPlaylistMeta('New Playlist');
    expect(JSON.stringify(playlist_Meta)).toBe("{\"creator\":\"team4\",\"created\":\"2022-11-11\"}");

    // delete one metadata from the playlist
    await removePlaylistMeta('New Playlist', 'creator');
    playlist_Meta = await getPlaylistMeta('New Playlist');
    expect(JSON.stringify(playlist_Meta)).toBe("{\"created\":\"2022-11-11\"}");

    // delete a non-existing metadata from the playlist
    await removePlaylistMeta('New Playlist', 'artist');
    playlist_Meta = await getPlaylistMeta('New Playlist');
    expect(JSON.stringify(playlist_Meta)).toBe("{\"created\":\"2022-11-11\"}");

    // delete the rest metadata from the playlist
    await removePlaylistMeta('New Playlist', 'created');
    playlist_Meta = await getPlaylistMeta('New Playlist');
    expect(JSON.stringify(playlist_Meta)).toBe("{}");
});


/**
 * Close the app after the all the tests ends
 */
test.afterAll(async () =>{
    // Empty the all the files in testing playlist
    const playlistPath = path.join(await getStoragePath(), 'playlists');
    for (const file of await fsPromises.readdir(playlistPath)) {
        const path_songs = path.join(playlistPath, file);
        console.log('songs:', path_songs);
        await fsPromises.unlink(path_songs);
    }
});


