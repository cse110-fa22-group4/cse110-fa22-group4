window.addEventListener('metaEditor-loaded', async () => {
	await domAPI.addEventListener('btn-metaEdit-save', 'click', saveMetadata);
});


/**
 * Save metadata
 * @param {HTMLElement} element
 */
 function saveMetadata(element) {
  // TODO: Implement saving metadata function
	alert('*FUNCTION UNDER CONTRUCTION*');
}