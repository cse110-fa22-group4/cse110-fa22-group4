/* GLOBAL VARS*/
// fix lint issues later
// const queueMap = {'name': 'queuePlaylist', 'numTracks': '0', 'artworks': [], 'trackList': []};
const queueArr = [];

/*
const queueMap = { };
queueMap['queuePlaylist'] = { 'name': 'queuePlaylist', 'numTracks': '0', 'artworks': [], 'trackList': [] };
await genAPI.publishGlobal(queueMap, 'map');
await genAPI.getGlobal('map');
*/
// await genAPI.publishGlobal(queueMap, "queuePlaylist");
/*
// getting global map and appending songs
const queuePlaylist = globalVars["queuePlaylist"];
console.log(queuePlaylist)
const queueMapVal = queuePlaylist.get('queuePlaylist');
const queueTracklist = queueMapVal['trackList'];
queueTracklist.append( { '#': '01', ... });
*/

// const {BrowserWindow} = require('main');

// alot of these can't be added to eslintrc since reassigned
let isPaused = false;
let shuffleOn = false;
let toggleOn = false;
const testMap = new Map();
let songNum = 0;
const prevSongsArr = [];

let startStamp = null;
let endStamp = null;
let progressFader = null;
let msElapsed = 0;
let barPercent = 0;
let intervalID;

let volume = 100;
// absolute path from local fs
// const songPath1 = 'C:/Users/andre/Downloads/cse110_dev7/cse110-fa22-group4/source/musicplayer/songs/jingle_bells.mp3'
// const songPath2 = 'C:/Users/andre/Downloads/cse110_dev7/cse110-fa22-group4/source/musicplayer/
// songs/happyBirthday1.mp3'
// const songPath3 = 'C:/Users/andre/Downloads/cse110_dev7/cse110-fa22-group4/source/musicplayer/songs/rickroll.mp3'
// relative from /musicplayer
const songPath0 = './songs/twinkleLittleStar.mp3';
const songPath1 = './songs/jingle_bells.mp3';
const songPath2 = './songs/happyBirthday1.mp3';
const songPath3 = './songs/rickroll.mp3';
const songPath4 = './songs/starSpangledBanner.mp3';
let currSongPath;
// const selectedColor = 'var(--theme-primary)';
// const unselectedColor = 'black';

/*
testMap.set( 'playlist', {
	name: 'testPlaylist',
	numTracks: 32,
	artworks: ['..img.png', '..img2.png'],
	trackList: [
		{'#': '01', 'title': 'joy to the world', 'path': songPath1,
			'artist': 'person a', 'album': 'Future Nostalgia', 'year': '2020', 'duration': '1:07',
			'genre': 'Dance, Pop', 'playlists': 'Monday Songs, Summer Mix',
			'tags': 'Party, Summer', 'artwork': '../img/sampleData/artwork-DuaLipa.webp'},
		{'#': '02', 'title': 'happy birthday', 'path': songPath2,
			'artist': 'person b', 'album': 'Future Nostalgia', 'year': '2020', 'duration': '0:29',
			'genre': 'Dance, Pop', 'playlists': 'Monday Songs, Summer Mix',
			'tags': 'Party, Summer', 'artwork': '../img/sampleData/artwork-DuaLipa.webp'},
		{'#': '03', 'title': 'never gonna give you up', 'path': songPath3,
			'artist': 'rick astley', 'album': '...', 'year': '2020', 'duration': '3:32',
			'genre': 'Dance, Pop', 'playlists': 'Monday Songs, Summer Mix',
			'tags': 'Party, Summer', 'artwork': ''}],
});*/
const song0 = {'#': '03', 'title': 'never gonna give you up', 'path': songPath0,
'artist': 'rick astley', 'album': '...', 'year': '2020', 'duration': '3:32',
'genre': 'Dance, Pop', 'playlists': 'Monday Songs, Summer Mix',
'tags': 'Party, Summer', 'artwork': ''}
const song4 = {'#': '03', 'title': 'never gonna give you up', 'path': songPath4,
'artist': 'rick astley', 'album': '...', 'year': '2020', 'duration': '3:32',
'genre': 'Dance, Pop', 'playlists': 'Monday Songs, Summer Mix',
'tags': 'Party, Summer', 'artwork': ''}
// let testQueue = [song0, testMap, song4];	// no longer optimal

