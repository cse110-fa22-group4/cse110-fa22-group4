window.addEventListener('libraryPlaylists-loaded', async () => {
	await onLibraryPlaylistsLoad();
    await domAPI.addEventListenerbyClassName('library-card', 'click', libraryPlaylistsExtended);
});

window.addEventListener('library-playlists-container-grid-clicked', async (args) => {
	console.log(args['detail']);
});

/**
 * Initial LibraryPlaylists Load.
 */
 async function onLibraryPlaylistsLoad() {
    await domAPI.setHTML('library-playlists-container', '');
    const libraryPlaylists = await fsAPI.getAllPlaylists();

	// generate cards
	let cardList = '';
    for (let i = 0; i < libraryPlaylists.length; i++) {
		const cardCover = '../img/artwork-default.png';
		const card = `
    <div class="library-card" data-libtarget="${libraryPlaylists[i]}">
      <div class="library-card-artwork">
        <img src=${cardCover} alt="">
      </div>
      <div class="library-card-info">
        <div>${libraryPlaylists[i]}</div>
      </div>
    </div>
  `;
		cardList += card;
	}

    // insert card list into container
	await domAPI.setHTML('library-playlists-cards', cardList);
}

/**
 * @description Library > Playlists Extended Page. Generate Playlist Library View based on user selection.
 * @param {object} e The HTML element this event listener is attached to.
 */
 async function libraryPlaylistsExtended(e) {
	const cardPlaylist = e.getAttribute('data-libtarget');

	// Set grid rows
	// const data = [];

	// Generate playlist grid
	await domAPI.setHTML('header-subtitle', `${cardPlaylist}`);
	await domAPI.setHTML('library-playlists-cards', '');

    const currPlaylist = await fsAPI.getPlaylist(cardPlaylist);
    const trackList = currPlaylist.trackList;
    await domAPI.setHTML('library-playlists-container', '');
	await domAPI.addGrid('library-playlists-container', libraryHeaders, trackList, gridSettings);
}