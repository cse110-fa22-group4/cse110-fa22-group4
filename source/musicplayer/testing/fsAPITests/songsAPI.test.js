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

//refresh environment
test('reset', async () => {
  electronApp = await electron.launch({ args: ['../../main/main.js'] })
  await reset();
  await electronApp.close()
});