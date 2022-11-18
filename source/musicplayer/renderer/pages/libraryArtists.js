let libraryArtistGrid;

window.addEventListener('libraryArtists-loaded', async () => {
  await domAPI.addEventListener('btn-library-extended', 'click', libraryExtendedExample);
});

window.addEventListener('library-container-grid-clicked', async (args) => {
	console.log(args['detail']);
	console.log(libraryArtistGrid);
});

/**
 * EXAMPLE - Sample UI of a library subcategory landing page.
 */
 async function libraryExtendedExample() {

	// GridJS - USAGE EXAMPLE

  // Set grid headers - Sample Headers from sampleLibrary.js
	const columns = libraryHeaders;

  // Set grid rows
	const data = [
    { '#': '01', title: 'Future Nostalgia',       artist: 'Dua Lipa', album: 'Future Nostalgia', year: '2020', duration: '3:05', genre: 'Dance, Pop', playlists: 'Monday Songs, Summer Mix', tags: 'Party, Summer'},
    { '#': '02', title: 'Don\'t Start Now',       artist: 'Dua Lipa', album: 'Future Nostalgia', year: '2020', duration: '3:03', genre: 'Dance, Pop', playlists: 'Monday Songs, Summer Mix', tags: 'Party, Summer'},
    { '#': '03', title: 'Cool',                   artist: 'Dua Lipa', album: 'Future Nostalgia', year: '2020', duration: '3:30', genre: 'Dance, Pop', playlists: 'Monday Songs, Summer Mix', tags: 'Party, Summer'},
    { '#': '04', title: 'Physical',               artist: 'Dua Lipa', album: 'Future Nostalgia', year: '2020', duration: '3:14', genre: 'Dance, Pop', playlists: 'Monday Songs, Summer Mix', tags: 'Party, Summer'},
    { '#': '05', title: 'Levitating',             artist: 'Dua Lipa', album: 'Future Nostalgia', year: '2020', duration: '3:24', genre: 'Dance, Pop', playlists: 'Monday Songs, Summer Mix', tags: 'Party, Summer'},
    { '#': '06', title: 'Pretty Please',          artist: 'Dua Lipa', album: 'Future Nostalgia', year: '2020', duration: '3:15', genre: 'Dance, Pop', playlists: 'Monday Songs, Summer Mix', tags: 'Party, Summer'},
    { '#': '07', title: 'Hallucinate',            artist: 'Dua Lipa', album: 'Future Nostalgia', year: '2020', duration: '3:29', genre: 'Dance, Pop', playlists: 'Monday Songs, Summer Mix', tags: 'Party, Summer'},
    { '#': '08', title: 'Love Again',             artist: 'Dua Lipa', album: 'Future Nostalgia', year: '2020', duration: '4:18', genre: 'Dance, Pop', playlists: 'Monday Songs, Summer Mix', tags: 'Party, Summer'},
    { '#': '09', title: 'Break My Heart',         artist: 'Dua Lipa', album: 'Future Nostalgia', year: '2020', duration: '3:42', genre: 'Dance, Pop', playlists: 'Monday Songs, Summer Mix', tags: 'Party, Summer'},
    { '#': '10', title: 'Good In Bed (Explicit)', artist: 'Dua Lipa', album: 'Future Nostalgia', year: '2020', duration: '3:39', genre: 'Dance, Pop', playlists: 'Monday Songs, Summer Mix', tags: 'Party, Summer'},
    { '#': '11', title: 'Boys Will Be Boys',      artist: 'Dua Lipa', album: 'Future Nostalgia', year: '2020', duration: '2:46', genre: 'Dance, Pop', playlists: 'Monday Songs, Summer Mix', tags: 'Party, Summer'},

    { '#': '01', title: 'Genesis', artist: 'Dua Lipa', album: 'Dua Lipa', year: '2017', duration: '3:27', genre: 'Electronic, Pop', playlists: 'Summer Mix', tags: 'Jams'},
    { '#': '02', title: 'Lost In Your Light', artist: 'Dua Lipa', album: 'Dua Lipa', year: '2017', duration: '3:24', genre: 'Electronic, Pop', playlists: 'Summer Mix', tags: 'Jams'},
    { '#': '03', title: 'Hotter Than Hell', artist: 'Dua Lipa', album: 'Dua Lipa', year: '2017', duration: '3:10', genre: 'Electronic, Pop', playlists: 'Summer Mix', tags: 'Jams'},
    { '#': '04', title: 'Be The One', artist: 'Dua Lipa', album: 'Dua Lipa', year: '2017', duration: '3:25', genre: 'Electronic, Pop', playlists: 'Summer Mix', tags: 'Jams'},
    { '#': '05', title: 'IDGAF', artist: 'Dua Lipa', album: 'Dua Lipa', year: '2017', duration: '3:38', genre: 'Electronic, Pop', playlists: 'Summer Mix', tags: 'Jams'},
    { '#': '06', title: 'Blow Your Mind (Mwah)', artist: 'Dua Lipa', album: 'Dua Lipa', year: '2017', duration: '2:59', genre: 'Electronic, Pop', playlists: 'Summer Mix', tags: 'Jams'},
    { '#': '07', title: 'Garden', artist: 'Dua Lipa', album: 'Dua Lipa', year: '2017', duration: '3:48', genre: 'Electronic, Pop', playlists: 'Summer Mix', tags: 'Jams'},
    { '#': '08', title: 'No Goodbyes', artist: 'Dua Lipa', album: 'Dua Lipa', year: '2017', duration: '3:36', genre: 'Electronic, Pop', playlists: 'Summer Mix', tags: 'Jams'},
    { '#': '09', title: 'Thinking \'Bout You', artist: 'Dua Lipa', album: 'Dua Lipa', year: '2017', duration: '2:53', genre: 'Electronic, Pop', playlists: 'Summer Mix', tags: 'Jams'},
    { '#': '10', title: 'New Rules', artist: 'Dua Lipa', album: 'Dua Lipa', year: '2017', duration: '3:32', genre: 'Electronic, Pop', playlists: 'Summer Mix', tags: 'Jams'},
    { '#': '11', title: 'Begging', artist: 'Dua Lipa', album: 'Dua Lipa', year: '2017', duration: '3:14', genre: 'Electronic, Pop', playlists: 'Summer Mix', tags: 'Jams'},
    { '#': '12', title: 'Homesick', artist: 'Dua Lipa', album: 'Dua Lipa', year: '2017', duration: '3:50', genre: 'Electronic, Pop', playlists: 'Summer Mix', tags: 'Jams'},
	];

  // Set grid settings
	const gridSettings = {
		sort: true,
    // resizable: true,   - doesn't seem to work
    // fixedHeader: true, - doesn't seem to work
    // autoWidth: true,   - doesn't seem to work
		search: {
			enabled: true,
      keyword: '',
		},
	};

	libraryArtistGrid = await domAPI.addGrid('library-artists-container', columns, data, gridSettings);
	await domAPI.setHTML('library-artists-cards', '');
  await domAPI.setHTML('header-subtitle', 'Dua Lipa');
 }