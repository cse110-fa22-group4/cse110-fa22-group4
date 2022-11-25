window.addEventListener('metaEditor-loaded', async () => {
	await domAPI.addEventListener('btn-metaEdit-save', 'click', saveMetadata);
});


/**
 * Save metadata
 * @param {HTMLElement} element
 */
async function saveMetadata(element) {
	// TODO: Implement saving metadata function
	alert('*FUNCTION UNDER CONSTRUCTION*');
	const inputMeta = await getMetaFromFields();

	await ffmpegAPI.ffmpegWrite('file', inputMeta);
}

/**
 * @return {Promise<Object>}
 */
async function getMetaFromFields() {
	const retVal = {};

	return retVal;
}

/**
 * @return {Promise<Object>} Returns an object that can be used to fill a Grid.JS form
 */
async function getMetaForFields() {

}
