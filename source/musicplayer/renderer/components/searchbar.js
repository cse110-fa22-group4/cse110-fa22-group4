window.addEventListener('DOMContentLoaded', () => {
  jqAPI.onEvent('body', 'submit', '#search-form', submitSearch);

});

function submitSearch(element) {
  event.preventDefault();

  // get query from search bar input, set global var (incase value is needed later)
  searchQuery = domAPI.managedGetValue('input-search', 'value');

  // TODO: Use this query value for searching our app's library
  alert(`Hi, you entered the following search query:  '${searchQuery}' Unfortunately the search feature is under construction!`);
}