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
	const cardData = new Map(); // ('tag', {numArtists: Set(), numTracks: Number, artworks: []})
	for (let i = 0; i < libraryCatalog.length; i++) {
		const currTrack = libraryCatalog[i];
		const tagArr = libraryCatalog[i].tags.split(', ');
		for (let j = 0; j < tagArr.length; j++) {
			const currTag = tagArr[j];
			if (cardData.has(currTag)) {
				cardData.get(currTag).numArtists.add(currTrack.artist);
				cardData.get(currTag).numTracks++;
				if (!cardData.get(currTag).artworks.includes(currTrack.artwork)) {
					cardData.get(currTag).artworks.push(currTrack.artwork);
				}
			} else {
				cardData.set(currTag, {
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
        <img src=${cardCover} alt="">
      </div>
      <div class="library-card-info">
        <div>${key}</div>
        <div>${value.numArtists.size} ${value.numArtists.size === 1 ? 'Artist' : 'Artists'}</div>
        <div>${value.numTracks} ${value.numTracks === 1 ? 'Track' : 'Tracks'} </div>
      </div>
    </div>
  `;
		cardList += card;
	}

	// insert card list into container
	await domAPI.setHTML('library-tags-cards', cardList);
}

/**
 * @description Library > Tags Extended Page. Generate Tag Library View based on user selection.
 * @param {object} e The HTML element this event listener is attached to.
 */
async function libraryTagsExtended(e) {
	const cardTag = e.getAttribute('data-libtarget');

	// Set grid rows
	const data = [];
	for (let i = 0; i < libraryCatalog.length; i++) {
		const tagsSplit = libraryCatalog[i].tags.split(', ');
		for (let j = 0; j < tagsSplit.length; j++) {
			if (tagsSplit[j] === cardTag) {
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
