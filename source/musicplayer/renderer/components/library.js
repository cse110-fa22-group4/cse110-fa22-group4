window.addEventListener('library-loaded', () => {
    onLibraryLoad();
});

/**
 * Function that is called on library load.
 */
function onLibraryLoad() {
    const libraryDivID = 'library-track-container';
    const songs = fsAPI.getSongs();
    for (const i in songs) {
        if (!i) continue;
        const song = songs[i];
        const data = song['format']['tags'];
        if (data === undefined) continue;
        const title = data['title'] ? data['title'] : '---------';
        const artist = data['album_artist'] ? data['album_artist'] : '---------';
        const album = data['album'] ? data['album'] : '---------';
        const duration = song['duration'] ? song['duration'] : '---------';
        const year = data['date'] ? data['date'] : '---------';
        const genre = data['genre'] ? data['genre'] : '---------';
        const writer = data['writer'] ? data['writer'] : '---------';
        const producer = data['composer'] ? data['composer'] : '---------';
        const tags = data['encoder'] ? data['encoder'] : '---------';

        const line = domAPI.createLibraryEntry(i, title, artist, album, duration, year, genre, writer, producer, tags);
        domAPI.managedAddChild(libraryDivID, line);
    }
}
