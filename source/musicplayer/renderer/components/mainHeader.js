window.addEventListener('DOMContentLoaded', async () => {
    await domAPI.addEventListener('btn-file', 'change', getFile);
    await domAPI.addEventListener('btn-playlist-create', 'click', createPlaylist);
    await domAPI.addEventListener('btn-playlist-add', 'click', addToPlaylist);
    await domAPI.addEventListener('btn-meta', 'click', editMetaData);
});

/**
 * Create playlist for user
 * @param {HTMLElement} element
 */
function createPlaylist(element) {
    alert('*FUNCTION UNDER CONTRUCTION*');
}

/**
 * Add track to playlist for user
 * @param {HTMLElement} element
 */
function addToPlaylist(element) {
    alert('*FUNCTION UNDER CONTRUCTION*');
}

/**
 * Edit Metadata for user
 * @param {HTMLElement} element
 */
function editMetaData(element) {
    alert('*FUNCTION UNDER CONTRUCTION*');
}

// Get file from user
let currFileList;

/**
 * Calllback function for when a file is passed into the input.
 * @param {HTMLElement} element
 */
function getFile(element) {
    currFileList = element.target.files;
    console.log(currFileList);
}

// TODO: Use file to add to app library
