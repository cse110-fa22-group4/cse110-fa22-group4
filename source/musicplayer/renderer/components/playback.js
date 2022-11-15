/* GLOBAL VARS */
let isPaused = true;      // track pause action
let shuffleIsOn = false;  // track shuffle action
let repeatIsOn = false;   // track repeat action
let isMuted = false;      // track mute action

window.addEventListener('playback-loaded', async () => {
  await domAPI.addEventListener('playback-artwork-container', 'click', artworkClick);
  await domAPI.addEventListener('playback-shuffle', 'click', shuffleToggle);
  await domAPI.addEventListener('playback-prev', 'click', prevTrack);
  await domAPI.addEventListener('playback-play', 'click', playTrack);
  await domAPI.addEventListener('playback-next', 'click', nextTrack);
  await domAPI.addEventListener('playback-repeat', 'click', repeatToggle);
  await domAPI.addEventListener('progress-bar', 'change', changeTrackProgress);
  await domAPI.addEventListener('volume-fader', 'change', changeVolume);
});

/**
 * TODO: Load track data in all necessary containers
 * @param {???} track
 */
function loadTrack(track) {
  // Set track artwork to relevant containers
  // Set track info to relevant containers
  // Set track to object method???
}

/**
 * Toggle play/pause
 * @param {HTMLElement} element
 */
async function playTrack(element) {

  if (isPaused) {
    await domAPI.setAttribute('icon-playback-play', 'src', '../img/icons/playback/pause.png');

    // TODO: Implement play function
    alert('*FUNCTION UNDER CONTRUCTION*');

    isPaused = false;
  } else {
    await domAPI.setAttribute('icon-playback-play', 'src', '../img/icons/playback/play.png');

    // TODO: Implement pause function
    alert('*FUNCTION UNDER CONTRUCTION*');

    isPaused = true;
  }
}

/**
 * Switch to previous track
 * @param {HTMLElement} element
 */
function prevTrack(element) {
  // TODO: implement previous track function
  alert('*FUNCTION UNDER CONTRUCTION*');
}

/**
 * Switch to next track
 * @param {HTMLElement} element
 */
function nextTrack(element) {
  // TODO: implement next track function
  alert('*FUNCTION UNDER CONTRUCTION*');
}

/**
 * Toggle shuffle
 * @param {HTMLElement} element
 */
async function shuffleToggle(element) {
  if (!shuffleIsOn) {
    await domAPI.setAttribute('icon-playback-shuffle', 'src', '../img/icons/playback/shuffle.png');

    // TODO: implement shuffle on function
    alert('*FUNCTION UNDER CONTRUCTION*');

    shuffleIsOn = true;
  } else {
    await domAPI.setAttribute('icon-playback-shuffle', 'src', '../img/icons/playback/shuffleOff.png');

    // TODO: implement shuffle off function
    alert('*FUNCTION UNDER CONTRUCTION*');

    shuffleIsOn = false;
  }
}

/**
 * Toggle repeat
 * @param {HTMLElement} element
 */
async function repeatToggle(element) {
  if (!repeatIsOn) {
    await domAPI.setAttribute('icon-playback-repeat', 'src', '../img/icons/playback/repeat.png');

    // TODO: implement repeat on function
    alert('*FUNCTION UNDER CONTRUCTION*');

    repeatIsOn = true;
  } else {
    await domAPI.setAttribute('icon-playback-repeat', 'src', '../img/icons/playback/repeatOff.png');

    // TODO: implement repeat off function
    alert('*FUNCTION UNDER CONTRUCTION*');

    repeatIsOn = false;
  }
}

/**
 * Change track progress
 * @param {HTMLElement} element
 */
async function changeTrackProgress(element) {
    // TODO: implement track progress change function
    alert('*FUNCTION UNDER CONTRUCTION*');
}

/**
 * Change volume
 * @param {HTMLElement} element
 */
 async function changeVolume(element) {
  if (!isMuted) {
    await domAPI.setAttribute('icon-volume', 'src', '../img/icons/playback/muted.png');

    // TODO: implement volume change function
    alert('*FUNCTION UNDER CONTRUCTION*');

    isMuted = true;
  } else {
    await domAPI.setAttribute('icon-volume', 'src', '../img/icons/playback/unmuted.png');

    // TODO: implement volume change function
    alert('*FUNCTION UNDER CONTRUCTION*');

    isMuted = false;
  }
}

/**
 * Navigate to Overview (Now Playing) view
 * @param {HTMLElement} element
 */
 async function artworkClick(element) {
  if (!topContainerIsExtended) {
    await domAPI.loadPage('top-container-extended', 'pages/overviewExtended.html');
    await topExtensionOn();
    topContainerIsExtended = true;
  } else {
    await topExtensionOff();
    topContainerIsExtended = false;
  }
}