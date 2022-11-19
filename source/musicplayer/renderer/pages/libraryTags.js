window.addEventListener('libraryTags-loaded', async () => {
  await generateTagsCards();
  await domAPI.addEventListenerbyClassName('library-card', 'click', libraryTagsExtended);
});

/**
 * Library > Tags Main Page.
 * Generate Library Tags Cards.
 */
async function generateTagsCards() {

  // parse data from app library
  let tagCards = new Map();

  for (let i = 0; i < libraryCatalog.length; i++) {
    const tagsSplit = libraryCatalog[i].tags.split(', ');
    for (let j = 0; j < tagsSplit.length; j++) {
      if (tagCards.has(tagsSplit[j])) {
        // tag exists in card list, update tag map
        tagCards.get(tagsSplit[j])[0]++;
      } else {
        // tag does not exist in card list, create new tag map
        tagCards.set(tagsSplit[j], [1, libraryCatalog[i].artwork]);
      }
    }
  }

  // generate tag cards
  let cardList = '';
  for (const [key, value] of tagCards) {
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
  await domAPI.setHTML('library-tags-cards', cardList);
}

/**
 * Library > Tags Extended Page.
 * Generate Tag Library View based on user selection.
 */
async function libraryTagsExtended(e) {

  let cardTag = e.getAttribute('data-libtarget');

  // Set grid rows
  const data = [];
  for (let i = 0; i < libraryCatalog.length; i++) {
    const tagsSplit = libraryCatalog[i].tags.split(', ');
    for (let j = 0; j < tagsSplit.length; j++) {
      if (tagsSplit[j] == cardTag) {
        data.push(libraryCatalog[i]);
        break;
      }
    }
  }

  // Generate tag grid
  await domAPI.setHTML('header-subtitle', `Library > Tags > ${cardTag}`);
  await domAPI.setHTML('library-tags-cards', '');
  await domAPI.addGrid('library-tags-container', libraryHeaders, data, gridSettings);
}