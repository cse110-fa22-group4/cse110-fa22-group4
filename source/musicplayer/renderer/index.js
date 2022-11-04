
/* GENERATE HOME PAGE */
$(document).ready(function() {
  $("#sidebar-container").load("../html/components/sidebar.html");
  $("#overview-container").load("../html/components/overview.html");
  $("#main-header-container").load("../html/components/mainHeader.html");
  $("#main-container").load("../html/pages/home.html");
  $("#playback-container").load("../html/components/playback.html");
});

/* SIDEBAR NAVIGATION */

// Toggle Home view
$(document).on('click', '#btn-home', () => {
  $('#main-container').load('../html/pages/home.html');
  document.getElementById('main-header').innerHTML = '<h1>Home<h1>';
});

// Toggle Overview (Now Playing) view
$(document).on('click', '#btn-overview', () => {
  $('#main-container').load('../html/pages/overview.html');
  document.getElementById('main-header').innerHTML = '<h1>Now Playing<h1>';
});

// Toggle Library view
$(document).on('click', '#btn-library', () => {
  $('#main-container').load('../html/pages/library.html');
  document.getElementById('main-header').innerHTML = '<h1>Library<h1>';
});

// Toggle Playlists view
$(document).on('click', '#btn-playlists', () => {
  $('#main-container').load('../html/pages/playlists.html');
  document.getElementById('main-header').innerHTML = '<h1>Playlists<h1>';
});

// Toggle Search results view
$(document).on('click', '#btn-search', () => {
  $('#main-container').load('../html/pages/search.html');
  document.getElementById('main-header').innerHTML = '<h1>Search<h1>';
});

// Toggle Search results extended view
$(document).on('click', '#btn-search-tracks', () => {
  $('#main-container').load('../html/pages/search_extend.html');
});