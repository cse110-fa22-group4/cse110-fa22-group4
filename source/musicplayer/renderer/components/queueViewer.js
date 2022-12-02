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
            <div class="${i == currPlayingTrackIndex ? 'queue-track queue-track-active' : 'queue-track'}" 
            data-queueIndex="${i}">
                <div class="queue-track-icon">
                    <img src="../img/icons/playback/currPlaying.png" class="${i == currPlayingTrackIndex ? 'icon-currPlaying icon-currPlaying-active' : 'icon-currPlaying'}">
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
    const newTrackIndex = element.getAttribute('data-queueIndex')
    currPlayingTrackIndex = newTrackIndex;

    // refresh queue viewer if already open
    if(queueViewerIsExtended) {
        await toggleQueueViewer();
        await toggleQueueViewer();
    }
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

    // refresh queue viewer if already open
    if(queueViewerIsExtended) {
        await toggleQueueViewer();
        await toggleQueueViewer();
    }
}
