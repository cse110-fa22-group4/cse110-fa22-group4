const playlistManagerSelected = []; // holds track objects currently added to the playlist manager
let lastCreatedPlaylist; // the last selected playlist
// POSSIBLE PLAYLIST OBJECT STRUCTURE
// (
//   'playlist',
//   {
//     name: 'Summer Mix',
//     numTracks: 32,
//     artworks: ['..img.png', '..img2.png'],
//     trackList: [{track1},{track2},...]
//   }
// )

window.addEventListener('playlistManager-loaded', async () => {
	await updatePlaylistOptions();
	await domAPI.addEventListener('btn-playlist-create', 'click', createUserPlaylist);
	await domAPI.addEventListener('btn-playlist-add', 'click', addToPlaylist);
	await domAPI.addEventListener('btn-playlist-remove-selection', 'click', removePlaylistSelection);
	await domAPI.addEventListener('btn-playlist-delete', 'click', deletePlaylist);
});

/**
 * Update menu options for playlists drop-down.
 */
async function updatePlaylistOptions() {
	let playlistMenuOptions = '<option value="" selected disabled>Choose a playlist...</option>';
	const userPlaylists = await fsAPI.getAllPlaylists();
	for (let i = 0; i < userPlaylists.length; i++) {
		let option;
		if (userPlaylists[i] === lastCreatedPlaylist) {
			option = `<option id="playlist-option-${userPlaylists[i]}" value="${userPlaylists[i]}" selected>
                ${userPlaylists[i]}</option>`;
		} else {
			option = `<option id="playlist-option-${userPlaylists[i]}" value="${userPlaylists[i]}">
                ${userPlaylists[i]}</option>`;
		}
		playlistMenuOptions += option;
	}

	// Insert playlist options into container
	await domAPI.setHTML('select-playlist-add', playlistMenuOptions);
}

/**
 * Add custom user playlist.
 */
async function createUserPlaylist() {
	// get custom playlist name
	const playlistName = await domAPI.getProperty('input-playlist-create', 'value');

	if (playlistName.length !== 0) {
		await domAPI.setProperty('input-playlist-create', 'value', '');

		// create new playlist object
		// const currPlaylistObj = {
		//     name: playlistName,
		//     numTracks: 0,
		//     trackList: []
		// };

		await fsAPI.createPlaylist(playlistName);

		// add custom playlist to menu option
		lastCreatedPlaylist = playlistName;
		await updatePlaylistOptions();

		alert(`'${playlistName}' added`);
	} else {
		alert('Enter a name for the playlist!');
	}
}

/**
 * Add track to playlist for user
 * @param {HTMLElement} element
 */
async function addToPlaylist(element) {
	const currPlaylist = await domAPI.getProperty('select-playlist-add', 'value');
	if (currPlaylist === '') {
		alert('Select a playlist to begin adding!');
		return;
	}

	const tracks = await domAPI.getSelectedTracks();
	if (tracks.length === 0) {
		alert('Select tracks to begin adding!');
		return;
	}

	// TODO: add tracks to playlists
    // TODO: add tracks to playlists
    // currPlaylist = 'myPlaylist'
    // tracks = [{track1}, {track2}, ...]
    for (let i = 0; i < tracks.length; i++) {

        const tags = {};

        for (const [key, value] of Object.entries(tracks[i])) {
            tags[key] = value;
        }
        debugger
        await fsAPI.writeToPlaylist(currPlaylist, tags);
    }
    
	alert('Tracks added to playlist!');
}

/**
 * Add track to playlist for user
 * @param {HTMLElement} element
 */
async function removePlaylistSelection(element) {
	await domAPI.setHTML('selected-playlists-container', '');
	// libraryClick();
}

/**
 * Deleted selected playlist
 * @param {HTMLElement} element
 */
async function deletePlaylist(element) {
	const currPlaylist = await domAPI.getProperty('select-playlist-add', 'value');
	if (currPlaylist === '') {
		alert('Select a playlist to delete!');
		return;
	}

	await fsAPI.removePlaylist(currPlaylist);
	await updatePlaylistOptions();
	await updatePlaylistOptions();
}
