window.addEventListener('library-loaded', async () => {
	await onLibraryLoad();
});

window.addEventListener('library-container-row-clicked', async (args) => {
    // NOTE: click a row seems way too sensitive for practical use,
    // will probably not end up using
	// console.log(args['detail']);
});

window.addEventListener('library-container-queue-clicked', async (args) => {
    const trackObj = args['detail']; 
	console.log(trackObj);

    // send track to playback queue
    queueArr.push(trackObj);
});


/**
 * @name onLibraryLoad
 * @description Initial load of library page, loads grid view of song library.
 * @return {Promise<void>}
 */
async function onLibraryLoad() {
	await domAPI.setHTML('library-container', '');
	const trackList = await fsAPI.getSongsTrackData();
	await domAPI.addGrid('library-container', libraryHeaders, trackList, gridSettings);
}
