let libraryGrid = undefined; // gridJS library instance

window.addEventListener('library-loaded', async () => {
	await onLibraryLoad();
});

window.addEventListener('library-container-grid-clicked', async (args) => {
	console.log(args['detail']);
	console.log(libraryGrid);
});


/**
 * Function that is called on library load.
 */
async function onLibraryLoad() {

	// GridJS - USAGE EXAMPLE

  // Set grid headers - Sample Headers from sampleLibrary.js
  const columns = libraryHeaders;

  // Set grid rows - Sample data from sampleLibrary.js
  const data = libraryCatalog

  // Set grid settings
	const gridSettings = {
		sort: true,
    // resizable: true,   - doesn't seem to work
    // fixedHeader: true, - doesn't seem to work
    // autoWidth: true,   - doesn't seem to work
		search: {
			enabled: true,
			ignoreHiddenColumns: false,
			selector: (cell, rowIndex, cellIndex) => {
				if (cellIndex === 1) console.log(cell);
				return cell;
			},
			keyword: '',
		},
	};

	libraryGrid = await domAPI.addGrid('library-container', columns, data, gridSettings);
}