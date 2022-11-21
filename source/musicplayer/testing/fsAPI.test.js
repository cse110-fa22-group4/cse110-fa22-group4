// fsAPI.test.js

const functions_playlist = require('../preload/fs/playlists/playlistAPICalls');

/**
 * Check initial getAllPlaylists() stage (without any playlist inside)
 */
test('Check getAllPlaylists() Initial Stage', ()=>{
    // get test the initial stage of getAllPlaylists()
    const str_playlist = JSON.stringify(functions_playlist.getAllPlaylists());
    // Should be returning an empty object(map)
    expect(str_playlist).toBe('{}');
});