const libraryGrid = undefined; // gridJS library instance

window.addEventListener('library-loaded', async () => {
	await onLibraryLoad();
});

window.addEventListener('library-container-grid-clicked', async (args) => {
	console.log(args['detail']);
	console.log(libraryGrid);
});

/**
 * Initial Library Load.
 */
async function onLibraryLoad() {
    await domAPI.setHTML('library-container', '');
    const tracksList = await fsAPI.getSongsTrackData();
	const libraryGrid = await domAPI.addGrid('library-container', libraryHeaders, tracksList, gridSettings);
}
