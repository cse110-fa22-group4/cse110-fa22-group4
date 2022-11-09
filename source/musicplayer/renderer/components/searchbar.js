window.addEventListener('DOMContentLoaded', () => {
    jqAPI.onEvent('body', 'submit', '#search-form', submitSearch);
});

// Handle user search query
function submitSearch(element) {
    event.preventDefault();

    // Set global var for search query input
    searchQuery = domAPI.managedGetValue('input-search', 'value');
    if (searchQuery === undefined) return;

    if (searchQuery.length !== 0) {
        // Switch to search results page
        jqAPI.loadPage('#main-container', 'pages/search.html');
        topExtensionOff();

        // Change main header to match search query
        domAPI.managedSetHTML('main-header', `<h1>Top results for: '${searchQuery}'</h1>`);
        window.dispatchEvent(new CustomEvent('searchbarSearch', {detail: searchQuery}));
    }

    // TODO: Use search query value for searching our app's library
}
