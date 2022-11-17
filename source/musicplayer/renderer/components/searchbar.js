window.addEventListener('searchbar-loaded', async () => {
  await domAPI.addEventListener('search-form', 'submit', submitSearch);
});

/**
 * Handles search
 * @param {HTMLElement} element
 */
async function submitSearch(element) {
  event.preventDefault();

  // Set global var for search query input
  /**
   * We literally await a Promise<Object>, idk why I have to specify this.
   * @type {Object}
   */
  const searchQuery = await domAPI.getValue('input-search', 'value');
  searchQueryGlobal = searchQuery;
  if (searchQuery === undefined) return;

  if (searchQuery.length !== 0) {
    // await domAPI.setHTML('header-title', `Results for: '${searchQuery}'`);
    await domAPI.setValue('input-search', '');

    // Switch to search results page
    await domAPI.setHTML('header-title', 'Search');
    await domAPI.loadPage('header-subtitle', 'components/searchCategories.html');
    await domAPI.setStyle('subtitle-search-all', 'color', 'var(--mid-dark)');
    await domAPI.loadPage('main-container', 'pages/searchPage.html');

    window.dispatchEvent(new CustomEvent('searchbarSearch', { detail: searchQuery }));
    await topExtensionOff();

  }

  // TODO: Use search query value for searching our app's library
}
