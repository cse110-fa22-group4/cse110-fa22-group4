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
  let artistCards = [];

  for (let i = 0; i < libraryCatalog.length; i++) {
    let artistFound = false;

    for (let j = 0; j < artistCards.length; j++) {
      if(libraryCatalog[i].artist == artistCards[j].artist) {

        // artist exists in card list, update artist object
        artistCards[j].albums.add(libraryCatalog[i].album)
        artistCards[j].tracks.add(libraryCatalog[i].title)
        artistFound = true;
        break;
      }
    }
    
    // artist does not exist in card list, create new artist object
    if (!artistFound) {
      artistCards.push({ 
        artist: libraryCatalog[i].artist, 
        albums: new Set().add(libraryCatalog[i].album),
        tracks: new Set().add(libraryCatalog[i].album),
        artwork: libraryCatalog[i].artwork
      })
    }
  }

  // generate artist cards
  let cardList = '';

  for (let k = 0; k < artistCards.length; k++) {
    const card = `
    <div class="library-card">
      <div class="library-card-artwork">
        <img src=${artistCards[k].artwork}>
      </div>
      <div class="library-card-info">
        <div>${artistCards[k].artist}</div>
        <div>${artistCards[k].albums.size} Albums</div>
        <div>${artistCards[k].tracks.size} Tracks</div>
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
async function libraryArtistsExtended() {

  let cardArtist = 'Dua Lipa'; // TODO: how to get element attribute after 'click'

  // Set grid rows
  const data = [];
  for (let i = 0; i < libraryCatalog.length; i++) {
    if(libraryCatalog[i].artist == cardArtist)
      data.push(libraryCatalog[i]);
  }

  // Generate artist grid
  await domAPI.setHTML('header-subtitle', `Library > Artist > ${cardArtist}`);
  await domAPI.setHTML('library-artists-cards', '');
  await domAPI.addGrid('library-artists-container', libraryHeaders, data, gridSettings);
}


