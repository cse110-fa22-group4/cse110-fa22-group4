let currGridPlaylist; // helper to track the current playlist grid

window.addEventListener('libraryPlaylists-loaded', async () => {
	await onLibraryPlaylistsLoad();
	await domAPI.addEventListenerbyClassName('library-card', 'click', libraryPlaylistsExtended);
});

window.addEventListener('library-playlists-container-row-clicked', async (args) => {
    // NOTE: click a row seems way too sensitive for practical use,
    // will probably not end up using
	// console.log(args['detail']);
});

window.addEventListener('library-playlists-container-queue-clicked', async (args) => {
    const trackObj = args['detail']; 
	console.log(trackObj);

    // send track to playback queue
    // playback integration edit
    if (queueArr.length == 0) {
        initFirstSong([trackObj]);
        initProgress([trackObj]);
        initInfo([trackObj]);
    }
    queueArr.push(trackObj);

    // send user feedback
    await giveUserFeedback('Added to Queue')

    await refreshQueueViewer();
});

window.addEventListener('library-playlists-container-delete-clicked', async (args) => {
    const playlistName = args['detail'][0];
    const deleteIndex = args['detail'][1];

    // delete track from playlist
    await fsAPI.removeFromPlaylist(playlistName, deleteIndex);

    // refresh grid
	const currPlaylist = await fsAPI.getPlaylistObj(playlistName);
	const trackList = currPlaylist.tags;
	await domAPI.setHTML('library-playlists-container', '');
	await domAPI.addGrid('library-playlists-container', libraryHeaders, trackList, gridSettings, true, playlistName);

    // send user feedback
    await giveUserFeedback('Track deleted')
});

/**
 * @name onLibraryPlaylistsLoad
 * @description Initial load of playlists page, loads card view of playlists.
 * @return {Promise<void>}
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
 * @name libraryPlaylistsExtended
 * @description Generate table view of selected playlist card.
 * @param {HTMLElement} element The HTML element this event listener is attached to.
 * @return {Promise<void>}
 */
async function libraryPlaylistsExtended(element) {
    // turn on main extended buttons
    await mainButtonsOn('components/gridExtendedButtons.html');
    
	const cardPlaylist = element.getAttribute('data-libtarget');

    currGridPlaylist = cardPlaylist;

	// Generate playlist grid
	await domAPI.setHTML('header-subtitle', `${cardPlaylist}`);
	await domAPI.setHTML('library-playlists-cards', '');

	const currPlaylist = await fsAPI.getPlaylistObj(cardPlaylist);
	const trackList = currPlaylist.tags;
	await domAPI.setHTML('library-playlists-container', '');
	await domAPI.addGrid('library-playlists-container', libraryHeaders, trackList, gridSettings, true, cardPlaylist);
}
