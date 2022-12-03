/* GLOBAL VARS */
let metaEditorIsExtended = false; // helper to track meta editor
let playlistManagerIsExtended = false; // helper to track playlist manager
let queueViewerIsExtended = false; // helper to track queue viewer
let editorIsOn = false; // helper to track editor

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
		// playback integration edit
		if (queueArr.length == 0) {
			initFirstSong(selectedTracks);
			initProgress(selectedTracks);
			initInfo(selectedTracks);
		}

        queueArr.push(selectedTracks[i]);
		// playback integration edit
		prevSongsArr.push(selectedTracks[i]);
    }

	


    // refresh queue viewer if already open
    if(queueViewerIsExtended) {
	    await toggleQueueViewer();
	    await toggleQueueViewer();
    }

    // reset selection
    if(await getCurrentPage() == 'library') {
        await libraryClick();
    }
    if(playlistManagerIsExtended) {
        await removePlaylistSelection();
    }

    // send user feedback
    await giveUserFeedback('Added to Queue')

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
        // reset selection
        if(await getCurrentPage() == 'library') {
            await libraryClick();
        }
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
    // turn off overview extension if on
	await topExtensionOff();

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


/**
 * @name initFirstSong 
 * @description set the inital song as soon as it is added to Queue
 * @param selectedTracks array holding track objects to be pushed
 */
function initFirstSong(selectedTracks) {
	// store first song in history on load
	prevSongsIndxArr.push(songNum);
	currSongPath = selectedTracks[0]['filename'];
}

/**
 * @description set the inital values of the progress bar for  song
 * @param selectedTracks array holding track objects to be pushed
 */
function initProgress(selectedTracks) {
	startStamp = document.querySelector('.timestamps:nth-of-type(1)');
	endStamp = document.querySelector('.timestamps:nth-of-type(2)');
	progressFader = document.querySelector('#progressBar');
	const currSongDuration = selectedTracks[0]['duration'];

	endStamp.innerHTML = msToFormatStr(currSongDuration * 1000);
	startStamp.innerHTML = '0:00';
	progressFader.value = '0';
	msElapsed = 0;
}

/**
 * @description set the inital info when first song is selected
 * @param selectedTracks array holding track objects to be pushed 
 */
function initInfo(selectedTracks) {
	const currTitle = selectedTracks[0]['title'];
	const currArtist = selectedTracks[0]['artist'];
	let currArt = '';
	if ( typeof selectedTracks[0]['artwork'] === 'undefined') {
		currArt = '../img/artwork-default.png';
	} else {
		currArt = selectedTracks[0]['artwork'];
	}

	document.querySelector('.songInfo > b').innerHTML = currTitle;
	document.querySelector('.songInfo > p').innerHTML = currArtist;
	document.querySelector('#playbackArt').style.visibility = 'visible';
	document.querySelector('#playbackArt').src = currArt;
}