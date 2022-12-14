window.addEventListener('searchbar-loaded', async () => {
	// await domAPI.addEventListener('search-form', 'submit', submitSearch);
});

/**
 * @name submitSearch
 * @description Handles search.
 * @return {Promise<void>}
 */
async function submitSearch(element) {
    
    // temporary: TEMP old version implementation, is bugged atm
    event.preventDefault();

	// Set global var for search query input
	/**
   * We literally await a Promise<Object>, idk why I have to specify this.
   * @type {Object}
   */
	const searchQuery = await domAPI.getProperty('input-search', 'value');
	searchQueryGlobal = searchQuery;
	if (searchQuery === undefined) return;

	if (searchQuery.length !== 0) {

		// await domAPI.setHTML('header-title', `Results for: '${searchQuery}'`);
		await domAPI.setProperty('input-search', 'value', '');
        await libraryClick();

		// Switch to search results page
		// await domAPI.setHTML('header-title', 'Search');
		// await domAPI.loadPage('header-subtitle', 'components/searchCategories.html');
		// await resetSubtitleButtons();
		// await domAPI.setStyleClassToggle('subtitle-search-all', 'subtitle-search-active', true);
		// await domAPI.loadPage('main-container', 'pages/searchPage.html');
		// await resetSidebarButtons();
		// await domAPI.setStyleClassToggle('sidebar-btn-container-library', 'sidebar-btn-active', true);
		// await topExtensionOff();
		// window.dispatchEvent(new CustomEvent('searchbarSearch', {detail: searchQuery}));
	}

	// TODO: Use search query value for searching our app's library
}
