window.addEventListener('library-loaded', () => {
  onLibraryLoad();
});

/**
 * Function that is called on library load.
 */
async function onLibraryLoad() {

  // GridJS - USAGE EXAMPLE
  let columns = ['#', 'TITLE', 'ARTIST', 'ALBUM', 'YEAR', 'DURATION', 'GENRE', 'PLAYLISTS', 'TAGS'];

  let data = [
    ['01', 'Future Nostalgia', 'Dua Lipa', 'Future Nostalgia', '2020', '3:05', 'Dance, Pop', 'Monday Songs, Summer Mix', 'Party, Summer',],
    ['02', 'Don\'t Start Now', 'Dua Lipa', 'Future Nostalgia', '2020', '3:03', 'Dance, Pop', 'Monday Songs, Summer Mix', 'Party, Summer',],
    ['03', 'Cool', 'Dua Lipa', 'Future Nostalgia', '2020', '3:00', 'Dance, Pop', 'Monday Songs, Summer Mix', 'Party, Summer',],
    ['04', 'Physical', 'Dua Lipa', 'Future Nostalgia', '2020', '3:14', 'Dance, Pop', 'Monday Songs, Summer Mix', 'Party, Summer',],
    ['05', 'Levitating', 'Dua Lipa', 'Future Nostalgia', '2020', '3:24', 'Dance, Pop', 'Monday Songs, Summer Mix', 'Party, Summer',],
    ['06', 'Pretty Please', 'Dua Lipa', 'Future Nostalgia', '2020', '3:15', 'Dance, Pop', 'Monday Songs, Summer Mix', 'Party, Summer',],
    ['07', 'Hallucinate', 'Dua Lipa', 'Future Nostalgia', '2020', '3:29', 'Dance, Pop', 'Monday Songs, Summer Mix', 'Party, Summer',],
    ['08', 'Love Again', 'Dua Lipa', 'Future Nostalgia', '2020', '4:18', 'Dance, Pop', 'Monday Songs, Summer Mix', 'Party, Summer',],
    ['09', 'Break My Heart', 'Dua Lipa', 'Future Nostalgia', '2020', '3:32', 'Dance, Pop', 'Monday Songs, Summer Mix', 'Party, Summer',],
    ['10', 'Good In Bed', 'Dua Lipa', 'Future Nostalgia', '2020', '3:39', 'Dance, Pop', 'Monday Songs, Summer Mix', 'Party, Summer',],
    ['11', 'Boys Will Be Boys', 'Dua Lipa', 'Future Nostalgia', '2020', '2:46', 'Dance, Pop', 'Monday Songs, Summer Mix', 'Party, Summer',],

    ['01', 'United In Grief', 'Kendrick Lamar', 'Mr. Morale & The Big Steppers', '2022', '4:15', 'Hip-Hop', 'Monday Songs', 'Conscious, Melodic',],
    ['02', 'N95', 'Kendrick Lamar', 'Mr. Morale & The Big Steppers', '2022', '3:15', 'Hip-Hop', 'Monday Songs', 'Conscious, Melodic',],
    ['03', 'Worldwide Steppers', 'Kendrick Lamar', 'Mr. Morale & The Big Steppers', '2022', '3:23', 'Hip-Hop', 'Monday Songs', 'Conscious, Melodic',],
    ['04', 'Die Hard', 'Kendrick Lamar', 'Mr. Morale & The Big Steppers', '2022', '3:59', 'Hip-Hop', 'Monday Songs', 'Conscious, Melodic',],
    ['05', 'Father Time (feat. Sampha)', 'Kendrick Lamar', 'Mr. Morale & The Big Steppers', '2022', '3:42', 'Hip-Hop', 'Monday Songs', 'Conscious, Melodic',],
    ['06', 'Rich - Interlude', 'Kendrick Lamar', 'Mr. Morale & The Big Steppers', '2022', '1:43', 'Hip-Hop', 'Monday Songs', 'Conscious, Melodic',],
    ['07', 'Rich Spirit', 'Kendrick Lamar', 'Mr. Morale & The Big Steppers', '2022', '3:22', 'Hip-Hop', 'Monday Songs', 'Conscious, Melodic',],
    ['08', 'We Cry Together', 'Kendrick Lamar', 'Mr. Morale & The Big Steppers', '2022', '5:41', 'Hip-Hop', 'Monday Songs', 'Conscious, Melodic',],
    ['09', 'Purple Hearts', 'Kendrick Lamar', 'Mr. Morale & The Big Steppers', '2022', '5:29', 'Hip-Hop', 'Monday Songs', 'Conscious, Melodic',]
  ];

  let gridSettings = { 
    sort: true, 
    search: { enabled: true } 
  };

  await domAPI.addGrid('library-container', columns, data, gridSettings);

}
