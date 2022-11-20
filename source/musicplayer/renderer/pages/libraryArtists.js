
window.addEventListener('libraryArtists-loaded', async () => {
  await generateArtistsCards();
  await domAPI.addEventListenerbyClassName('library-card', 'click', libraryArtistsExtended);
});

/**
 * Library > Artists Main Page.
 * Generate Library Artists Cards.
 */
 async function generateArtistsCards() {
  
  // parse data from app library
  const cardData = new Map(); // ('artist', {numAlbums: set(), numTracks: Number, artworks: []})
  for (let i = 0; i < libraryCatalog.length; i++) {
    const currTrack = libraryCatalog[i];
    if(cardData.has(currTrack.artist)) {
      cardData.get(currTrack.artist).numAlbums.add(currTrack.album);
      cardData.get(currTrack.artist).numTracks++;
      if(!cardData.get(currTrack.artist).artworks.includes(currTrack.artwork))
        cardData.get(currTrack.artist).artworks.push(currTrack.artwork);
    } else {
      cardData.set(currTrack.artist, {
        numAlbums: new Set().add(currTrack.album),
        numTracks: 1,
        artworks: [currTrack.artwork]
      });
    }
  }

  // generate cards
  let cardList = '';
  for (const [key, value] of cardData) {
    const cardCover = value.artworks[Math.floor(Math.random() * value.artworks.length)];
    const card = `
    <div class="library-card" data-libtarget="${key}">
      <div class="library-card-artwork">
        <img src=${cardCover}>
      </div>
      <div class="library-card-info">
        <div>${key}</div>
        <div>${value.numAlbums.size} ${value.numAlbums.size == 1 ? 'Album' : 'Albums'}</div>
        <div>${value.numTracks} ${value.numTracks == 1 ? 'Track' : 'Tracks'} </div>
      </div>
    </div>
  `;    

    cardList += card;
  }

  // insert card list into container
  await domAPI.setHTML('library-artists-cards', cardList);
}

/**
 * Libarary > Artists Extended Page.
 * Generate Artist Library View based on user selection.
 */
async function libraryArtistsExtended(e) {

  let cardArtist = e.getAttribute('data-libtarget');

  // Set grid rows
  const data = [];
  for (let i = 0; i < libraryCatalog.length; i++) {
    if(libraryCatalog[i].artist == cardArtist)
      data.push(libraryCatalog[i]);
  }

  // Generate artist grid
  await domAPI.setHTML('header-subtitle', `Library > Artists > ${cardArtist}`);
  await domAPI.setHTML('library-artists-cards', '');
  await domAPI.addGrid('library-artists-container', libraryHeaders, data, gridSettings);
}


