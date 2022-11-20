window.addEventListener('libraryAlbums-loaded', async () => {
  await generateAlbumsCards();
  await domAPI.addEventListenerbyClassName('library-card', 'click', libraryAlbumsExtended);
});

/**
 * Library > Albums Main Page.
 * Generate Library Albums Cards.
 */
 async function generateAlbumsCards() {

  // parse data from app library
  const cardData = new Map() // ('album', {artist: '', year: Number, artwork: ''})

  for (let i = 0; i < libraryCatalog.length; i++) {
    const currTrack = libraryCatalog[i];
    if(!cardData.has(currTrack.album)) {
      cardData.set(currTrack.album, {
        artist: currTrack.artist,
        year: currTrack.year,
        artwork: currTrack.artwork
      });
    }
  }

  // generate cards
  let cardList = '';
  for (const [key, value] of cardData) {
    const card = `
    <div class="library-card" data-libtarget="${key}">
      <div class="library-card-artwork">
        <img src=${value.artwork}>
      </div>
      <div class="library-card-info">
        <div>${key}</div>
        <div>${value.artist}</div>
        <div>${value.year}</div>
      </div>
    </div>
  `; 

    cardList += card;
  }

  // insert card list into container
  await domAPI.setHTML('library-albums-cards', cardList);
}

/**
 * Library > Albums Extended Page.
 * Generate Album Library View based on user selection.
 */
async function libraryAlbumsExtended(e) {

  let cardAlbum = e.getAttribute('data-libtarget');

  // Set grid rows
  const data = [];
  for (let i = 0; i < libraryCatalog.length; i++) {
    if(libraryCatalog[i].album == cardAlbum)
      data.push(libraryCatalog[i]);
  }

  // Generate album grid
  await domAPI.setHTML('header-subtitle', `Library > Albums > ${cardAlbum}`);
  await domAPI.setHTML('library-albums-cards', '');
  await domAPI.addGrid('library-albums-container', libraryHeaders, data, gridSettings);
}