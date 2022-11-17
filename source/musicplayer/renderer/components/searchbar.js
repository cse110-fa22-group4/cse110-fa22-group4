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
  if (searchQuery === undefined) return;

  if (searchQuery.length !== 0) {
    // Switch to search results page
    await domAPI.loadPage('main-container', 'pages/search.html');

    // Change main header to match search query
    await domAPI.setHTML('header-title', `Top results for: '${searchQuery}'`);
    await domAPI.loadPage('header-subtitle', 'components/searchCategories.html');
    window.dispatchEvent(new CustomEvent('searchbarSearch', { detail: searchQuery }));
    await topExtensionOff();

  }

  // TODO: Use search query value for searching our app's library
}
