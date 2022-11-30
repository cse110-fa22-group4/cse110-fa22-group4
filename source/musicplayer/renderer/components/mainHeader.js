/* GLOBAL VARS */
let metaEditorIsExtended = false; // to toggle meta editor
let playlistManagerIsExtended = false; // to toggle playlist manager
let currFileList; // Get file from user

window.addEventListener('mainHeader-loaded', async () => {
	await domAPI.setStyle('editor-container', 'display', 'none');
	await domAPI.addEventListener('btn-addQueue', 'click', addToQueue);
	await domAPI.addEventListener('btn-playlist', 'click', managePlaylistData);
	await domAPI.addEventListener('btn-meta', 'click', editMetaData);
});

/**
 * Toggles the metadata editor off.
 */
async function playlistManagerOff() {
	await domAPI.setStyle('editor-container', 'display', 'none');
}

/**
 * Toggles the metadata editor on.
 */
async function playlistManagerOn() {
	await domAPI.setStyle('editor-container', 'display', 'block');
}

/**
 * Add track to queue for user
 * @param {HTMLElement} element
 */
async function addToQueue(element) {
	// the currently selected tracks
	// TODO: add selected tracks to queue somehow
	const selectedTracks = await domAPI.getSelectedTracks();

	if (selectedTracks.length == 0) {
		alert('Select tracks to add to queue!');
	} else {
		console.log(selectedTracks);
		alert('check console.log for selected tracks');
	}
}

/**
 * Manage Playlists for user
 * @param {HTMLElement} element
 */
async function managePlaylistData(element) {
	if (!playlistManagerIsExtended && !metaEditorIsExtended) {
		await domAPI.loadPage('editor-container', 'components/playlistManager.html');
		await playlistManagerOn();
		await domAPI.setAttribute('editor-container', 'data-editortype', 'playlists');
		playlistManagerIsExtended = true;
		metaEditorIsExtended = false;
		// libraryClick();
	} else if (playlistManagerIsExtended && !metaEditorIsExtended) {
		await playlistManagerOff();
		await domAPI.setAttribute('editor-container', 'data-editortype', '');
		playlistManagerIsExtended = false;
		metaEditorIsExtended = false;
		// if (currentPage.library) {
		//     libraryClick();
		// }
	} else if (!playlistManagerIsExtended && metaEditorIsExtended) {
		await domAPI.loadPage('editor-container', 'components/playlistManager.html');
		await domAPI.setAttribute('editor-container', 'data-editortype', 'playlists');
		playlistManagerIsExtended = true;
		metaEditorIsExtended = false;
		// libraryClick();
	}
}

/**
 * Edit Metadata for user
 * @param {HTMLElement} element
 */
async function editMetaData(element) {
	if (!metaEditorIsExtended && !playlistManagerIsExtended) {
		await domAPI.loadPage('editor-container', 'components/metaEditor.html');
		await domAPI.setAttribute('editor-container', 'data-editortype', 'metadata');
		await playlistManagerOn();
		metaEditorIsExtended = true;
		playlistManagerIsExtended = false;
		// libraryClick();
	} else if (metaEditorIsExtended && !playlistManagerIsExtended) {
		await playlistManagerOff();
		await domAPI.setAttribute('editor-container', 'data-editortype', '');
		metaEditorIsExtended = false;
		playlistManagerIsExtended = false;
		// if (currentPage.library) {
		//     libraryClick();
		// }
	} else if (!metaEditorIsExtended && playlistManagerIsExtended) {
		await domAPI.loadPage('editor-container', 'components/metaEditor.html');
		await domAPI.setAttribute('editor-container', 'data-editortype', 'metadata');
		metaEditorIsExtended = true;
		playlistManagerIsExtended = false;
		// libraryClick();
	}
}


/**
 * Add track to playlist for user
 * @param {HTMLElement} element
 */
async function addToPlaylist(element) {
	alert('*FUNCTION UNDER CONTRUCTION*');
}
