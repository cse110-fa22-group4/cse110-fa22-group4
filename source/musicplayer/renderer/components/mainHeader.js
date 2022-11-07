window.addEventListener('DOMContentLoaded', () => {
  jqAPI.onEvent('body', 'change', '#btn-file', getFile);
  jqAPI.onEvent('body', 'click', '#btn-playlist-create', createPlaylist);
  jqAPI.onEvent('body', 'click', '#btn-playlist-add', addToPlaylist);
  jqAPI.onEvent('body', 'click', '#btn-meta', editMetaData);


});

// Create playlist for user
function createPlaylist(element) {
  alert('*FUNCTION UNDER CONTRUCTION*')
}

// Add track to playlist for user
function addToPlaylist(element) {
  alert('*FUNCTION UNDER CONTRUCTION*')
}

// Edit Metadata for user
function editMetaData(element) {
  alert('*FUNCTION UNDER CONTRUCTION*')
}

// Get file from user
let currFileList;

function getFile(element) {
  currFileList = element.target.files;
  console.log(currFileList);
}

// TODO: Use file to add to app library