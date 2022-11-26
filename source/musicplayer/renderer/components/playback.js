/* GLOBAL VARS*/
let isPaused = false;	//can't add to eslintrc since reassigned
let shuffleOn = false;
const testMap = new Map();
let songNum = 0;
let prevSongsArr = [];
// absolute path from local fs
// const songPath1 = 'C:/Users/andre/Downloads/cse110_dev7/cse110-fa22-group4/source/musicplayer/songs/jingle_bells.mp3'
// const songPath2 = 'C:/Users/andre/Downloads/cse110_dev7/cse110-fa22-group4/source/musicplayer/songs/happyBirthday1.mp3'
// const songPath3 = 'C:/Users/andre/Downloads/cse110_dev7/cse110-fa22-group4/source/musicplayer/songs/rickroll.mp3'
// relative from /musicplayer
const songPath1 = './songs/jingle_bells.mp3';
const songPath2 = './songs/happyBirthday1.mp3';
const songPath3 = './songs/rickroll.mp3';
let currSongPath = songPath1;
// const selectedColor = 'var(--theme-primary)';
// const unselectedColor = 'black';

testMap.set( 'playlist', {
	name: 'testPlaylist',
	numTracks: 32,
	artworks: ['..img.png', '..img2.png'],
	trackList: [
		{'#': '01', 'title': 'Future Nostalgia', 'path': songPath1,
			'artist': 'Dua Lipa', 'album': 'Future Nostalgia', 'year': '2020', 'duration': '3:05',
			'genre': 'Dance, Pop', 'playlists': 'Monday Songs, Summer Mix',
			'tags': 'Party, Summer', 'artwork': '../img/sampleData/artwork-DuaLipa.webp'}, 
		{'#': '02', 'title': 'Don\'t Start Now', 'path': songPath2,
			'artist': 'Dua Lipa', 'album': 'Future Nostalgia', 'year': '2020', 'duration': '3:03',
			'genre': 'Dance, Pop', 'playlists': 'Monday Songs, Summer Mix',
			'tags': 'Party, Summer', 'artwork': '../img/sampleData/artwork-DuaLipa.webp'},
		{'#': '03', 'title': 'Cool', 'path': songPath3,
			'artist': 'Dua Lipa', 'album': 'Future Nostalgia', 'year': '2020', 'duration': '3:30',
			'genre': 'Dance, Pop', 'playlists': 'Monday Songs, Summer Mix',
			'tags': 'Party, Summer', 'artwork': '../img/sampleData/artwork-DuaLipa.webp'}],
});

window.addEventListener('playback-loaded', async () => {
	// shuffle is going to randomize order of songs in playlist
	await domAPI.addEventListener('shuffle-btn', 'click', shuffleSong);
	// prev also involves access to 'playlist' (array of objects insde map) 
	await domAPI.addEventListener('prev-btn', 'click', function() { prevSong(testMap); } );
	// wrapper to properly pass params without triggering functions initally 
	await domAPI.addEventListener('play-btn', 'click', function() { controlSong(currSongPath); });
	await domAPI.addEventListener('next-btn', 'click', function() { nextSong(testMap) });
	await domAPI.addEventListener('loop-btn', 'click', loopSong);
	await domAPI.addEventListener('audio-fader', 'input', updateVolume);
	decideFirstSong();
});

/**
 * @description Handles behavior of play/pause button when clicked
 * 	(ie: change icon, call play, pause, resume)
 * @param {string} songPath path of curent song to be played
 */
async function controlSong(songPath) {
	// console.log(event); can actually get event/element
	const playBtn = document.querySelector('.playbackBtn:nth-of-type(3)');
	const playBtnImg = playBtn.querySelector('img');
	//if (shuffleOn === true) {
	// prevSongsArr.push(songNum);
	//}
	// .setBinPath() in code or do in terminal atleast once,
	// set to path of ffplay executable
	if (playBtn.id === 'play-btn') {
		if (isPaused) {
			await ffmpegAPI.resumeSong();
		} else {
			// @todo actual data/song path needs to be set here
			await ffmpegAPI.playSong(songPath, 100, 0, 67000); 
		}
	} else {
		await ffmpegAPI.pauseSong();
		isPaused = true; // guessing this line throws error since isPaused is reassigned
	}
	toggleIcon(playBtn, playBtnImg);
}

/**
 * @description add first song on load since next wouldn't been clicked yet
 */
function decideFirstSong() {
	prevSongsArr.push(songNum);
}

/**
 * @description Plays the next song in playlist (and kills old instance)
 * @param {Map} playlistMap the map whose tracklist property holds
 * 	all the tracks of a playlist
 */
