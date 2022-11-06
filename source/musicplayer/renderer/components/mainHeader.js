window.addEventListener('DOMContentLoaded', () => {
  jqAPI.onEvent('body', 'change', '#btn-file', getFile);
});

let currFileList;

// Get file from user
function getFile(element) {
  currFileList = element.target.files;
  console.log(currFileList);
}