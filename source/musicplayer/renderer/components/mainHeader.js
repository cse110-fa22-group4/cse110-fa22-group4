/* GLOBAL VARS */
let metaEditorIsExtended = false; // to toggle meta editor
let playlistManagerIsExtended = false; // to toggle playlist manager
let currFileList; // Get file from user

window.addEventListener('mainHeader-loaded', async () => {
    await domAPI.setStyle('editor-container', 'display', 'none');
    await domAPI.addEventListener('btn-addQueue', 'click', addToQueue);
    await domAPI.addEventListener('btn-playlist', 'click', managePlaylistData);
    await domAPI.addEventListener('btn-meta', 'click', editMetaData);
    await domAPI.addEventListener('btn-file', 'change', getFile);
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
	alert('*FUNCTION UNDER CONTRUCTION*');
}

/**
 * Manage Playlists for user
 * @param {HTMLElement} element
 */
async function managePlaylistData(element) {
    if (!playlistManagerIsExtended && !metaEditorIsExtended) {
        await domAPI.loadPage('editor-container', 'components/playlistManager.html');
        await playlistManagerOn();
        playlistManagerIsExtended = true;
        metaEditorIsExtended = false;
        libraryClick();
    } else if (playlistManagerIsExtended && !metaEditorIsExtended) {
        await playlistManagerOff();
        playlistManagerIsExtended = false;
        metaEditorIsExtended = false;
        if (currentPage.library) {
            libraryClick();
        }
    } else if (!playlistManagerIsExtended && metaEditorIsExtended) {
        await domAPI.loadPage('editor-container', 'components/playlistManager.html');
        playlistManagerIsExtended = true;
        metaEditorIsExtended = false;
        libraryClick();
    }
}

/**
 * Edit Metadata for user
 * @param {HTMLElement} element
 */
async function editMetaData(element) {
    if (!metaEditorIsExtended && !playlistManagerIsExtended) {
        await domAPI.loadPage('editor-container', 'components/metaEditor.html');
        await playlistManagerOn();
        metaEditorIsExtended = true;
        playlistManagerIsExtended = false;
        libraryClick();
    } else if (metaEditorIsExtended && !playlistManagerIsExtended) {
        await playlistManagerOff();
        metaEditorIsExtended = false;
        playlistManagerIsExtended = false;
        if (currentPage.library) {
            libraryClick();
        }
    } else if (!metaEditorIsExtended && playlistManagerIsExtended) {
        await domAPI.loadPage('editor-container', 'components/metaEditor.html');
        metaEditorIsExtended = true;
        playlistManagerIsExtended = false;
        libraryClick();
    }
}


/**
 * Add track to playlist for user
 * @param {HTMLElement} element
 */
async function addToPlaylist(element) {
	alert('*FUNCTION UNDER CONTRUCTION*');
}


/**
 * Calllback function for when a file is passed into the input.
 * @param {Event} element
 */
async function getFile(element) {
	currFileList = element.target.files;
	await genAPI.debugLog(currFileList, 'main-header-callbacks');
}