window.addEventListener('libraryPlaylists-loaded', async () => {
  await generatePlaylistsCards();
  await domAPI.addEventListenerbyClassName('library-card', 'click', libraryPlaylistsExtended);
});

/**
 * Library > Playlists Main Page.
 * Generate Library Playlists Cards.
 */
async function generatePlaylistsCards() {

  // parse data from app library
  let playlistCards = new Map();

  for (let i = 0; i < libraryCatalog.length; i++) {
    const playlistsSplit = libraryCatalog[i].playlists.split(', ');
    for (let j = 0; j < playlistsSplit.length; j++) {
      if (playlistCards.has(playlistsSplit[j])) {
        // playlist exists in card list, update playlist map
        playlistCards.get(playlistsSplit[j])[0]++;
      } else {
        // playlist does not exist in card list, create new playlist map
        playlistCards.set(playlistsSplit[j], [1, libraryCatalog[i].artwork]);
      }
    }
  }

  // generate playlist cards
  let cardList = '';
  for (const [key, value] of playlistCards) {
    const card = `
    <div class="library-card" data-libtarget="${key}">
      <div class="library-card-artwork">
        <img src=${value[1]}>
      </div>
      <div class="library-card-info">
        <div>${key}</div>
        <div>${value[0]} Tracks</div>
        <div></div>
      </div>
    </div>
  `;

    cardList += card;
  }

  // insert card list into container
  await domAPI.setHTML('library-playlists-cards', cardList);
}

/**
 * Library > Playlists Extended Page.
 * Generate Playlist Library View based on user selection.
 */
async function libraryPlaylistsExtended(e) {

  let cardPlaylist = e.getAttribute('data-libtarget');

  // Set grid rows
  const data = [];
  for (let i = 0; i < libraryCatalog.length; i++) {
    const playlistsSplit = libraryCatalog[i].playlists.split(', ');
    for (let j = 0; j < playlistsSplit.length; j++) {
      if (playlistsSplit[j] == cardPlaylist) {
        data.push(libraryCatalog[i]);
        break;
      }
    }
  }

  // Generate playlist grid
  await domAPI.setHTML('header-subtitle', `Library > Playlists > ${cardPlaylist}`);
  await domAPI.setHTML('library-playlists-cards', '');
  await domAPI.addGrid('library-playlists-container', libraryHeaders, data, gridSettings);
}