window.addEventListener('queueViewer-loaded', async () => {
	await queueViewerLoad();
	await domAPI.addEventListenerbyClassName('queue-track', 'dblclick', playTrack);
	await domAPI.addEventListenerbyClassName('btn-queue-track-delete', 'click', deleteTrackFromQueue);
});

/**
 * @name queueViewerLoad
 * @description Initial load of queue viewer, build the queue.
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
 async function queueViewerLoad(element) {
    let queueList = '';

    for (let i = 0; i < queueArr.length; i++) {
            const queueRow = `
            <div class="${i == songNum ? 'queue-track queue-track-active' : 'queue-track'}" 
            data-queueIndex="${i}">
                <div class="queue-track-icon">
                    <img src="../img/icons/playback/currPlaying.png" class="${i == songNum ? 'icon-currPlaying icon-currPlaying-active' : 'icon-currPlaying'}">
                </div>
                <div class="queue-track-data">
                    <div class="queue-track-data-title">${queueArr[i].title}</div>
                    <div class="queue-track-data-artist-album">${queueArr[i].artist} - ${queueArr[i].album}</div>
                </div>
                <div class="queue-track-duration">
                    ${new Date(1000 * queueArr[i].duration).toISOString().substr(11, 8).replace(/^[0:]+/, '')}
                    </div>
                <div class="queue-track-delete">
                    <button class="btn-queue-track-delete" data-queueIndex="${i}">X</button>
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
 * @description Play track.
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
 async function playTrack(element) {
    let newTrackIndex = element.getAttribute('data-queueIndex')

    // jump to song
    await jumpSong(newTrackIndex);

    await refreshQueueViewer();
}

/**
 * @name deleteTrackFromQueue
 * @description Delete track from queue.
 * @param {HTMLElement} element
 * @return {Promise<void>}
 */
 async function deleteTrackFromQueue(element) {
    const deleteTrackIndex = element.getAttribute('data-queueIndex')
    queueArr.splice(deleteTrackIndex, 1);

	songNum--;

    await refreshQueueViewer();
}

/**
 * @name refreshQueueViewer
 * @description Refresh the state of the queue viewer.
 * @return {Promise<void>}
 */
 async function refreshQueueViewer() {
    // refresh queue viewer if already open
    if(queueViewerIsExtended) {
        await toggleQueueViewer();
        await toggleQueueViewer();
    }
}
