/* GLOBAL VARS */
let metaEditorIsExtended = false; // to toggle metadat editor view
let currFileList; // Get file from user

window.addEventListener('mainHeader-loaded', async () => {
  await domAPI.setStyle('metaEditor-container', 'display', 'none');
	await domAPI.addEventListener('btn-file', 'change', getFile);
	await domAPI.addEventListener('btn-playlist-create', 'click', createPlaylist);
	await domAPI.addEventListener('btn-playlist-add', 'click', addToPlaylist);
	await domAPI.addEventListener('btn-meta', 'click', editMetaData);
});

/**
 * Create playlist for user
 * @param {HTMLElement} element
 */
function createPlaylist(element) {
	alert('*FUNCTION UNDER CONTRUCTION*');
}

/**
 * Add track to playlist for user
 * @param {HTMLElement} element
 */
function addToPlaylist(element) {
	alert('*FUNCTION UNDER CONTRUCTION*');
}

/**
 * Edit Metadata for user
 * @param {HTMLElement} element
 */
 async function editMetaData(element) {
  if(!metaEditorIsExtended) {
    await domAPI.loadPage('metaEditor-container', 'components/metaEditor.html');
    await metaEditorOn();
  } else {
    await metaEditorOff();
  }
}

/**
 * Toggles the metadata editor off.
 */
 async function metaEditorOff() {
	if (metaEditorIsExtended) {
		await domAPI.setStyle('metaEditor-container', 'display', 'none');
		metaEditorIsExtended = false;
	}
}

/**
 * Toggles the metadata editor on.
 */
async function metaEditorOn() {
	if (!metaEditorIsExtended) {
		await domAPI.setStyle('metaEditor-container', 'display', 'block');
		metaEditorIsExtended = true;
	}
}


/**
 * Calllback function for when a file is passed into the input.
 * @param {Event} element
 */
async function getFile(element) {
	currFileList = element.target.files;
	await genAPI.debugLog(currFileList, 'main-header-callbacks');
}

