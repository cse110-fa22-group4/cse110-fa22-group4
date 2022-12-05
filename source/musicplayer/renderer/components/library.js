window.addEventListener('library-loaded', async () => {
	await onLibraryLoad();
});

window.addEventListener('library-container-row-clicked', async (args) => {
    // NOTE: click a row seems way too sensitive for practical use,
    // will probably not end up using
	// console.log(args['detail']);
});

window.addEventListener('library-container-queue-clicked', async (args) => {
    const trackObj = args['detail']; 
	console.log(trackObj);

    // send track to playback queue
    // playback integration edit
    if (queueArr.length === 0) {
        initFirstSong([trackObj]);
        initProgress([trackObj]);
        initInfo([trackObj]);
    }
    queueArr.push(trackObj);

    // send user feedback
    await giveUserFeedback('Added to Queue')

    await refreshQueueViewer();
});


/**
 * @name onLibraryLoad
 * @description Initial load of library page, loads grid view of song library.
 * @return {Promise<void>}
 */
async function onLibraryLoad() {
	await domAPI.setHTML('library-container', '');
	const trackList = await fsAPI.getSongsTrackData();

    // TODO: temporary old version implementation, is bugged atm
    // if(searchQueryGlobal.length !== 0) {
    //     const searchSettings = {
    //         sort: true,
    //         resizable: true,
    //         fixedHeader: true,
    //         autoWidth: false,
    //         width: '100%',
    //         search: {
    //             enabled: true,
    //             keyword: searchQueryGlobal,
    //         },
    //     };
    //     await domAPI.addGrid('library-container', libraryHeaders, trackList, searchSettings);
    // } else {
	    await domAPI.addGrid('library-container', libraryHeaders, trackList, gridSettings);
    // }
}