window.addEventListener('playback-loaded', async () => {
	// decideFirstSong();
	await genAPI.publishGlobal(songNum, 'songNum');
	await genAPI.publishGlobal(currSongPath, 'currSongPath');
	await genAPI.publishGlobal(prevSongsArr, 'prevSongsArr');
	await genAPI.publishGlobal(startStamp, 'startStamp');
	await genAPI.publishGlobal(endStamp, 'endStamp');
	await genAPI.publishGlobal(progressFader, 'progressFader');
	await genAPI.publishGlobal(msElapsed, 'msElapsed');
	// shuffle is going to randomize order of songs in playlist
	await domAPI.addEventListener('shuffle-btn', 'click', shuffleSong);
	// prev also involves access to 'playlist' (array of objects inside map)
	await domAPI.addEventListener('prev-btn', 'click', function() { prevSong(); } );
	// wrapper to properly pass params without triggering functions initally
	await domAPI.addEventListener('play-btn', 'click', function() { controlSong(currSongPath);});
	await domAPI.addEventListener('next-btn', 'click', function() { nextSong(); });
	await domAPI.addEventListener('loop-btn', 'click', loopSong);
	await domAPI.addEventListener('progressBar', 'input', stopUpdateSeek);
	await domAPI.addEventListener('progressBar', 'mouseup', updateSeek);
	await domAPI.addEventListener('audio-fader', 'input', updateVolumeIcon);
	await domAPI.addEventListener('audio-fader', 'change', updateVolume);
	

	// progress bar functionalities
	// initProgress();
	// updateInfo();

	await genAPI.publishGlobal(queueArr, 'queueArr');	// array is not persistent
	// change code slightly to get tracklist

	/*
	const appWindow = await genAPI.getGlobal('mainWindow');
	console.log(appWindow);
	if (!(appWindow.isFocused()) ) {
		console.log('clicked away');
		// might need 2 functions
		// unfocus -> get date
		// once focused ->  get date again
		// calc time away, add to msElapsed
	}*/
});

// const currWin = BrowserWindow.getAllWindows()[0];
// console.log(currWin);

// console.log(appWindow);
// if (!(appWindow.isFocused()) ) {
// 	console.log('clicked away');
// 	// might need 2 functions
// 	// unfocus -> get date
// 	// once focused ->  get date again
// 	// calc time away, add to msElapsed
// }

/**
 * @description Handles behavior of play/pause button when clicked
 * 	(ie: change icon, call play, pause, resume)
 * @param {string} songPath path of curent song to be played
 */
async function controlSong(songPath) {
	// decideFirstSong();
	const playBtn = document.querySelector('.playbackBtn:nth-of-type(3)');
	const playBtnImg = playBtn.querySelector('img');
	// .setBinPath() in code or do in terminal atleast once, set to path of ffplay executable
	if (playBtn.id === 'play-btn') {
		if (isPaused) {
			// await ffmpegAPI.resumeSong();	//dont use this anymore since I need to set vol
			const resumeTime = (msElapsed/1000);
			await ffmpegAPI.playSong(songPath, volume, resumeTime, 67);
			intervalID = setInterval( function() { updateProgress(); }, 50);
		} else {
			// @todo actual data/song path needs to be set here
			// @todo decide songPath based on object
			await ffmpegAPI.playSong(songPath, volume, msElapsed/1000, 67);
			// setTimeout();	// exec code after duration of song
			// possible to change update every 1 sec like spotify
			intervalID = setInterval( function() { updateProgress(); }, 50);
		}
	} else {
		await ffmpegAPI.pauseSong();
		isPaused = true; // guessing this line throws error since isPaused is reassigned
		clearInterval(intervalID);
	}
	toggleIcon(playBtn, playBtnImg);
}

/**
 * @description add first song on load since next wouldn't been clicked yet
 * helper for nextSong, prevSong to handle edge case
 */
