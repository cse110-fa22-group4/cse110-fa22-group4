// If one is using intellisense, you may notice that domAPI is recognized to be an error, as it is unresolved.
// This appears to be an active issue with electron, and can be safely ignored. This does compile correctly,
// however during development one's code complete and intellisense will be limited. I am looking into a fix
// for this now, I think there is one, and I will add it when I find it. - Liam

// Creates an onLoad function.
window.addEventListener('DOMContentLoaded', () => {
    window.domAPI.managedAddEventListener('my-button', 'click', onButtonClick);
});

/**
 * An example function that demonstrates an event listener that can be entered into the
 * managedAddEventListener. Must have 'element' as a parameter.
 * While it isn't necessary, as with access to the DOM element one can get and set attributes directly,
 * this function also gives and example of how to get and set attributes through the domAPI.
 * @param element The element that this event listener is attached to.
 */
function onButtonClick(element) {
    let attribute = window.domAPI.managedGetAttribute('my-button', 'data-value');
    attribute = parseInt(attribute, 10) + 1; // here we must be confident that attribute is a decimal!
    window.domAPI.managedSetAttribute('my-button', 'data-value', attribute);
    element.innerText = `I have been pressed ${attribute} times!`;
}