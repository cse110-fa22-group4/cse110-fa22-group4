/* GLOBAL VARS*/
let isPaused = false;
//let songPath = '../../songs/birds1.mp3'
//let songPath  = '/source/musicplayer/songs/birds1.mp3' 
//path from local fs
//let songPath = 'C:/Users/andre/Downloads/cse110_dev2/cse110-fa22-group4/source/musicplayer/songs/birds1.mp3'
//let songPath = 'C:/Users/andre/Downloads/cse110_dev4/cse110-fa22-group4/source/musicplayer/songs/rickroll.webm'

//const selectedColor = '#67A8B7';
//const unselectedColor = 'black'; 

window.addEventListener('playback-loaded', async () => {
    //shuffle is going to randomize order of songs in playlist 
    await domAPI.addEventListener('shuffle-btn', 'click', shuffleSong);
    //prev also involves access to 'playlist' (queue)
    //await domAPI.addEventListener('prev-btn', 'click', );
    //console.log(songPath)
    await domAPI.addEventListener('play-btn', 'click', playSong);
    //await domAPI.addEventListener('next-btn', 'click, );
    await domAPI.addEventListener('loop-btn', 'click', loopSong);
    await domAPI.addEventListener('audio-fader', 'input', updateVolume);
});

/**
 * Handles behavior of play/pause button when clicked
 * (ie: change icon, call play, pause, resume)
 */
function playSong() {
    let playBtn = document.querySelector('.playbackBtn:nth-of-type(3)');
    let playBtnImg = playBtn.querySelector('img');
    //.setBinPath() in code or do in terminal atleast once, 
    // set to path of ffplay executable
    if(playBtn.id == "play-btn") {  
        if(isPaused) {
            ffmpegAPI.resumeSong();
        } else {
            ffmpegAPI.playSong(songPath, volume = 100, seekVal = 0);
        }
    }
    else {
        ffmpegAPI.pauseSong();
        isPaused = true;        //guessing this line throws error since isPaused is reassigned 
    }
    toggleIcon(playBtn, playBtnImg);
  }

/**
 * Handles behavior of shuffle button when clicked
 * (ie: change color, randomize playlist order)
 */
function shuffleSong() {
    let shuffleBtn = document.querySelector('#shuffle-btn > svg');
    let style = window.getComputedStyle(shuffleBtn)
    let currColor = style.getPropertyValue('fill');
    toggleColor(currColor, shuffleBtn);
}

/**
 * Handles behavior of loop button when clicked
 * (ie: change color, loop play)
 */
function loopSong() {
    let loopBtn = document.querySelector('#loop-btn > svg');
    let style = window.getComputedStyle(loopBtn)
    let currColor = style.getPropertyValue('fill');
    toggleColor(currColor, loopBtn);
}

/**
 * Toggle the color of the shuffle & repeat button when clicked
 * @param {HTMLElement} fillColor color to change svg to 
 * @param {HTMLElement} btn svg (enclosed by button)
 */
function toggleColor(fillColor, btn) {
    if(fillColor == 'rgb(0, 0, 0)') {  //equivalent to black  
        fillColor = '#67A8B7';
    }
    else {
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
    if(btn.id == "play-btn") {  
        console.log(btn)
        btnImg.src = "../img/icons/playback/pause.png";
        (btn).id = "pause-btn";
    }
    else {
        btnImg.src = "../img/icons/playback/play.png";
        (btn).id = "play-btn";
    }
}

function updateVolume() {
    let audioFader = document.querySelector('#audio-fader');
    let audioIcon = document.querySelector('#audioIcon');
    console.log(audioFader)
    console.log(audioIcon)
    console.log(audioFader.value)
    if(audioFader.value == 0) {
        audioIcon.src = "../img/icons/playback/muted.png";
    } else {
        audioIcon.src = "../img/icons/playback/unmuted.png"
    }
}