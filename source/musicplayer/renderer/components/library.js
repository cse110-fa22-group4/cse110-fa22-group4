window.addEventListener('library-loaded', async () => {
	await onLibraryLoad();
});

window.addEventListener('library-container-row-clicked', async (args) => {
	console.log(args['detail']);
});

window.addEventListener('library-container-queue-clicked', async (args) => {
	console.log(args['detail']);
});


/**
 * Initial Library Load.
 */
async function onLibraryLoad() {
	await domAPI.setHTML('library-container', '');
	const trackList = await fsAPI.getSongsTrackData();
	await domAPI.addGrid('library-container', libraryHeaders, trackList, gridSettings);
}
