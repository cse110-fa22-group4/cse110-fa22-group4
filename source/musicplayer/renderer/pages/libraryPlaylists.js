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
  // const cardData = new Map() // ('playlist', {numArtists: Set(), numTracks: Number, artworks: []})
  // for (let i = 0; i < libraryCatalog.length; i++) {
  //   const currTrack = libraryCatalog[i];
  //   const playlistArr = libraryCatalog[i].playlists.split(', ');
  //   for (let j = 0; j < playlistArr.length; j++) {
  //     const currPlaylist = playlistArr[j];
  //     if(cardData.has(currPlaylist)) {
  //       cardData.get(currPlaylist).numArtists.add(currTrack.artist);
  //       cardData.get(currPlaylist).numTracks++;
  //       if(!cardData.get(currPlaylist).artworks.includes(currTrack.artwork))
  //         cardData.get(currPlaylist).artworks.push(currTrack.artwork);
  //     } else {
  //       cardData.set(currPlaylist, {
  //         numArtists: new Set().add(currTrack.artist),
  //         numTracks: 1,
  //         artworks: [currTrack.artwork]
  //       });
  //     }
  //   }
  // }

  // generate cards
  let cardList = '';
  for (const [key, value] of libraryPlaylists) {
    const cardCover = value.artworks[Math.floor(Math.random() * value.artworks.length)];
    const card = `
    <div class="library-card" data-libtarget="${key}">
      <div class="library-card-artwork">
        <img src=${cardCover}>
      </div>
      <div class="library-card-info">
        <div>${key}</div>
        <div>${value.artists.size} ${value.artists.size == 1 ? 'Artist' : 'Artists'}</div>
        <div>${value.numTracks} ${value.numTracks == 1 ? 'Track' : 'Tracks'} </div>
      </div>
    </div>
  `;
    cardList += card;
  }
  // generate cards for custom user playlists
  for (const [key, value] of userPlaylists) {
    const cardCover = value.artworks[Math.floor(Math.random() * value.artworks.length)];
    const card = `
    <div class="library-card" data-libtarget="${key}">
      <div class="library-card-artwork">
        <img src=${cardCover}>
      </div>
      <div class="library-card-info">
        <div>${key}</div>
        <div>${value.artists.size} ${value.artists.size == 1 ? 'Artist' : 'Artists'}</div>
        <div>${value.numTracks} ${value.numTracks == 1 ? 'Track' : 'Tracks'} </div>
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