async function nextSong(playlistMap) {
	// get next song (while handling indexOfBounds)
	// next song is either sequential or shuffled
	const mapVal = playlistMap.get('playlist');
	const playlist = mapVal['trackList'];
	if (shuffleOn === true) {
		//prevSongsArr.push(songNum);
		songNum = shuffle(0, playlist.length - 1, songNum);
		//prevSongsArr.push(songNum);
	} else {
		if (songNum + 1 > playlist.length - 1 ) {
			return;
		}
		songNum = songNum + 1;
	}
	prevSongsArr.push(songNum);
	currSongPath = playlist[songNum]['path'];
	isPaused = false;	// isPaused shouldn't be carried over from prevSong

	// on skip, always play the song so button should always become pause
	const playBtn = document.querySelector('.playbackBtn:nth-of-type(3)');
	const playBtnImg = playBtn.querySelector('img');
	if ( playBtn.id === 'play-btn' ) { toggleIcon(playBtn, playBtnImg); }

	await ffmpegAPI.stopSong();
	await ffmpegAPI.playSong(currSongPath, 100, 0, 67000);
}

/**
 * @description Plays the previous song in playlist (and kills old instance)
 * @param {Map} playlistMap the map whose tracklist property holds
 * 	all the tracks of a playlist
 */
async function prevSong(playlistMap) {
	// get prev. song (while handling indexOfBounds)
	const mapVal = playlistMap.get('playlist');
	const playlist = mapVal['trackList'];
	//if (shuffleOn === true) {
		// @todo peek() to handle indexOutOfBounds
		// or just use index
		// prevSongsArr.pop();
		// let prevSongIndx = prevSongsArr.pop();
		// //console.log(testEle);
		// songNum = prevSongIndx;
	//}
	// turns out shuffleOn is not special case, since shuffling exists
	// for prev. Btn to work properly always need array to track
	// -2 since length is +1 from index 
	// (ie: at index=0, 1-1=0 allows if cond. to pass, triggers indexOutOfBounds)
	if ( prevSongsArr.length - 2 < 0) { return; }	
	prevSongsArr.pop();	// remove current song
	songNum = prevSongsArr[prevSongsArr.length - 1]; // retrieve prev song
	// else {
	// 	if (songNum - 1 < 0 ) {
	// 		return;
	// 	}
	// 	songNum = songNum - 1;
	// }
	currSongPath = playlist[songNum]['path'];
	isPaused = false;	// isPaused shouldn't be carried over from other songs

	// on prev, always play the song so button should always become pause
	const playBtn = document.querySelector('.playbackBtn:nth-of-type(3)');
	const playBtnImg = playBtn.querySelector('img');
	if ( playBtn.id === 'play-btn' ) { toggleIcon(playBtn, playBtnImg); }

	await ffmpegAPI.stopSong();
	await ffmpegAPI.playSong(currSongPath, 100, 0, 67000);
}

/**
 * @description randomized index for playlist order which cannot be current index
 * @param {number} min lower bound on randomized song index 
 * @param {number} max upper bound on randomized song index
 * @param {number} songNum curent song index
*  @return {number} representing new random index/songNum to play
 */
function shuffle(min, max, songNum) {
	let randomIndx = songNum;
	while (randomIndx === songNum) { 
		// first formula would not give a uniform distrubution, 
		// highest indexed song only appears if exactly 2.0, really rare
		// randomIndx = Math.floor( Math.random() * (max - min) + min );
		randomIndx = Math.floor(Math.random() * (max - min + 1)) + min;
	}
	return randomIndx;
}

/**
 * @description Handles behavior of shuffle button when clicked
 *  (ie: change color, randomize playlist order)
 */
function shuffleSong() {
	const shuffleBtn = document.querySelector('#shuffle-btn > svg');
	const style = window.getComputedStyle(shuffleBtn);
	const currColor = style.getPropertyValue('fill');
	toggleColor(currColor, shuffleBtn);
}

/**
 * @description Handles behavior of loop button when clicked
 * 	(ie: change color, loop play)
 */
function loopSong() {
	const loopBtn = document.querySelector('#loop-btn > svg');
	const style = window.getComputedStyle(loopBtn);
	const currColor = style.getPropertyValue('fill');
	toggleColor(currColor, loopBtn);
}

/**
 * @description Toggle the color of the shuffle & repeat button when clicked
 * @param {string} fillColor color to change svg to
 * @param {HTMLElemet} btn svg (enclosed by button)
 */
function toggleColor(fillColor, btn) {
	if (fillColor === 'rgb(0, 0, 0)') { // equivalent to black
		fillColor = 'var(--theme-primary)';
		shuffleOn = true;
	} else {
		fillColor = 'black';
		shuffleOn = false;
	}
	btn.style.fill = fillColor;
}

/**
 * @description Toggle the icon of the play/pause button when clicked
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
 * @description Toggle the audio icon when clicked
 */
function updateVolume() {
	const audioFader = document.querySelector('#audio-fader');
	const audioIcon = document.querySelector('#audioIcon');
	console.log(audioFader);
	console.log(audioIcon);
	console.log(audioFader.value);
	if (audioFader.value === '0') {
		audioIcon.src = '../img/icons/playback/muted.png';
	} else {
		audioIcon.src = '../img/icons/playback/unmuted.png';
	}
}
