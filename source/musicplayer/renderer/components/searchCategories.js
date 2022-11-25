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
	await resetSubtitleButtons();
	await domAPI.setStyleClassToggle('subtitle-search-all', 'subtitle-search-active', true);
	alert('*FUNCTION UNDER CONTRUCTION*');
}

/**
 * Narrow search results to tracks
 * @param {HTMLElement} element
 */
async function searchTracks(element) {
	await resetSubtitleButtons();
	await domAPI.setStyleClassToggle('subtitle-search-tracks', 'subtitle-search-active', true);
	alert('*FUNCTION UNDER CONTRUCTION*');
}

/**
 * Narrow search results to artists
 * @param {HTMLElement} element
 */
async function searchArtists(element) {
	await resetSubtitleButtons();
	await domAPI.setStyleClassToggle('subtitle-search-artists', 'subtitle-search-active', true);
	alert('*FUNCTION UNDER CONTRUCTION*');
}

/**
 * Narrow search results to albums
 * @param {HTMLElement} element
 */
async function searchAlbums(element) {
	await resetSubtitleButtons();
	await domAPI.setStyleClassToggle('subtitle-search-albums', 'subtitle-search-active', true);
	alert('*FUNCTION UNDER CONTRUCTION*');
}

/**
 * Narrow search results to genres
 * @param {HTMLElement} element
 */
async function searchGenres(element) {
	await resetSubtitleButtons();
	await domAPI.setStyleClassToggle('subtitle-search-genres', 'subtitle-search-active', true);
	alert('*FUNCTION UNDER CONTRUCTION*');
}

/**
 * Narrow search results to playlists
 * @param {HTMLElement} element
 */
async function searchPlaylists(element) {
	await resetSubtitleButtons();
	await domAPI.setStyleClassToggle('subtitle-search-playlists', 'subtitle-search-active', true);
	alert('*FUNCTION UNDER CONTRUCTION*');
}

/**
 * Narrow search results to tags
 * @param {HTMLElement} element
 */
async function searchTags(element) {
	await resetSubtitleButtons();
	await domAPI.setStyleClassToggle('subtitle-search-tags', 'subtitle-search-active', true);
	alert('*FUNCTION UNDER CONTRUCTION*');
}

/**
 * Toggles off background highlight of subtitle buttons.
 */
async function resetSubtitleButtons() {
	await domAPI.setStyleClassToggle('subtitle-search-all', 'subtitle-search-active', false);
	await domAPI.setStyleClassToggle('subtitle-search-tracks', 'subtitle-search-active', false);
	await domAPI.setStyleClassToggle('subtitle-search-artists', 'subtitle-search-active', false);
	await domAPI.setStyleClassToggle('subtitle-search-albums', 'subtitle-search-active', false);
	await domAPI.setStyleClassToggle('subtitle-search-genres', 'subtitle-search-active', false);
	await domAPI.setStyleClassToggle('subtitle-search-playlists', 'subtitle-search-active', false);
	await domAPI.setStyleClassToggle('subtitle-search-tags', 'subtitle-search-active', false);
}
