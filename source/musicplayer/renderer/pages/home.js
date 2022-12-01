let libraryCatalogRef;
window.addEventListener('home-loaded', async () => {
	// we need to get our global libraryCatalogRef
	libraryCatalogRef = await fsAPI.getSongsTrackData();
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
	// we cannot have more cards than we have songs
	const numHomeCards = Math.min(4, libraryCatalogRef.length);

	if (numHomeCards === 0) {
		await emptyLibrary();
		return;
	}

	// this boolean prevents us from failing to generate something unique more than once.
	// if we generate something nonunique, try again, and it still isn't unique, we just don't add a card then
	const maxRepeats = 4;

	// let's get numHomeCards many unique random entries from our Library
	const albums = new Set();
	let count = 0;
	while (albums.size < numHomeCards) {
		const randomIndex = Math.floor(Math.random()*libraryCatalogRef.length);
		// let's try this once more if it's not unique. We add it regardless of whether it is new or not the second time
		if (!(albums.has(libraryCatalogRef[randomIndex]['album']))) {
			albums.add(libraryCatalogRef[randomIndex]['album']);
			count = 0;
		} else if (count >= maxRepeats) {
			break;
		} else {
			// this only gets executed when there has not been a repeat
			// failure and the two adjacent elements are not equal.
			count+=1;
		}
	}

	const artists = new Set();
	count = 0;
	while (artists.size < numHomeCards) {
		const randomIndex = Math.floor(Math.random()*libraryCatalogRef.length);
		// let's try this once more if it's not unique
		if (!(artists.has(libraryCatalogRef[randomIndex]['artist']))) {
			artists.add(libraryCatalogRef[randomIndex].artist);
			count = 0;
		} else if (count >= maxRepeats) {
			break;
		} else {
			// this only gets executed when there has not been a repeat
			// failure and the two adjacent elements are not equal.
			count+=1;
		}
	}

	const genres = new Set();
	count = 0;
	while (genres.size < numHomeCards && count < maxRepeats) {
		const randomIndex = Math.floor(Math.random()*libraryCatalogRef.length);
		// let's try this once more if it's not unique
		// since there can be an array of genres, we add all of them as long as they are unique in a for loop
		const genreArr = libraryCatalogRef[randomIndex].genre.split(', ');
		if (genreArr.length == 0) {
			genres.add('');
			count += 1;
		}
		for (const i of genreArr) {
			if ((!(genres.has(i))) && genres.size < numHomeCards) {
				genres.add(i);
				count = 0;
			} else if (count >= maxRepeats) {
				break;
			} else {
				// this only gets executed when there has not been a repeat
				// failure and the two adjacent elements are not equal.
				count += 1;
			}
		}
	}

	const tags = new Set();
	count = 0;
	while (tags.size < numHomeCards && count < maxRepeats) {
		const randomIndex = Math.floor(Math.random()*libraryCatalogRef.length);
		// let's try this once more if it's not unique
		// since there can be an array of genres, we add all of them as long as they are unique in a for loop
		const tagArr = libraryCatalogRef[randomIndex].tags.split(', ');
		if (tagArr.length == 0) {
			tags.add('');
			count += 1;
		}
		for (const i of tagArr) {
			if ((!(tags.has(i))) && tags.size < numHomeCards) {
				tags.add(i);
				count = 0;
			} else if (count >= maxRepeats) {
				break;
			} else {
				// this only gets executed when there has not been a repeat
				// failure and the two adjacent elements are not equal.
				count+=1;
			}
		}
	}

	// insert card list into containers
	await domAPI.setHTML('home-albums-container', await generateAlbumCardList(albums));
	await domAPI.setHTML('home-artists-container', await generateArtistCardList(artists));
	await domAPI.setHTML('home-genres-container', await generateGenreCardList(genres));
	await domAPI.setHTML('home-tags-container', await generateTagCardList(tags));
}

/**
 * @description Generates a list of album cards
 * @param {set} albums  - a set of four random albums in the library Catalog to generate cards for
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
	for (let i = 0; i < libraryCatalogRef.length; i++) {
		const currTrack = libraryCatalogRef[i];
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
		// generation with no parameters
		let album;
		if (key == '') {
			album = 'Unknown Album';
		} else {
			album = key;
		}
		if (value.artist == '') {
			value.artist = 'Unknown Artist';
		}
		if (value.year == '') {
			value.year = 'Unknown Year';
		}
		if (value.artwork == '' || value.artwork == undefined) {
			value.artwork = '../img/artwork-default.png';
		}
		const card = `
    <div class="library-card library-card-album" data-libtarget="${key}">
      <div class="library-card-artwork">
        <img src=${value.artwork} alt="">
      </div>
      <div class="library-card-info">
        <div>${album}</div>
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
 * @param {set} artists  - a set of four random artists in the library Catalog to generate cards for
 * @return {string} a list of strings which contain html for artist cards
 */
async function generateArtistCardList(artists) {
	// we fill our cardData with the artists we were passed in
	const cardData = new Map(); // ('artist, {numAlbums: '', year: Number, artwork: ''})
	artists.forEach((artist) => {
		cardData.set(artist, {
			numAlbums: new Set(),
			numTracks: 0,
			artworks: [],
		});
	});

	// go through the library and get information on the artists
	for (let i = 0; i < libraryCatalogRef.length; i++) {
		const currTrack = libraryCatalogRef[i];
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
		let cardCover = value.artworks[Math.floor(Math.random() * value.artworks.length)];
		// generation with no parameters
		let artist;
		if (key == '') {
			artist = 'Unknown Artist';
		} else {
			artist = key;
		}
		if (cardCover == '' || cardCover == undefined) {
			cardCover = '../img/artwork-default.png';
		}
		const card = `
    <div class="library-card library-card-artist" data-libtarget="${key}">
      <div class="library-card-artwork">
        <img src=${cardCover} alt="">
      </div>
      <div class="library-card-info">
        <div>${artist}</div>
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
 * @param {set} genres - a set of four random genres in the library Catalog to generate cards for
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
	for (let i = 0; i < libraryCatalogRef.length; i++) {
		const currTrack = libraryCatalogRef[i];
		const genreArr = libraryCatalogRef[i].genre.split(', ');
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
		let cardCover = value.artworks[Math.floor(Math.random() * value.artworks.length)];
		// generation with no parameters
		let genre;
		if (key == '') {
			genre = 'Unknown Genre';
		} else {
			genre = key;
		}
		if (cardCover == '' || cardCover == undefined) {
			cardCover = '../img/artwork-default.png';
		}
		const card = `
    <div class="library-card library-card-genre" data-libtarget="${key}">
      <div class="library-card-artwork">
        <img src=${cardCover} alt="">
      </div>
      <div class="library-card-info">
        <div>${genre}</div>
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
 * @param {list} tags  - a set of four random tags in the library Catalog to generate cards for
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
	for (let i = 0; i < libraryCatalogRef.length; i++) {
		const currTrack = libraryCatalogRef[i];
		const tagArr = libraryCatalogRef[i].tags.split(', ');
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
		let cardCover = value.artworks[Math.floor(Math.random() * value.artworks.length)];
		// generate default info
		let tag;
		if (key == '') {
			tag = 'Unassigned';
		} else {
			tag = key;
		}
		if (cardCover == '' || cardCover == undefined) {
			cardCover = '../img/artwork-default.png';
		}
		const card = `
    <div class="library-card library-card-tag" data-libtarget="${key}">
      <div class="library-card-artwork">
        <img src=${cardCover} alt="">
      </div>
      <div class="library-card-info">
        <div>${tag}</div>
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
	for (let i = 0; i < libraryCatalogRef.length; i++) {
		if (libraryCatalogRef[i].album === cardAlbum) {
			data.push(libraryCatalogRef[i]);
		}
	}

	// Generate album grid
	await domAPI.setHTML('header-title', `Library`);
	await domAPI.setHTML('home', '');
	await domAPI.setHTML('header-subtitle', `Library > Tags > ${cardAlbum}`);
	await domAPI.addGrid('home-grid', libraryHeaders, data, gridSettings, 'playlists');
}

/**
 * @description Libarary > Artists Extended Page. Generate Artist Library View based on user selection.
 * @param {object} e The HTML element this event listener is attached to.
 */
async function libraryArtistsExtended(e) {
	const cardArtist = e.getAttribute('data-libtarget');

	// Set grid rows
	const data = [];
	for (let i = 0; i < libraryCatalogRef.length; i++) {
		if (libraryCatalogRef[i].artist === cardArtist) {
			data.push(libraryCatalogRef[i]);
		}
	}

	// Generate artist grid
	await domAPI.setHTML('header-title', `Library`);
	await domAPI.setHTML('home', '');
	await domAPI.setHTML('header-subtitle', `Library > Tags > ${cardArtist}`);
	await domAPI.addGrid('home-grid', libraryHeaders, data, gridSettings);
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
	for (let i = 0; i < libraryCatalogRef.length; i++) {
		const genreArr = libraryCatalogRef[i].genre.split(', ');
		for (let j = 0; j < genreArr.length; j++) {
			if (genreArr[j] === cardGenre) {
				data.push(libraryCatalogRef[i]);
				break;
			}
		}
	}

	await domAPI.setHTML('header-title', `Library`);
	await domAPI.setHTML('home', '');
	await domAPI.setHTML('header-subtitle', `Library > Tags > ${cardGenre}`);
	await domAPI.addGrid('home-grid', libraryHeaders, data, gridSettings);
}

/**
 * @description Library > Tags Extended Page. Generate Tag Library View based on user selection.
 * @param {object} e The HTML element this event listener is attached to.
 */
async function libraryTagsExtended(e) {
	const cardTag = e.getAttribute('data-libtarget');

	// Set grid rows
	const data = [];
	for (let i = 0; i < libraryCatalogRef.length; i++) {
		const tagsSplit = libraryCatalogRef[i].tags.split(', ');
		for (let j = 0; j < tagsSplit.length; j++) {
			if (tagsSplit[j] === cardTag) {
				data.push(libraryCatalogRef[i]);
				break;
			}
		}
	}

	// Generate tag grid
	await domAPI.setHTML('header-title', `Library`);
	await domAPI.setHTML('home', '');
	await domAPI.setHTML('header-subtitle', `Library > Tags > ${cardTag}`);
	await domAPI.addGrid('home-grid', libraryHeaders, data, gridSettings);
}

/**
 * @description this function should be called if you have an empty library. It will display some friendly
 * text telling the user to go add a watched folder.
 */
async function emptyLibrary() {
	const friendlyText = `<h2>Looks like you don't have any songs in your library :(</h2>
		<p>To add songs, go into the settings and add a folder with songs in it.</p>`;
	await domAPI.setHTML('home', friendlyText);
}
