window.addEventListener('library-loaded', async () => {
	await onLibraryLoad();
});
window.addEventListener('library-container-grid-clicked', async (args) => {
	console.log(args['detail']);
	console.log(grid);
});
let grid = undefined;

/**
 * Function that is called on library load.
 */
async function onLibraryLoad() {
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
		['01', 'United In Grief', 'Kendrick Lamar', 'Mr. Morale & The Big Steppers', '2022', '4:15',
			'Hip-Hop', 'Monday Songs', 'Conscious, Melodic', 'test'],
		['02', 'N95', 'Kendrick Lamar', 'Mr. Morale & The Big Steppers', '2022', '3:15', 'Hip-Hop',
			'Monday Songs', 'Conscious, Melodic', 'test'],
		['03', 'Worldwide Steppers', 'Kendrick Lamar', 'Mr. Morale & The Big Steppers', '2022', '3:23',
			'Hip-Hop', 'Monday Songs', 'Conscious, Melodic', 'test'],
		['04', 'Die Hard', 'Kendrick Lamar', 'Mr. Morale & The Big Steppers', '2022', '3:59', 'Hip-Hop',
			'Monday Songs', 'Conscious, Melodic', 'test'],
		['05', 'Father Time (feat. Sampha)', 'Kendrick Lamar', 'Mr. Morale & The Big Steppers', '2022',
			'3:42', 'Hip-Hop', 'Monday Songs', 'Conscious, Melodic', 'test'],
		['06', 'Rich - Interlude', 'Kendrick Lamar', 'Mr. Morale & The Big Steppers', '2022', '1:43',
			'Hip-Hop', 'Monday Songs', 'Conscious, Melodic', 'test'],
		['07', 'Rich Spirit', 'Kendrick Lamar', 'Mr. Morale & The Big Steppers', '2022', '3:22', 'Hip-Hop',
			'Monday Songs', 'Conscious, Melodic', 'test'],
		['08', 'We Cry Together', 'Kendrick Lamar', 'Mr. Morale & The Big Steppers', '2022', '5:41',
			'Hip-Hop', 'Monday Songs', 'Conscious, Melodic', 'test'],
		['09', 'Purple Hearts', 'Kendrick Lamar', 'Mr. Morale & The Big Steppers', '2022', '5:29', 'Hip-Hop',
			'Monday Songs', 'Conscious, Melodic', 'test'],
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
			keyword: 'Future',
		},
	};

	grid = await domAPI.addGrid('library-container', columns, data, gridSettings);
}
