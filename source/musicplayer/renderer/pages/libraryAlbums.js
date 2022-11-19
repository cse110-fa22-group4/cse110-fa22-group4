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
  let albumCards = [];

  for (let i = 0; i < libraryCatalog.length; i++) {
    let albumFound = false;

    for (let j = 0; j < albumCards.length; j++) {
      if(libraryCatalog[i].album == albumCards[j].album) {

        // album exists in card list, update album object
        albumCards[j].artist = libraryCatalog[i].artist;
        albumCards[j].year = libraryCatalog[i].year;
        albumFound = true;
        break;
      }
    }
    
    // album does not exist in card list, create new album object
    if (!albumFound) {
      albumCards.push({ 
        album: libraryCatalog[i].album, 
        artist: libraryCatalog[i].artist,
        year: libraryCatalog[i].year,
        artwork: libraryCatalog[i].artwork
      })
    }
  }

  // generate album cards
  let cardList = '';

  for (let k = 0; k < albumCards.length; k++) {
    const card = `
    <div class="library-card">
      <div class="library-card-artwork">
        <img src=${albumCards[k].artwork}>
      </div>
      <div class="library-card-info">
        <div>${albumCards[k].album}</div>
        <div>${albumCards[k].artist}</div>
        <div>${albumCards[k].year}</div>
      </div>
    </div>
  `;    

    cardList += card;
  }
console.log(cardList);
  // insert card list into container
  await domAPI.setHTML('library-albums-cards', cardList);
}

/**
 * Library > Albums Extended Page.
 * Generate Album Library View based on user selection.
 */
async function libraryAlbumsExtended() {

  let cardAlbum = 'Future Nostalgia'; // TODO: how to get element attribute after 'click'

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