function decideFirstSong() {
	// @ todo read in first song from persistent memory
	// if (queueArr.length == 0) {
	// 	return;
	// }
	// store first song in history on load
	prevSongsArr.push(songNum);

	// set first songPath
	// const mapVal = playlistMap.get('playlist');
	// const playlist = mapVal['trackList'];
	currSongPath = queueArr[songNum]['filename'];
}

/**
 * @description Plays the next song in playlist (and kills old instance)
 * 	all the tracks of a playlist
 */
async function nextSong() {
	// get next song (while handling indexOfBounds)
	// next song is either sequential or shuffled
	// const mapVal = playlistMap.get('playlist');
	// const playlist = mapVal['trackList'];
	if (shuffleOn === true) {
		songNum = shuffle(0, queueArr.length - 1, songNum);
	} else {
		if (songNum + 1 > queueArr.length - 1 ) {
			return;
		}
		songNum = songNum + 1;
	}
	// @todo decide songPath based on object
	// songNum will only ever be used for array in Map, need to reset once Map is exited
	prevSongsArr.push(songNum);
	currSongPath = queueArr[songNum]['filename'];
	isPaused = false;	// isPaused shouldn't be carried over from prevSong

	// on skip, always play the song so button should always become pause
	const playBtn = document.querySelector('.playbackBtn:nth-of-type(3)');
	const playBtnImg = playBtn.querySelector('img');
	if ( playBtn.id === 'play-btn' ) {
		toggleIcon(playBtn, playBtnImg);
	}

	clearInterval(intervalID);
	resetProgress();
	await ffmpegAPI.stopSong();
	await ffmpegAPI.playSong(currSongPath, volume, 0, 67);
	intervalID = setInterval( function() { updateProgress(); }, 50);

	updateInfo();

    await refreshQueueViewer();
}

/**
 * @description Plays the previous song in playlist (and kills old instance)
 * 	all the tracks of a playlist
 */
async function prevSong() {
	// get prev. song (while handling indexOfBounds)
	// const mapVal = playlistMap.get('playlist');
	// const playlist = mapVal['trackList'];
	// turns out shuffleOn is not special case, since shuffling exists
	// for prev. Btn to work properly always need array to track songs
	// -2 since length is +1 from index
	// (ie: at index=0, 1-1=0 allows if cond. to pass, triggers indexOutOfBounds)
	if ( prevSongsArr.length - 2 < 0) {
		return;
	}
	prevSongsArr.pop();	// remove current song
	songNum = prevSongsArr[prevSongsArr.length - 1]; // retrieve prev song
	// no need for branch anymore, prevSongsArr handles both cases of shuffleOn/Off
	currSongPath = queueArr[songNum]['filename'];
	isPaused = false;	// isPaused shouldn't be carried over from other songs

	// on prev, always play the song so button should always become pause
	const playBtn = document.querySelector('.playbackBtn:nth-of-type(3)');
	const playBtnImg = playBtn.querySelector('img');
	if ( playBtn.id === 'play-btn' ) {
		toggleIcon(playBtn, playBtnImg);
	}

	clearInterval(intervalID);
	resetProgress();
	// console.log(startStamp.innerHTML);
	// console.log('test' + endStamp.innerHTML);
	await ffmpegAPI.stopSong();
	await ffmpegAPI.playSong(currSongPath, volume, 0, 67);
	intervalID = setInterval( function() { updateProgress(); }, 50);
	updateInfo();

    await refreshQueueViewer();
}

/**
 * @description Jumps to and plays a song in playlist (and kills old instance)
 * @param {number} index the index of the song to jump to
 * 	all the tracks of a playlist
 */
 async function jumpSong(index) {

    // TODO: function currently bugged, needs proper implementation
    // not sure what needs to be done with prevSongsArr -Alvin 
	songNum = index;
	prevSongsArr.push(songNum);

	currSongPath = queueArr[songNum]['filename'];
	isPaused = false;	// isPaused shouldn't be carried over from prevSong

	// on skip, always play the song so button should always become pause
	const playBtn = document.querySelector('.playbackBtn:nth-of-type(3)');
	const playBtnImg = playBtn.querySelector('img');
	if ( playBtn.id === 'play-btn' ) {
		toggleIcon(playBtn, playBtnImg);
	}

	clearInterval(intervalID);
	resetProgress();
	await ffmpegAPI.stopSong();
	await ffmpegAPI.playSong(currSongPath, volume, 0, 67);
	intervalID = setInterval( function() { updateProgress(); }, 50);

	updateInfo();
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
	shuffleOn = !shuffleOn;
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
	toggleOn = !toggleOn;
}

