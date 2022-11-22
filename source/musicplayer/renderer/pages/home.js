// This file is very WIP
window.addEventListener('home-loaded', async () => {
	await generateHomeCards();
	await domAPI.addEventListenerbyClassName('library-card-album', 'click', libraryAlbumsExtended);
	await domAPI.addEventListenerbyClassName('library-card-artist', 'click', libraryArtistsExtended);
	await domAPI.addEventListenerbyClassName('library-card-genre', 'click', libraryGenresExtended);
	await domAPI.addEventListenerbyClassName('library-card-tag', 'click', libraryTagsExtended);
});

/**
 * @description Generates artist, album, genre, and tag cards, four of each, randomly selected from the library
 * @return {Promise<void>}
 */
async function generateHomeCards() {
	const cardList = [];

	// insert card list into container
	await domAPI.setHTML('library-albums-cards', cardList);
}

/**
 * @description Generates a list of album cards
 * @param {list} albums an array of four random albums in the library Catalog to generate cards for
 * @return {string} a list of strings which contain html for album cards
 */
async function generateAlbumCardList(albums) {
	// let's fill out our cardData with entries from the albums
	const cardData = new Map(); // ('album', {artist: '', year: Number, artwork: ''})
	albums.forEach((album) =>{
		cardData.set(album, {
			year: 0,
			artworks: [],
		});
	});

	// we go through the library and fill in our information for the album
	for (let i = 0; i < libraryCatalog.length; i++) {
		const currTrack = libraryCatalog[i];
		if (cardData.has(currTrack.album)) {
			cardData.set(currTrack.album, {
				artist: currTrack.artist,
				year: currTrack.year,
				artwork: currTrack.artwork,
			});
		}
	}

	// generate cards
	let cardList = '';
	for (const [key, value] of cardData) {
		const card = `
    <div class="library-card-album" data-libtarget="${key}">
      <div class="library-card-artwork">
        <img src=${value.artwork} alt="">
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
	return cardList;
}

/**
 * @description Generates a list of artist cards
 * @param {list} artists an array of four random artists in the library Catalog to generate cards for
 * @return {string} a list of strings which contain html for artist cards
 */
async function generateArtistCardList(artists) {
	// we fill our cardData with the artists we were passed in
	const cardData = new Map(); // ('album', {artist: '', year: Number, artwork: ''})
	artists.forEach((artist) => {
		cardData.set(artist, {
			numAlbums: new Set(),
			numTracks: 0,
			artworks: [],
		});
	});

	// go through the library and get information on the artists
	for (let i = 0; i < libraryCatalog.length; i++) {
		const currTrack = libraryCatalog[i];
		if (cardData.has(currTrack.artist)) {
			cardData.get(currTrack.artist).numAlbums.add(currTrack.album);
			cardData.get(currTrack.artist).numTracks++;
			if (!cardData.get(currTrack.artist).artworks.includes(currTrack.artwork)) {
				cardData.get(currTrack.artist).artworks.push(currTrack.artwork);
			}
		}
	}

	// generate cards from cardData
	let cardList = '';
	for (const [key, value] of cardData) {
		const cardCover = value.artworks[Math.floor(Math.random() * value.artworks.length)];
		const card = `
    <div class="library-card-artist" data-libtarget="${key}">
      <div class="library-card-artwork">
        <img src=${cardCover} alt="">
      </div>
      <div class="library-card-info">
        <div>${key}</div>
        <div>${value.numAlbums.size} ${value.numAlbums.size === 1 ? 'Album' : 'Albums'}</div>
        <div>${value.numTracks} ${value.numTracks === 1 ? 'Track' : 'Tracks'} </div>
      </div>
    </div>
  `;

		cardList += card;
	}
	return cardList;
}

/**
 * @description Generates a list of genre cards
 * @param {list} genres an array of four random genres in the library Catalog to generate cards for
 * @return {string} a list of strings which contain html for genre cards
 */
async function generateGenreCardList(genres) {
	// fill our data with our given genres
	const cardData = new Map(); // ('genre', {numArtists: Set(), numTracks: Number, artworks: []})
	genres.forEach((genre) => {
		cardData.set(genre, {
			numArtists: new Set(),
			numTracks: 0,
			artworks: [],
		});
	});

	// look through the library to find songs in the genre
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
			}
		}
	}

	// generate cards
	let cardList = '';
	for (const [key, value] of cardData) {
		const cardCover = value.artworks[Math.floor(Math.random() * value.artworks.length)];
		const card = `
    <div class="library-card-genre" data-libtarget="${key}">
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

	return cardList;
}

/**
 * @description Generates a list of tag cards
 * @param {list} tags an array of four random tags in the library Catalog to generate cards for
 * @return {string} a list of strings which contain html for tag cards
 */
async function generateTagCardList(tags) {
	// populate our tag keys to our data from tags
	const cardData = new Map(); // ('tag', {numArtists: Set(), numTracks: Number, artworks: []})
	tags.forEach((tags) => {
		cardData.set(tags, {
			numArtists: new Set(),
			numTracks: 0,
			artworks: [],
		});
	});

	// look through the library for songs with these tags
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
			}
		}
	}


	// generate cards
	let cardList = '';
	for (const [key, value] of cardData) {
		const cardCover = value.artworks[Math.floor(Math.random() * value.artworks.length)];
		const card = `
    <div class="library-card-tag" data-libtarget="${key}">
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
	return cardList;
}

/**
 * @description  > Albums Extended Page. Generate Album Library View based on user selection.
 * @param {object} e The element that this event handler is attached to.
 * @return {Promise<void>}
 *
 */
async function libraryAlbumsExtended(e) {
	const cardAlbum = e.getAttribute('data-libtarget');

	// Set grid rows
	const data = [];
	for (let i = 0; i < libraryCatalog.length; i++) {
		if (libraryCatalog[i].album === cardAlbum) {
			data.push(libraryCatalog[i]);
		}
	}

	// Generate album grid
	await domAPI.setHTML('header-subtitle', `Library > Albums > ${cardAlbum}`);
	await domAPI.setHTML('library-albums-cards', '');
	await domAPI.addGrid('library-albums-container', libraryHeaders, data, gridSettings);
}

/**
 * @description Libarary > Artists Extended Page. Generate Artist Library View based on user selection.
 * @param {object} e The HTML element this event listener is attached to.
 */
async function libraryArtistsExtended(e) {
	const cardArtist = e.getAttribute('data-libtarget');

	// Set grid rows
	const data = [];
	for (let i = 0; i < libraryCatalog.length; i++) {
		if (libraryCatalog[i].artist === cardArtist) {
			data.push(libraryCatalog[i]);
		}
	}

	// Generate artist grid
	await domAPI.setHTML('header-subtitle', `Library > Artists > ${cardArtist}`);
	await domAPI.setHTML('library-artists-cards', '');
	await domAPI.addGrid('library-artists-container', libraryHeaders, data, gridSettings);
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
			if (genreArr[j] === cardGenre) {
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

// ALL THESE FUNCTIONS ARE HERE TEMPORARILY BECAUSE I DO NOT KNOW HOW TO IMPORT FUNCTIONS.

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
