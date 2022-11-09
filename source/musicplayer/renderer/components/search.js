window.addEventListener('searchbarSearch', async (event) => {
    const query = event.detail;
    console.log(await findCategories(query, ['duration'], ['title', 'album_artist', 'genre']));
});


/**
 * This is a reference to an ongoing async filter process, which can be cancelled and overwritten.
 * @type {function}
 */
let ongoingSearchProcess
/**
 *
 * @param {string} query query to find
 * @param {object} categories top level categories to search
 * @param {object} tagCategories tag categories to search
 * @description this entire function is garbage. categories should not be separate, query should be a list of queries
 * (or a single query that is a string of space separated queries, we should search each word separately)
 * and should prioritize more matches (2 matches in 3 queries > 1 match in 3 queries)
 * filters should be: <br> minimal distance between matches (optional) > # matches > location of match
 * (index % of length) > alphabetical order <br> these filters can be easily accomplished by nesting arrays
 * (alphabetical order is separate)
 * @todo this entire function needs to be redone for many reasons.
 */
async function findCategories(query, categories, tagCategories) {
    let songs = fsAPI.getSongs();
    let results = { };
    for (let i in songs) {
        let song = songs[i];
        let data = song['format'];
        if (data === undefined) continue;
        categories.forEach(cat =>  {
            if (data[cat]) {
                if (!results[cat]) results[cat] = [];
                if (!(data[cat] in results[cat])) {
                    if (data[cat].includes(query)) {
                        results[cat].push(data[cat]); //mimic set functionality
                    }
                }
            }
        });
        if (!data['tags']) continue;
        tagCategories.forEach(tcat =>  {
            if (data['tags'][tcat]) {
                if (!results[tcat]) results[tcat] = [];
                if (!(data['tags'][tcat] in results[tcat])) {
                    if (data['tags'][tcat].includes(query)) {
                        results[tcat].push(data['tags'][tcat]);
                    }
                }
            }
        });
    }
    return results;
}