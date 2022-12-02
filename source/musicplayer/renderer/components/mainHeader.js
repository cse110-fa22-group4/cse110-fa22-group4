/* GLOBAL VARS */
let metaEditorIsExtended = false; // helper to track meta editor
let playlistManagerIsExtended = false; // helper to track playlist manager
let queueViewerIsExtended = false; // helper to track queue viewer
let currFileList; // Get file from user
let editorIsOn = false; // helper to track if editor

window.addEventListener('mainHeader-loaded', async () => {
	await domAPI.setStyle('editor-container', 'display', 'none');
	await domAPI.addEventListener('btn-addQueue', 'click', addToQueue);
	await domAPI.addEventListener('btn-playlist', 'click', togglePlaylistManager);
	await domAPI.addEventListener('btn-meta', 'click', toggleMetaEditor);
});

window.addEventListener('playback-loaded', async () => {
	await domAPI.addEventListener('playbackArt', 'click', toggleQueueViewer);
	await domAPI.addEventListener('playlists-bottom-btn', 'click', toggleQueueViewer);
});

/**
 * @name editorOff
 * @description Toggles the editor off.
 * @return {Promise<void>}
 */
async function editorOff() {
    if(editorIsOn) {
        await domAPI.setStyle('editor-container', 'display', 'none');
        editorIsOn = false;
    }
}

/**
 * @name editorOn
 * @description Toggles the editor on.
 * @return {Promise<void>}
 */
async function editorOn() {
    if(!editorIsOn) {
        await domAPI.setStyle('editor-container', 'display', 'block');
        editorIsOn = true;
    }
}

/**
 * @name addToQueue
 * @description Add selected tracks to queue.
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
async function addToQueue(element) {
	// get the selected tracks
	const selectedTracks = await domAPI.getSelectedTracks();
	if (selectedTracks.length == 0) {
		alert('Select tracks to add to queue!');
        return;
	}

    // send tracks to playback queue
    for (let i = 0; i < selectedTracks.length; i++) {
        queueArr.push(selectedTracks[i]);
    }

    console.log(selectedTracks);
}

/**
 * @name togglePlaylistManager
 * @description Toggles playlist manager view.
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
async function togglePlaylistManager(element) {
    if(!playlistManagerIsExtended) {
        // toggle on
		await domAPI.loadPage('editor-container', 'components/playlistManager.html');
		await domAPI.setAttribute('editor-container', 'data-editortype', 'playlists');
		await editorOn();
        
		playlistManagerIsExtended = true;
        metaEditorIsExtended = false;
		queueViewerIsExtended = false;
    } else {
        // toggle off
		await domAPI.setAttribute('editor-container', 'data-editortype', '');
		await editorOff();
        
		playlistManagerIsExtended = false;
        metaEditorIsExtended = false;
		queueViewerIsExtended = false;
    }
}

/**
 * @name toggleMetaEditor
 * @description Toggles meta editor view.
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
async function toggleMetaEditor(element) {
    if(!metaEditorIsExtended) {
        // toggle on
		await domAPI.loadPage('editor-container', 'components/metaEditor.html');
		await domAPI.setAttribute('editor-container', 'data-editortype', 'metadata');
		await editorOn();
        
		playlistManagerIsExtended = false;
        metaEditorIsExtended = true;
		queueViewerIsExtended = false;
    } else {
        // toggle off
		await domAPI.setAttribute('editor-container', 'data-editortype', '');
		await editorOff();
        
		playlistManagerIsExtended = false;
		queueViewerIsExtended = false;
        metaEditorIsExtended = false;
    }
}

/**
 * @name toggleQueueViewer
 * @description Toggles queue viewer view.
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
 async function toggleQueueViewer(element) {
    if(!queueViewerIsExtended) {
        // toggle on
		await domAPI.loadPage('editor-container', 'components/queueViewer.html');
		await domAPI.setAttribute('editor-container', 'data-editortype', 'queue');
		await editorOn();
        
		playlistManagerIsExtended = false;
        metaEditorIsExtended = false;
		queueViewerIsExtended = true;
    } else {
        // toggle off
		await domAPI.setAttribute('editor-container', 'data-editortype', '');
		await editorOff();

		playlistManagerIsExtended = false;
        metaEditorIsExtended = false;
		queueViewerIsExtended = false;
    }
}