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
	await domAPI.addEventListener('btn-playlist-special', 'click', doSomethingSpecial);
});

/**
 * @name updatePlaylistOptions
 * @description Update menu options for playlists drop-down.
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
async function updatePlaylistOptions(element) {
	let playlistMenuOptions = '<option value="" selected disabled>Select a playlist...</option>';
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
 * @name createUserPlaylist
 * @description Create a playlist.
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
async function createUserPlaylist(element) {
	// get custom playlist name
	const playlistName = await domAPI.getProperty('input-playlist-create', 'value');

	if (playlistName.length !== 0) {
		await domAPI.setProperty('input-playlist-create', 'value', '');

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
 * @name addToPlaylist
 * @description Add selected tracks to a playlist.
 * @param {HTMLElement} element
 * @return {Promise<void>}
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

    for (let i = 0; i < tracks.length; i++) {
        const tags = {};
        for (const [key, value] of Object.entries(tracks[i])) {
            if(value.length != 0) {
                tags[key] = value;
            }
        }
        await fsAPI.writeToPlaylist(currPlaylist, tags);
    }
    
	alert('Tracks added to playlist!');
}

/**
 * @name removePlaylistSelection
 * @description Remove selected tracks from preview window.
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
async function removePlaylistSelection(element) {
	await domAPI.setHTML('selected-playlists-container', '');

    // reset selection
    if(await getCurrentPage() == 'library') {
    	libraryClick();
    }
}

/**
 * @name deletePlaylist
 * @description Delete selected playlist.
 * @param {HTMLElement} element
 * @return {Promise<void>}
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

/**
 * @name doSomethingSpecial
 * @description Pending function for playlist manager.
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
 async function doSomethingSpecial(element) {
    // TODO: do something else remove later
}
