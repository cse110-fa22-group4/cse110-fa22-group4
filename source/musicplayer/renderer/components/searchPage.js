window.addEventListener('searchPage-loaded', async () => {
	await onSearchPageLoad();
});

let searchGrid = undefined;

/**
 * Function that is called on SearchPage load.
 */
async function onSearchPageLoad() {
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
      keyword: `${searchQueryGlobal}`,
		},
	};

	searchGrid = await domAPI.addGrid('search-results-container', columns, data, gridSettings);
}
