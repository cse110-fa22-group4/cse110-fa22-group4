window.addEventListener('searchbar-loaded', () => {
    domAPI.addEventListener('search-form', 'submit', submitSearch);
});

/**
 * Handles search
 * @param {HTMLElement} element
 */
async function submitSearch(element) {
    event.preventDefault();

    // Set global var for search query input
    const searchQuery = domAPI.getValue('input-search', 'value');
    if (searchQuery === undefined) return;

    if (searchQuery.length !== 0) {
        // Switch to search results page
        await domAPI.loadPage('main-container', 'pages/search.html');

        // Change main header to match search query
        domAPI.setHTML('main-header', `<h1>Top results for: '${searchQuery}'</h1>`);
        window.dispatchEvent(new CustomEvent('searchbarSearch', {detail: searchQuery}));
    }

    // TODO: Use search query value for searching our app's library
}
