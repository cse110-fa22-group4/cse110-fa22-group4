const {ipcRenderer} = require('electron');

// Ensures that an event is not established multiple times by accident.
const establishedEvents = {};


/**
 * @name managedSetHTML
 * @memberOf domAPI
 * @description Sets the inner html of an element, if it is deemed 'safe.'
 * @param {string} domID The 'id' tag that the element has in the html.
 * @param {string} html The html to set to for the element.
 */
function managedSetHTML(domID, html) {
    const isAttributeSafe = ipcRenderer.invoke(
        'managedAttributeCheck', domID, 'innerHTML');
    if (isAttributeSafe) {
        document.getElementById(domID).innerHTML = html;
    }
}

/**
 * @name managedAddEventListener
 * @memberOf domAPI
 * @description Adds an event listener to an element, if it exists and is
 * deemed 'safe.'
 * @param {string} domID The 'id' tag that the element has in the html.
 * @param {string} event The event that is to be assigned.
 * @param {function} func The function that will run when the event triggers.
 */
function managedAddEventListener(domID, event, func) {
    const isEventSafe = ipcRenderer.invoke(
        'managedAddEventListenerCheck', domID, event);
    const element = document.getElementById(domID);
    if (!(domID in establishedEvents)) {
        establishedEvents[domID] = [];
    }
    if (isEventSafe && !(event in establishedEvents[domID])) {
        element.addEventListener(event, () => {
            func(element);
        }, false);
        establishedEvents[domID].push(event);
    }
}

/**
 * @name managedGetAttribute
 * @memberOf domAPI
 * @description Gets the attribute of a given domID, if it exists and is
 * deemed 'safe.'
 * @param {string} domID The 'id' tag that the element has in the html.
 * @param {string} attribute The attribute to get from the element.
 * @return {object | undefined} The attribute if the getter is successful,
 * else undefined if either the attribute or element does not exist,
 *          or if the attribute is deemed 'unsafe.'
 */
function managedGetAttribute(domID, attribute) {
    const isAttributeSafe = ipcRenderer.invoke(
        'managedAttributeCheck', domID, attribute);
    if (isAttributeSafe) {
        return document.getElementById(domID).getAttribute(attribute);
    } else {
        return undefined;
    }
}

/**
 * @name managedSetAttribute
 * @memberOf domAPI
 * @description Sets the attribute of a given domID, if it exists and is
 * deemed 'safe.'
 * @param {string} domID The 'id' tag that the element has in the html.
 * @param {string} attribute The attribute to set on the element.
 * @param {string} value The value to set the attribute to.
 */
function managedSetAttribute(domID, attribute, value) {
    const isAttributeSafe = ipcRenderer.invoke(
        'managedAttributeCheck', domID, attribute);
    if (isAttributeSafe) {
        document.getElementById(domID).setAttribute(attribute, value);
    }
}

/**
 * @name managedAddChild
 * @memberOf domAPI
 * @description Adds a child to the given element with the domID.
 * @param {string} domID The 'id' tag that the element has in the html.
 * @param {HTMLElement} child The child html element to add.
 */
function managedAddChild(domID, child) {
    const isChildSafe = ipcRenderer.invoke('managedChildCheck', domID);
    if (isChildSafe) {
        document.getElementById(domID).appendChild(child);
    }
}

/**
 * @name managedSetStyle
 * @memberOf domAPI
 * @description Sets a css style to a given value if it is deemed 'safe.'
 * @param {string} domID The 'id' tag that the element has in the html.
 * @param {string} style The style to change.
 * @param {string} value The value to set the style to.
 */
function managedSetStyle(domID, style, value) {
    const isChildSafe = ipcRenderer.invoke('managedChildCheck', domID);
    if (isChildSafe) {
        document.getElementById(domID).style[style] = value;
    }
}

/**
 * @name managedGetValue
 * @memberOf domAPI
 * @description Gets the value of a given domID, if it exists and
 * is deemed 'safe.'
 * @param {string} domID The 'id' tag that the element has in the html.
 * @param {string} value The value to get from the element.
 * @return {object | undefined} The value if the getter is successful, else
 * undefined if either the value or element does not exist,
 *          or if the value is deemed 'unsafe.'
 *
 */
function managedGetValue(domID, value) {
    const isValueSafe = ipcRenderer.invoke('managedValueCheck', domID, value);
    if (isValueSafe) {
        return document.getElementById(domID).value;
    } else {
        return undefined;
    }
}

/**
 * @name createLibraryEntry
 * @memberOf domAPI
 * @description Creates a HTML element that contains all style and syntax
 * for a custom line in the library homepage.
 * @param {string} divID
 * @param {string} title
 * @param {string} artist
 * @param {string} album
 * @param {string} duration
 * @param {string} year
 * @param {string} genre
 * @param {string} writer
 * @param {string} producer
 * @param {string} tags
 * @return {HTMLElement} The library line HTML element.
 *
 * @todo: This should be a HTML template file!
 */
function createLibraryEntry(divID = '',
    title = '',
    artist = '',
    album = '',
    duration = '',
    year = '',
    genre = '',
    writer = '',
    producer = '',
    tags = '') {
    const elem = document.createElement('div');
    elem.setAttribute('class', 'library-track');

    const trackNum = document.createElement('div');
    trackNum.setAttribute('class', 'library-track-num');
    elem.appendChild(trackNum);

    const trackTitle = document.createElement('div');
    trackTitle.setAttribute('class', 'library-track-title');
    trackTitle.innerHTML = title;
    elem.appendChild(trackTitle);

    const trackArtist = document.createElement('div');
    trackArtist.setAttribute('class', 'library-track-artist');
    trackArtist.innerHTML = artist;
    elem.appendChild(trackArtist);

    const trackAlbum = document.createElement('div');
    trackAlbum.setAttribute('class', 'library-track-album');
    trackAlbum.innerHTML = album;
    elem.appendChild(trackAlbum);

    const trackDuration = document.createElement('div');
    trackDuration.setAttribute('class', 'library-track-duration');
    trackDuration.innerHTML = duration;
    elem.appendChild(trackDuration);

    const trackYear = document.createElement('div');
    trackYear.setAttribute('class', 'library-track-year');
    trackYear.innerHTML = year;
    elem.appendChild(trackYear);

    const trackGenre = document.createElement('div');
    trackGenre.setAttribute('class', 'library-track-genre');
    trackGenre.innerHTML = genre;
    elem.appendChild(trackGenre);

    const trackWriter = document.createElement('div');
    trackWriter.setAttribute('class', 'library-track-writer');
    trackWriter.innerHTML = writer;
    elem.appendChild(trackWriter);

    const trackProducer = document.createElement('div');
    trackProducer.setAttribute('class', 'library-track-producer');
    trackProducer.innerHTML = producer;
    elem.appendChild(trackProducer);

    const trackTags = document.createElement('div');
    trackTags.setAttribute('class', 'library-track-tags');
    trackTags.innerHTML = tags;
    elem.appendChild(trackTags);

    return elem;
}

module.exports = {
    managedAddEventListener,
    managedGetAttribute,
    managedSetAttribute,
    managedAddChild,
    managedSetHTML,
    managedSetStyle,
    managedGetValue,
    createLibraryEntry,
};
