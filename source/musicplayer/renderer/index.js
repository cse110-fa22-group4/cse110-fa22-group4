
/* GENERATE HOME PAGE */
$(document).ready(function() {
  $("#sidebar-container").load("../html/components/sidebar.html");
  $("#overview-container").load("../html/components/overview.html");
  $("#main-header-container").load("../html/components/mainHeader.html");
  $("#main-container").load("../html/pages/home.html");
  $("#playback-container").load("../html/components/playback.html");
});

/* SIDEBAR NAVIGATION */
$(document).on('click', '#btn-home', navToHome);
$(document).on('click', '#btn-overview', navToOverview);
$(document).on('click', '#btn-library', navToLibrary);
$(document).on('click', '#btn-playlists', navToPlaylists);
$(document).on('click', '#btn-search', navToSearch);
$(document).on('click', '#btn-search-tracks', navToSearchExtended);

// Navigate to Home view
function navToHome(element) {
$('#main-container').load('../html/pages/home.html');
  document.getElementById('main-header').innerHTML = '<h1>Home<h1>';
};

// Navigate to Overview (Now Playing) view
function navToOverview(element) {
  $('#main-container').load('../html/pages/overview.html');
  document.getElementById('main-header').innerHTML = '<h1>Now Playing<h1>';
};

// Navigate to Library view
function navToLibrary(element) {
  $('#main-container').load('../html/pages/library.html');
  document.getElementById('main-header').innerHTML = '<h1>Library<h1>';
};

// Navigate to Playlists view
function navToPlaylists(element) {
  $('#main-container').load('../html/pages/playlists.html');
  document.getElementById('main-header').innerHTML = '<h1>Playlists<h1>';
};

// Navigate to Search results view
function navToSearch(element) {
  $('#main-container').load('../html/pages/search.html');
  document.getElementById('main-header').innerHTML = '<h1>Search<h1>';
};

// Navigate to Search results extended view
function navToSearchExtended(element) {
  $('#main-container').load('../html/pages/search_extend.html');
};