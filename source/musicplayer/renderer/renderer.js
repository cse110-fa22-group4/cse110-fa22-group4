
// Creates an onLoad function.
window.addEventListener('DOMContentLoaded', () => {
    domAPI.managedAddEventListener('my-button', 'click', onButtonClick);

    $('#subpage').load("./../html/subpage.html");
});

/**
 * An example function that demonstrates an event listener that can be entered into the
 * managedAddEventListener. Must have 'element' as a parameter.
 * While it isn't necessary, as with access to the DOM element one can get and set attributes directly,
 * this function also gives and example of how to get and set attributes through the domAPI.
 * @param {HTMLElement} element The element that this event listener is attached to.
 */
function onButtonClick(element) {
    let attribute = domAPI.managedGetAttribute('my-button', 'data-value');
    attribute = parseInt(attribute, 10) + 1; // here we must be confident that attribute is a decimal!
    domAPI.managedSetAttribute('my-button', 'data-value', attribute.toString());
    element.innerText = `I have been pressed ${attribute} times!`;

}