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
	const cardData = new Map(); // ('genre', {numArtists: Set(), numTracks: Number, artworks: []})
	for (let i = 0; i < libraryCatalog.length; i++) {
		const currTrack = libraryCatalog[i];
		const genreArr = libraryCatalog[i].genre.split(', ');
		for (let j = 0; j < genreArr.length; j++) {
			const currGenre = genreArr[j];
			if (cardData.has(currGenre)) {
				cardData.get(currGenre).numArtists.add(currTrack.artist);
				cardData.get(currGenre).numTracks++;
				if (!cardData.get(currGenre).artworks.includes(currTrack.artwork)) {
					cardData.get(currGenre).artworks.push(currTrack.artwork);
				}
			} else {
				cardData.set(currGenre, {
					numArtists: new Set().add(currTrack.artist),
					numTracks: 1,
					artworks: [currTrack.artwork],
				});
			}
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
        <div>${value.numArtists.size} ${value.numArtists.size == 1 ? 'Artist' : 'Artists'}</div>
        <div>${value.numTracks} ${value.numTracks == 1 ? 'Track' : 'Tracks'} </div>
      </div>
    </div>
  `;
		cardList += card;
	}

	// insert card list into container
	await domAPI.setHTML('library-genres-cards', cardList);
}

/**
 * @memberOf Renderer
 * Library > Genres Extended Page.
 * Generate Genre Library View based on user selection.
 * @param {object} e
 */
async function libraryGenresExtended(e) {
	const cardGenre = e.getAttribute('data-libtarget');

	// Set grid rows
	const data = [];
	for (let i = 0; i < libraryCatalog.length; i++) {
		const genreArr = libraryCatalog[i].genre.split(', ');
		for (let j = 0; j < genreArr.length; j++) {
			if (genreArr[j] == cardGenre) {
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


