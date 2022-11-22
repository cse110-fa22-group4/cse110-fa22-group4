const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')

const {
  setStoragePath
} = require('../../preload/fs/fsAPICalls');

const {
  testFS, reset_user1, reset_user2, reset_user3, reset
} = require('../fsAPITesting/fsAPITester');

const {
  getSongs,
  writeSongs,
  appendSong,
  appendSongs,
  removeSong,
  cullShortAudio,
} = require('../../preload/fs/songs/songsAPICalls');

let electronApp;

// getSongs test
test('getSongs for user 1', async () => {
  electronApp = await electron.launch({ args: ['../../main/main.js'] })
  await reset_user1();

  await setStoragePath('users/user_1/data');
  let songs = await getSongs();

  expect(JSON.stringify(songs)).toBe(JSON.stringify([
    {
      "/cse110-fa22-group4/source/users/user_1/songs/Tobu/Tobu - Hope [NCS Release].mp3": {
        "title": "Hope",
        "artist": "Tobu"
      }
    },
    {
      "/cse110-fa22-group4/source/users/user_1/songs/Tobu/Tobu - Infectious [NCS Release].mp3": {
        "title": "Infectious",
        "artist": "Tobu"
      }
    },
    {
      "/cse110-fa22-group4/source/users/user_1/songs/Different Heaven & EH!DE - My Heart [NCS Release].mp3": {
        "title": "My Heart",
        "artist": "Different Heaven & EH!DE"
      }
    }
  ]));

  await electronApp.close()
});


// appendSong test
test('appendSong for user 1', async () => {
  electronApp = await electron.launch({ args: ['../../main/main.js'] })
  await reset_user1();

  await setStoragePath('users/user_1/data');

  let info = {}
  info.title = "Title";
  info.artist = "Artist";
  let song = {};
  song["/Desktop/Artist - Title.mp3"] = info;
  await appendSong(song)
  let songs = await getSongs();

  expect(JSON.stringify(songs)).toBe(JSON.stringify([
    {
      "/cse110-fa22-group4/source/users/user_1/songs/Tobu/Tobu - Hope [NCS Release].mp3": {
        "title": "Hope",
        "artist": "Tobu"
      }
    },
    {
      "/cse110-fa22-group4/source/users/user_1/songs/Tobu/Tobu - Infectious [NCS Release].mp3": {
        "title": "Infectious",
        "artist": "Tobu"
      }
    },
    {
      "/cse110-fa22-group4/source/users/user_1/songs/Different Heaven & EH!DE - My Heart [NCS Release].mp3": {
        "title": "My Heart",
        "artist": "Different Heaven & EH!DE"
      }
    },
    {
      "/Desktop/Artist - Title.mp3": {
        "title": "Title",
        "artist": "Artist"
      }
    }
  ]));

  await electronApp.close()
});


// appendSongs test (appendSongs actually needs fixing btw)
test('appendSongs for user 1', async () => {
  electronApp = await electron.launch({ args: ['../../main/main.js'] })
  await reset_user1();

  await setStoragePath('users/user_1/data');

  let info1 = {}
  info1.title = "Title";
  info1.artist = "Artist";
  let song1 = {};
  song1["/Desktop/Artist - Title.mp3"] = info1;

  let info2 = {}
  info2.title = "Stairway to Heaven";
  info2.artist = "Led Zeppelin";
  let song2 = {};
  song2["/Desktop/Led Zeppelin - Stairway to Heaven.mp3"] = info2;
  
  let songlist = [];
  songlist.push(song1);
  songlist.push(song2);
  
  await appendSongs(songlist)

  let songs = await getSongs();

  expect(JSON.stringify(songs)).toBe(JSON.stringify([
    {
      "/cse110-fa22-group4/source/users/user_1/songs/Tobu/Tobu - Hope [NCS Release].mp3": {
        "title": "Hope",
        "artist": "Tobu"
      }
    },
    {
      "/cse110-fa22-group4/source/users/user_1/songs/Tobu/Tobu - Infectious [NCS Release].mp3": {
        "title": "Infectious",
        "artist": "Tobu"
      }
    },
    {
      "/cse110-fa22-group4/source/users/user_1/songs/Different Heaven & EH!DE - My Heart [NCS Release].mp3": {
        "title": "My Heart",
        "artist": "Different Heaven & EH!DE"
      }
    },
    {
      "/Desktop/Artist - Title.mp3": {
        "title": "Title",
        "artist": "Artist"
      }
    },
    {
      "/Desktop/Led Zeppelin - Stairway to Heaven.mp3": {
        "title": "Stairway to Heaven",
        "artist": "Led Zeppelin"
      }
    }
  ]));

  await electronApp.close()
});

//refresh environment
test('reset', async () => {
  electronApp = await electron.launch({ args: ['../../main/main.js'] })
  await reset();
  await electronApp.close()
});