let libraryGrid = undefined; // gridJS library instance

window.addEventListener('library-loaded', async () => {
	await onLibraryLoad();
});

window.addEventListener('library-container-grid-clicked', async (args) => {
	console.log(args['detail']);
	console.log(libraryGrid);
});

/**
 * Generate Artist Library View.
 */
async function onLibraryLoad() {
  const libraryGrid = await domAPI.addGrid('library-container', libraryHeaders, libraryCatalog, gridSettings);
}