/**
 * @description Toggle the color of the shuffle & repeat button when clicked
 * @param {string} fillColor color to change svg to
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
 * @description Toggle the icon of the play/pause button when clicked
 * @param {HTMLElement} btn The button which contains the icon image
 * @param {HTMLElement} btnImg The icon image
 */
function toggleIcon(btn, btnImg) {
	if (btn.id === 'play-btn') {
		// console.log(btn);
		btnImg.src = '../img/icons/playback/pause.png';
		(btn).id = 'pause-btn';
	} else {
		btnImg.src = '../img/icons/playback/play.png';
		(btn).id = 'play-btn';
	}
}

// audio functionalities
/**
 * @description Toggle the audio icon when clicked
 */
function updateVolumeIcon() {
	const audioFader = document.querySelector('#audio-fader');
	const audioIcon = document.querySelector('#audioIcon');
	// console.log(audioFader);
	// console.log(audioIcon);
	console.log(audioFader.value);
	if (audioFader.value === '0') {
		audioIcon.src = '../img/icons/playback/muted.png';
	} else {
		audioIcon.src = '../img/icons/playback/unmuted.png';
	}
	// might want to add a separate triggered in change
	// ffmpegAPI.changeVolume(audioFader.value);
}

/**
 * @description updates actual volume once dragger let go
 */
async function updateVolume(event) {
	// playing from resume needs to check volume
	// this only really checks vol from already playing mostly
	volume = Number(event.value);
	const playBtn = document.querySelector('.playbackBtn:nth-of-type(3)');
	if (playBtn.id === 'play-btn') {
		return;
	}
	// const currTime = await ffmpegAPI.getCurrentTime();
	// console.log(currTime); in seconds proabably vs progress bar is slightly diff.
	// can't resumeSong() normally since that doesn't allow change in volume
	const resumeTime = (msElapsed/1000) + 1;
	await ffmpegAPI.stopSong();	// pauseSong() toString issue
	await ffmpegAPI.playSong(currSongPath, volume, resumeTime);
	// await ffmpegAPI.changeVolume(Number(event.value)); 	// path not found
}


// progress bar functionalities
/**
 * @description set the inital values of the progress bar for current song
 */
function resetProgress() {
	startStamp = document.querySelector('.timestamps:nth-of-type(1)');
	endStamp = document.querySelector('.timestamps:nth-of-type(2)');
	progressFader = document.querySelector('#progressBar');
	// @ todo read in first song from persistent memory
	if (queueArr.length === 0) {
		return;
	}
	// const mapVal = playlistMap.get('playlist');
	// const playlist = mapVal['trackList'];
	const currSongDuration = queueArr[songNum]['duration'];

	endStamp.innerHTML = msToFormatStr(currSongDuration * 1000);
	startStamp.innerHTML = '0:00';
	progressFader.value = '0';
	msElapsed = 0;
}


/**
 * @description change the length and timestamp of the progress bar for current song
 */
async function updateProgress() {
	// check if song is over
	if ( formatStrToMs(startStamp.innerHTML) >= formatStrToMs(endStamp.innerHTML)) {
		clearInterval(intervalID);
		// double check reset if issues arises, but nextSong should reset
		if (toggleOn) {
			clearInterval(intervalID);
			resetProgress();
			await ffmpegAPI.stopSong();
			await ffmpegAPI.playSong(currSongPath, volume, 0, 67);
			intervalID = setInterval( function() { updateProgress(); }, 50);
			// no info update needed
		} else {
			nextSong();
		}

		return;
	}

	// console.log(msElapsed);
	msElapsed = msElapsed + 50;
	barPercent = (msElapsed/ formatStrToMs(endStamp.innerHTML)) * 100;
	// console.log( formatStrToMs(endStamp.innerHTML))
	// console.log(barPercent);		// the issue is backend code not anticipating skip
	progressFader.value = barPercent.toString();	// value of input range is string
	// console.log(msElapsed);
	// console.log(formatStrToMs(endStamp.innerHTML));
	// console.log(progressFader.value);
	startStamp.innerHTML = msToFormatStr(msElapsed);
}

