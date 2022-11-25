window.addEventListener('overviewExtended-loaded', async () => {
	await domAPI.addEventListener( 'btn-queue', 'click', ovExQueueClick);
	await domAPI.addEventListener( 'btn-track', 'click', ovExTrackClick);
	await domAPI.addEventListener( 'btn-lyrics', 'click', ovExLyricsClick);
});

/**
 * Navigate to Overview extended > Queue view
 * @param {HTMLElement} element
 */
async function ovExQueueClick(element) {
	await domAPI.loadPage('ovEx-content-container', 'pages/ovExQueue.html');
	await topExtensionOn();
}

/**
 * Navigate to Overview extended > Lyrics view
 * @param {HTMLElement} element
 */
async function ovExLyricsClick(element) {
	await domAPI.loadPage('ovEx-content-container', 'pages/ovExLyrics.html');
	await topExtensionOn();
}

/**
 * Navigate to Overview extended > Track view
 * @param {HTMLElement} element
 */
async function ovExTrackClick(element) {
	await domAPI.loadPage('ovEx-content-container', 'pages/ovExTrack.html');
	await topExtensionOn();
}
