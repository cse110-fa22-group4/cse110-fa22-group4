window.addEventListener('gridExtendedButtons-loaded', async () => {
	await domAPI.addEventListener('btn-playlist-playAll', 'click', sendQueuePlaylist);
});

/**
 * @name sendQueuePlaylist 
 * @description Sends playlist to queue
 * @return {Promise<void>}
 */
 async function sendQueuePlaylist() {
	// get the playlist tracks
    const currPlaylist = await fsAPI.getPlaylist(currGridPlaylist);
	const playlistTracks = currPlaylist.trackList;
	if (playlistTracks.length == 0) {
		alert('Select tracks to add to queue!');
        return;
	}

    // clear queue
    await clearQueue();

    if(shuffleOn) {
        // shuffle items before inserting into queue
        // shuffle method takes each song, swaps with random index
        for(let i = playlistTracks.length - 1; i >= 0; i--) {
            
            // find index to swap with
            let indexToSwap = Math.floor(Math.random()*playlistTracks.length);

            // swap elements
            let tempSong = playlistTracks[i];
            playlistTracks[i] = playlistTracks[indexToSwap];
            playlistTracks[indexToSwap] = tempSong;
        }
    }
    

    // send tracks to playback queue
    for (let i = 0; i < playlistTracks.length; i++) {
		// playback integration edit
		if (queueArr.length == 0) {
			initFirstSong(playlistTracks);
			initProgress(playlistTracks);
			initInfo(playlistTracks);
		}

        queueArr.push(playlistTracks[i]);
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
    await giveUserFeedback(`Now playing ${currGridPlaylist}`)

    console.log(playlistTracks);

    // TODO: play immediately after tracks are added
}