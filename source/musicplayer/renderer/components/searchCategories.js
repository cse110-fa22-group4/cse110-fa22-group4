window.addEventListener('searchCategories-loaded', async () => {
  await domAPI.addEventListener('subtitle-search-all', 'click', searchAll);
  await domAPI.addEventListener('subtitle-search-tracks', 'click', searchTracks);
  await domAPI.addEventListener('subtitle-search-artists', 'click', searchArtists);
  await domAPI.addEventListener('subtitle-search-albums', 'click', searchAlbums);
  await domAPI.addEventListener('subtitle-search-genres', 'click', searchGenres);
  await domAPI.addEventListener('subtitle-search-playlists', 'click', searchPlaylists);
  await domAPI.addEventListener('subtitle-search-tags', 'click', searchTags);
});

/**
 * Narrow search results to all
 * @param {HTMLElement} element
 */
 async function searchAll(element) {
	await resetSearchStyle();
  await domAPI.setStyle('subtitle-search-all', 'color', 'var(--mid-dark)');
	alert('*FUNCTION UNDER CONTRUCTION*');
}

/**
 * Narrow search results to tracks
 * @param {HTMLElement} element
 */
 async function searchTracks(element) {
	await resetSearchStyle();
  await domAPI.setStyle('subtitle-search-tracks', 'color', 'var(--mid-dark)');
	alert('*FUNCTION UNDER CONTRUCTION*');
}

/**
 * Narrow search results to artists
 * @param {HTMLElement} element
 */
 async function searchArtists(element) {
	await resetSearchStyle();
  await domAPI.setStyle('subtitle-search-artists', 'color', 'var(--mid-dark)');
	alert('*FUNCTION UNDER CONTRUCTION*');
}

/**
 * Narrow search results to albums
 * @param {HTMLElement} element
 */
 async function searchAlbums(element) {
	await resetSearchStyle();
  await domAPI.setStyle('subtitle-search-albums', 'color', 'var(--mid-dark)');
	alert('*FUNCTION UNDER CONTRUCTION*');
}

/**
 * Narrow search results to genres
 * @param {HTMLElement} element
 */
 async function searchGenres(element) {
	await resetSearchStyle();
  await domAPI.setStyle('subtitle-search-genres', 'color', 'var(--mid-dark)');
	alert('*FUNCTION UNDER CONTRUCTION*');
}

/**
 * Narrow search results to playlists
 * @param {HTMLElement} element
 */
 async function searchPlaylists(element) {
	await resetSearchStyle();
  await domAPI.setStyle('subtitle-search-playlists', 'color', 'var(--mid-dark)');
	alert('*FUNCTION UNDER CONTRUCTION*');
}

/**
 * Narrow search results to tags
 * @param {HTMLElement} element
 */
 async function searchTags(element) {
	await resetSearchStyle();
  await domAPI.setStyle('subtitle-search-tags', 'color', 'var(--mid-dark)');
	alert('*FUNCTION UNDER CONTRUCTION*');
}

/**
 * Reset search categories styling
 * @param {HTMLElement} element
 */
 async function resetSearchStyle(element) {
  await domAPI.setStyle('subtitle-search-all', 'color', 'var(--mid)');
  await domAPI.setStyle('subtitle-search-tracks', 'color', 'var(--mid)');
  await domAPI.setStyle('subtitle-search-artists', 'color', 'var(--mid)');
  await domAPI.setStyle('subtitle-search-albums', 'color', 'var(--mid)');
  await domAPI.setStyle('subtitle-search-genres', 'color', 'var(--mid)');
  await domAPI.setStyle('subtitle-search-playlists', 'color', 'var(--mid)');
  await domAPI.setStyle('subtitle-search-tags', 'color', 'var(--mid)');
}

