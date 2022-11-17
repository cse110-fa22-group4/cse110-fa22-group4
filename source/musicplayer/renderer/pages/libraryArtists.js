let libraryArtistGrid;

window.addEventListener('libraryArtists-loaded', async () => {
  await domAPI.addEventListener('btn-library-extended', 'click', libraryExtendedExample);
});

window.addEventListener('library-container-grid-clicked', async (args) => {
	console.log(args['detail']);
	console.log(grid);
});

/**
 * EXAMPLE - Sample UI of a library subcategory landing page.
 */
 async function libraryExtendedExample() {

	// GridJS - USAGE EXAMPLE
	const columns = ['#', 'TITLE', 'ARTIST', 'ALBUM', 'YEAR', 'DURATION', 'GENRE', 'PLAYLISTS', 'TAGS',
		{name: '', hidden: true}];

	const data = [
		['01', 'Future Nostalgia', 'Dua Lipa', 'Future Nostalgia', '2020', '3:05',
			'Dance, Pop', 'Monday Songs, Summer Mix', 'Party, Summer', 'test'],
		['02', 'Don\'t Start Now', 'Dua Lipa', 'Future Nostalgia', '2020', '3:03',
			'Dance, Pop', 'Monday Songs, Summer Mix', 'Party, Summer', 'test'],
		['03', 'Cool', 'Dua Lipa', 'Future Nostalgia', '2020', '3:00', 'Dance, Pop',
			'Monday Songs, Summer Mix', 'Party, Summer', 'test'],
		['04', 'Physical', 'Dua Lipa', 'Future Nostalgia', '2020', '3:14', 'Dance, Pop',
			'Monday Songs, Summer Mix', 'Party, Summer', 'test'],
		['05', 'Levitating', 'Dua Lipa', 'Future Nostalgia', '2020', '3:24', 'Dance, Pop',
			'Monday Songs, Summer Mix', 'Party, Summer', 'test'],
		['06', 'Pretty Please', 'Dua Lipa', 'Future Nostalgia', '2020', '3:15', 'Dance, Pop',
			'Monday Songs, Summer Mix', 'Party, Summer', 'test'],
		['07', 'Hallucinate', 'Dua Lipa', 'Future Nostalgia', '2020', '3:29', 'Dance, Pop',
			'Monday Songs, Summer Mix', 'Party, Summer', 'test'],
		['08', 'Love Again', 'Dua Lipa', 'Future Nostalgia', '2020', '4:18', 'Dance, Pop',
			'Monday Songs, Summer Mix', 'Party, Summer', 'test'],
		['09', 'Break My Heart', 'Dua Lipa', 'Future Nostalgia', '2020', '3:32', 'Dance, Pop',
			'Monday Songs, Summer Mix', 'Party, Summer', 'test'],
		['10', 'Good In Bed', 'Dua Lipa', 'Future Nostalgia', '2020', '3:39', 'Dance, Pop',
			'Monday Songs, Summer Mix', 'Party, Summer', 'test'],
		['11', 'Boys Will Be Boys', 'Dua Lipa', 'Future Nostalgia', '2020', '2:46', 'Dance, Pop',
			'Monday Songs, Summer Mix', 'Party, Summer', 'test'],
	];

	const gridSettings = {
		sort: true,
		search: {
			enabled: true,
			ignoreHiddenColumns: false,
			selector: (cell, rowIndex, cellIndex) => {
				if (cellIndex === 1) console.log(cell);
				return cell;
			},
			keyword: '',
		},
	};

	libraryArtistGrid = await domAPI.addGrid('library-artists-container', columns, data, gridSettings);
	await domAPI.setHTML('library-artists-cards', '');
  await domAPI.setHTML('header-subtitle', 'Dua Lipa');
 }