/**
 * @description converts duration of song (mm/ss format) string to milliseconds
 * @param {string} durationString representing duration of song in (mm/ss format)
 * @return {Number} representing duration of song in milliseconds
 */
function formatStrToMs(durationString) {
	// ask that duration is always formatted as hh:mm:ss when creating playlist
	// const [hours, minutes, seconds] = durationString.split(':');
	const [minutes, seconds] = durationString.split(':');

	// return Number(durationString) * 1000;

	// return ( Number(hours) * 60 * 60 + Number(minutes) * 60 + Number(seconds) ) * 1000;
	return ( Number(minutes) * 60 + Number(seconds) ) * 1000;
}

/**
 * @description converts milliseconds to (mm/ss format) string
 * @param {Number} ms the duration converted to millseconds
 * @return {String} a string representing time in mm/ss format
 */
function msToFormatStr(ms) {
	return new Date(ms).toISOString().substring(14, 19);
}

/**
 * @description stops progress bar updates on slider drag
 */
function stopUpdateSeek(event) {
	clearInterval(intervalID); // stop updating progress
	msElapsed = 0;
	console.log(Number(event.value));
	console.log(Number(event.value));
}

/**
 * @description seek to position in song based on slider (once mouse up)
 * @param {HTMLElement} element element recieve from event 
 */
async function updateSeek(element) {
	console.log('mouse up');
	const playBtn = document.querySelector('.playbackBtn:nth-of-type(3)');
	// console.log(Number(element.value));
	// const mapVal = playlistMap.get('playlist');
	// const playlist = mapVal['trackList'];
	// currSongPath = playlist[songNum]['duration'];
	// await ffmpegAPI.seekSong(Number(element.value));
	// seekSong() will likely work too
	// but relies on duration (which was previosuly hardcoded to 67)
	msElapsed = (Number(element.value) / 100) * formatStrToMs(endStamp.innerHTML);
	// const playBtnImg = playBtn.querySelector('img');
	// case where user pauses then seek, seek should not play automatically
	if (playBtn.id === 'play-btn') {
		// don't even have to set global seekVal var b/c msElapsed is basically seekVal
		// just don't play automatically
		return;
	}
	await ffmpegAPI.stopSong();
	// its undocumented but seekVal is not relative range 0-100
	// but absolute time in seconds
	// also using playSong is skips over the looping issue with seekSong() 
	await ffmpegAPI.playSong(currSongPath, 100, msElapsed/1000);
	// convert str to number, percent to ms
	// msElapsed = (Number(element.value) / 100) * formatStrToMs(endStamp.innerHTML);
	intervalID = setInterval( function() { updateProgress(); }, 50);
}

/**
 * @description updates info for current song
 */
function updateInfo() {
	// @ todo read in first song from persistent memory
	// if (queueArr.length == 0) {
	// 	return;
	// }
	// const mapVal = playlistMap.get('playlist');
	// const playlist = mapVal['trackList'];
	const currTitle = queueArr[songNum]['title'];
	const currArtist = queueArr[songNum]['artist'];
	let currArt;
	if ( typeof queueArr[songNum]['artwork'] === 'undefined') {
		currArt = '../img/artwork-default.png';
	} else {
		currArt = queueArr[songNum]['artwork'];
	}

	const songTitle = document.querySelector('.songInfo > b');
	const songArtist = document.querySelector('.songInfo > p');
	const songArt = document.querySelector('#playbackArt');

	songTitle.innerHTML = currTitle;
	songArtist.innerHTML = currArtist;
	console.log(currArt);
	console.log(songNum);
	songArt.src = currArt;
}

// module.exports.decideFirstSong = decideFirstSong
// export { decideFirstSong };
