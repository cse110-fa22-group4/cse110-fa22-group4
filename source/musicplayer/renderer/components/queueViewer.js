window.addEventListener('queueViewer-loaded', async () => {
    await queueViewerLoad();
    await domAPI.addEventListenerbyClassName('queue-track', 'dblclick', playTrack);
    await domAPI.addEventListenerbyClassName('btn-queue-track-delete', 'click', deleteTrackFromQueue);
    await domAPI.addEventListener('btn-queue-clear', 'click', clearQueue);
});

/**
 * @name queueViewerLoad
 * @description Initial load of queue viewer, build the queue.
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
async function queueViewerLoad(element) {
    if (queueArr.length == 0) {
        const emptyQueueMessage = `
            <div id="queue-empty-message">Your queue is currently empty. Add songs from the library to begin playback!</div>
        `;
        await domAPI.setHTML('queue-container', emptyQueueMessage);
        return;
    }

    let queueList = '';
    for (let i = 0; i < queueArr.length; i++) {
        const queueRow = `
                <div class="${i == 0 ? 'queue-track queue-track-active' : 'queue-track'}" 
                data-queueIndex="${i}">
                    <div class="queue-track-icon">
                        <img src="../img/icons/playback/currPlaying.png" class="
                        ${i == 0 ? 'icon-currPlaying icon-currPlaying-active' : 'icon-currPlaying'}">
                    </div>
                    <div class="queue-track-data">
                        <div class="queue-track-data-title">${queueArr[i].title}</div>
                        <div class="queue-track-data-artist-album">${queueArr[i].artist} - ${queueArr[i].album}</div>
                    </div>
                    <div class="queue-track-duration">
                        ${new Date(1000 * queueArr[i].duration).toISOString().substr(11, 8).replace(/^[0:]+/, '')}
                        </div>
                    <div class="queue-track-delete">
                        <button class="btn-queue-track-delete" data-queueIndex="${i}">
                            <img src="../img/icons/playback/delete.png" class="icon-currPlaying-delete">
                        </button>
                    </div>
                </div>
            `;
        queueList += queueRow;
    }

    // insert queue list into container
    await domAPI.setHTML('queue-container', queueList);
}

/**
 * @name playTrack
 * @description Play track in current queue.
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
async function playTrack(element) {
    // get index of track to jump tp
    let newTrackIndex = element.getAttribute('data-queueIndex')

    // jump to song and play
    await jumpSong(newTrackIndex);

    // refresh queue viewer
    await refreshQueueViewer();

    // TODO: not sure what else needs to be updated for playback ???
    // may not end up using this feature, not that important to have
}

/**
 * @name deleteTrackFromQueue
 * @description Delete track from current queue.
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
async function deleteTrackFromQueue(element) {
    // get index of track to delete
    const deleteTrackIndex = element.getAttribute('data-queueIndex')

    if (deleteTrackIndex == 0) {

        // basically just nextSong but we make sure to delete the item even if loop is on
        if(queueArr.length != 1) {
            await nextSong();
        }
        else {
            prevSongsArr.splice(0, 0, queueArr[0]);
            queueArr.splice(0, 1);

            if (toggleOn) {
                // do not add to end of queue
            } else {
                currSongPath = null;

                //pause song
                const playB = document.querySelector('.playbackBtn:nth-of-type(3)');
                const playBImg = playB.querySelector('img');
                if (playB.id !== 'play-btn') {
                    await ffmpegAPI.pauseSong();
                    isPaused = true;

                    toggleIcon(playB, playBImg);
                }
            }

            clearInterval(intervalID);
            resetProgress();

            await refreshQueueViewer();
        }



    }
    else {
        // remove track from the queue
        queueArr.splice(deleteTrackIndex, 1);
    }



    // refresh queue viewer
    await refreshQueueViewer();

    // TODO: not sure what else needs to be updated for playback ???
}

/**
 * @name clearQueue
 * @description Clear the current queue.
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
async function clearQueue(element) {
    if (queueArr.length == 0) {
        return;
    }

    // remove all tracks from the queue
    queueArr.splice(0, queueArr.length);
    debugger

    currSongPath = null;

    //pause song
    const playB = document.querySelector('.playbackBtn:nth-of-type(3)');
    const playBImg = playB.querySelector('img');
    if (playB.id !== 'play-btn') {
        await ffmpegAPI.pauseSong();
        isPaused = true;
        toggleIcon(playB, playBImg);
    }
    clearInterval(intervalID);
    resetProgress();


    // refresh queue viewer

    await refreshQueueViewer();
    // TODO: not sure what else needs to be updated for playback ???
    // maybe reset state of playback queue from before the queue was populated
}

/**
 * @name refreshQueueViewer
 * @description Refresh the state of the queue viewer.
 * @return {Promise<void>}
 */
async function refreshQueueViewer() {
    // refresh queue viewer if already open
    if (queueViewerIsExtended) {
        await toggleQueueViewer();
        await toggleQueueViewer();
    }
}
