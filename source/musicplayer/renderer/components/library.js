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
    let tracksList = await fsAPI.getSongsTrackData();
    console.log(tracksList);
	const libraryGrid = await domAPI.addGrid('library-container', libraryHeaders, tracksList, gridSettings, 'playlists');
}
