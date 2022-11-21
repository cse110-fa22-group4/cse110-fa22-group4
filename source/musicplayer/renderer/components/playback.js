/* GLOBAL VARS*/
let isPaused = false;
// let songPath = '../../songs/birds1.mp3'
// let songPath  = '/source/musicplayer/songs/birds1.mp3'
// path from local fs
// let songPath = 'C:/Users/andre/Downloads/cse110_dev2/cse110-fa22-group4/source/musicplayer/songs/birds1.mp3'
// let songPath = 'C:/Users/andre/Downloads/cse110_dev4/cse110-fa22-group4/source/musicplayer/songs/rickroll.webm'

// const selectedColor = 'var(--theme-primary)';
// const unselectedColor = 'black';

window.addEventListener('playback-loaded', async () => {
	// shuffle is going to randomize order of songs in playlist
	await domAPI.addEventListener('shuffle-btn', 'click', shuffleSong);
	// prev also involves access to 'playlist' (queue)
	// await domAPI.addEventListener('prev-btn', 'click', );
	// console.log(songPath)
	await domAPI.addEventListener('play-btn', 'click', playSong);
	// await domAPI.addEventListener('next-btn', 'click, );
	await domAPI.addEventListener('loop-btn', 'click', loopSong);
	await domAPI.addEventListener('audio-fader', 'input', updateVolume);
});

/**
 * Handles behavior of play/pause button when clicked
 * (ie: change icon, call play, pause, resume)
 */
async function playSong() {
	const playBtn = document.querySelector('.playbackBtn:nth-of-type(3)');
	const playBtnImg = playBtn.querySelector('img');
	// .setBinPath() in code or do in terminal atleast once,
	// set to path of ffplay executable
	if (playBtn.id === 'play-btn') {
		if (isPaused) {
			await ffmpegAPI.resumeSong();
		} else {
			// @todo song path needs to be set here.
			await ffmpegAPI.playSong('songPath', 100, 0);
		}
	} else {
		await ffmpegAPI.pauseSong();
		isPaused = true; // guessing this line throws error since isPaused is reassigned
	}
	toggleIcon(playBtn, playBtnImg);
}

/**
 * Handles behavior of shuffle button when clicked
 * (ie: change color, randomize playlist order)
 */
function shuffleSong() {
	const shuffleBtn = document.querySelector('#shuffle-btn > svg');
	const style = window.getComputedStyle(shuffleBtn);
	const currColor = style.getPropertyValue('fill');
	toggleColor(currColor, shuffleBtn);
}

/**
 * Handles behavior of loop button when clicked
 * (ie: change color, loop play)
 */
function loopSong() {
	const loopBtn = document.querySelector('#loop-btn > svg');
	const style = window.getComputedStyle(loopBtn);
	const currColor = style.getPropertyValue('fill');
	toggleColor(currColor, loopBtn);
}

/**
 * Toggle the color of the shuffle & repeat button when clicked
 * @param {HTMLElement} fillColor color to change svg to
 * @param {HTMLElement} btn svg (enclosed by button)
 */
function toggleColor(fillColor, btn) {
	if (fillColor === 'rgb(0, 0, 0)') { // equivalent to black
		fillColor = 'var(--theme-primary)';
	} else {
		fillColor = 'black';
	}
	btn.style.fill = fillColor;
}

/**
 * Toggle the icon of the play/pause button when clicked
 * @param {HTMLElement} btn The button which contains the icon image
 * @param {HTMLElement} btnImg The icon image
 */
function toggleIcon(btn, btnImg) {
	if (btn.id === 'play-btn') {
		console.log(btn);
		btnImg.src = '../img/icons/playback/pause.png';
		(btn).id = 'pause-btn';
	} else {
		btnImg.src = '../img/icons/playback/play.png';
		(btn).id = 'play-btn';
	}
}

/**
 * @description Updates the volume of the song.
 */
function updateVolume() {
	const audioFader = document.querySelector('#audio-fader');
	const audioIcon = document.querySelector('#audioIcon');
	console.log(audioFader);
	console.log(audioIcon);
	console.log(audioFader.value);
	if (audioFader.value === 0) {
		audioIcon.src = '../img/icons/playback/muted.png';
	} else {
		audioIcon.src = '../img/icons/playback/unmuted.png';
	}
}
