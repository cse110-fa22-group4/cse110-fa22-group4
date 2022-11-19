window.addEventListener('libraryGenres-loaded', async () => {
  await generateGenresCards();
  await domAPI.addEventListenerbyClassName('library-card', 'click', libraryGenresExtended);
});

/**
 * Library > Genres Main Page.
 * Generate Library Genres Cards.
 */
async function generateGenresCards() {

  // parse data from app library
  let genreCards = new Map();

  for (let i = 0; i < libraryCatalog.length; i++) {
    const genresSplit = libraryCatalog[i].genre.split(', ');
    for (let j = 0; j < genresSplit.length; j++) {
      if (genreCards.has(genresSplit[j])) {
        // genre exists in card list, update genre map
        genreCards.get(genresSplit[j])[0]++;
      } else {
        // genre does not exist in card list, create new genre map
        genreCards.set(genresSplit[j], [1, libraryCatalog[i].artwork]);
      }
    }
  }

  // generate genre cards
  let cardList = '';
  for (const [key, value] of genreCards) {
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
  await domAPI.setHTML('library-genres-cards', cardList);
}

/**
 * Library > Genres Extended Page.
 * Generate Genre Library View based on user selection.
 */
async function libraryGenresExtended(e) {

  let cardGenre = e.getAttribute('data-libtarget');

  // Set grid rows
  const data = [];
  for (let i = 0; i < libraryCatalog.length; i++) {
    const genresSplit = libraryCatalog[i].genre.split(', ');
    for (let j = 0; j < genresSplit.length; j++) {
      if (genresSplit[j] == cardGenre) {
        data.push(libraryCatalog[i]);
        break;
      }
    }
  }

  // Generate genre grid
  await domAPI.setHTML('header-subtitle', `Library > Genres > ${cardGenre}`);
  await domAPI.setHTML('library-genres-cards', '');
  await domAPI.addGrid('library-genres-container', libraryHeaders, data, gridSettings);
}


