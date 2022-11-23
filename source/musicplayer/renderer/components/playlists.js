const playlistManagerSelected = []; // holds track objects currently added to the playlist manager
const libraryPlaylists = new Map(); // playlists that can be auto-generated from the library
const userPlaylists = new Map(); // additional custom user playlists
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

window.addEventListener('DOMContentLoaded', async () => {
	await rescanLibraryPlaylists();
});

window.addEventListener('playlistManager-loaded', async () => {
	await populatePlaylistAddMenu();
	await domAPI.addEventListener('btn-playlist-create', 'click', createUserPlaylist);
	await domAPI.addEventListener('input-playlist-create', 'change', createUserPlaylist);
	await domAPI.addEventListener('btn-playlist-add', 'click', addToPlaylist);
	await domAPI.addEventListener('btn-playlist-remove-selection', 'click', removePlaylistSelection);
	await domAPI.addEventListener('btn-playlist-delete', 'click', deletePlaylist);
});

/**
 * Auto generate playlists based on the current track data in library.
 */
async function rescanLibraryPlaylists() {
	for (let i = 0; i < libraryCatalog.length; i++) {
		const currTrack = libraryCatalog[i];
		const playlistArr = libraryCatalog[i].playlists.split(', ');
		for (let j = 0; j < playlistArr.length; j++) {
			const currPlaylist = playlistArr[j];
			if (libraryPlaylists.has(currPlaylist)) {
				libraryPlaylists.get(currPlaylist).artists.add(currTrack.artist);
				libraryPlaylists.get(currPlaylist).numTracks++;
				if (!libraryPlaylists.get(currPlaylist).artworks.includes(currTrack.artwork)) {
					libraryPlaylists.get(currPlaylist).artworks.push(currTrack.artwork);
				}
				libraryPlaylists.get(currPlaylist).trackList.push(currTrack);
			} else {
				libraryPlaylists.set(currPlaylist, {
					name: currPlaylist,
					artists: new Set().add(currTrack.artist),
					numTracks: 1,
					artworks: [currTrack.artwork],
					trackList: [currTrack],
				});
			}
		}
	}
}

/**
 * Populate menu options for add to playlist button.
 */
async function populatePlaylistAddMenu() {
	// Add playlists to menu button
	let playlistMenuOptions = '<option value="" selected disabled>Choose a playlist...</option>';
	for (const [key, value] of libraryPlaylists) {
		const option = `<option id="playlist-option-${key}" value="${key}">${key}</option>`;
		playlistMenuOptions += option;
	}
	for (const [key, value] of userPlaylists) {
		const option = `<option id="playlist-option-${key}" value="${key}">${key}</option>`;
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
		userPlaylists.set(playlistName, {
			name: playlistName,
			artists: new Set(),
			numTracks: 0,
			artworks: ['../img/artwork-default.png'],
			trackList: [],
		});

		// add custom playlist to menu option
		const option =
            `<option id="playlist-option-${playlistName}" value="${playlistName}" selected>${playlistName}</option>`;
		await domAPI.appendHTML('select-playlist-add', option);
		alert(`'${playlistName}' added. Navigate to your library to begin adding tracks to your playlist!`);
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
	if (currPlaylist == '') {
		alert('Select a playlist to begin adding!');
		return;
	}

	const tracks = await domAPI.getSelectedTracks();
	if (tracks.length == 0) {
		alert('Select tracks to begin adding!');
		return;
	}

	// add playlist to track playlists key + update library
	for (let i = 0; i < tracks.length; i++) {
		for (let j = 0; j < libraryCatalog.length; j++) {
			debugger;
			if (tracks[i].path == libraryCatalog[j].path) {
				tracks[i].playlists += `, ${currPlaylist}`;
				libraryCatalog[j].playlists += `, ${currPlaylist}`;
			}
		}
	}

	// add tracks to custom playlists
	for (let i = 0; i < tracks.length; i++) {
		if (userPlaylists.has(currPlaylist)) {
			userPlaylists.get(currPlaylist).artists.add(tracks[i].artist);
			userPlaylists.get(currPlaylist).artworks.push(tracks[i].artwork);
			userPlaylists.get(currPlaylist).numTracks++;
			if (!userPlaylists.get(currPlaylist).artworks.includes(tracks[i].artwork)) {
				userPlaylists.get(currPlaylist).trackList.push(tracks[i]);
			}
		} else {
			libraryPlaylists.get(currPlaylist).artists.add(tracks[i].artist);
			libraryPlaylists.get(currPlaylist).artworks.push(tracks[i].artwork);
			libraryPlaylists.get(currPlaylist).numTracks++;
			if (!libraryPlaylists.get(currPlaylist).artworks.includes(tracks[i].artwork)) {
				libraryPlaylists.get(currPlaylist).trackList.push(tracks[i]);
			}
		}
	}

	alert('Tracks added to playlist!');
}

/**
 * Add track to playlist for user
 * @param {HTMLElement} element
 */
async function removePlaylistSelection(element) {
	await domAPI.setHTML('selected-playlists-container', '');
	libraryClick();
}

/**
 * Deleted selected playlist
 * @param {HTMLElement} element
 */
async function deletePlaylist(element) {
	alert('*FUNCTION UNDER CONTRUCTION*');
}
