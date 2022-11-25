const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')

const {
  setStoragePath
} = require('../../preload/fs/fsAPICalls');

const {
  reset_user1, reset_user2, reset_user3, reset_songs, reset_user_blank,
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


/**
 * getSongs testing
 */
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

test('getSongs for user 2', async () => {
  electronApp = await electron.launch({ args: ['../../main/main.js'] })
  await reset_user2();

  await setStoragePath('users/user_2/data');
  let songs = await getSongs();

  expect(JSON.stringify(songs)).toBe(JSON.stringify([]));

  await electronApp.close()
});

test('getSongs for user blank', async () => {
  electronApp = await electron.launch({ args: ['../../main/main.js'] })
  await reset_user_blank();

  await setStoragePath('users/user_blank/data');
  let songs = await getSongs();

  expect(JSON.stringify(songs)).toBe(JSON.stringify([]));

  await electronApp.close()
});


/**
 * appendSong Testing
 */
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

test('appendSong for user 2', async () => {
  electronApp = await electron.launch({ args: ['../../main/main.js'] })
  await reset_user2();

  await setStoragePath('users/user_2/data');

  let info = {}
  info.title = "Title2";
  info.artist = "Artist2";
  let song = {};
  song["/Desktop/Artist2 - Title2.mp3"] = info;
  await appendSong(song)
  let songs = await getSongs();

  expect(JSON.stringify(songs)).toBe(JSON.stringify([
    {
      "/Desktop/Artist2 - Title2.mp3": {
        "title": "Title2",
        "artist": "Artist2"
      }
    }
  ]));

  await electronApp.close()
});

test('appendSong for user blank', async () => {
  electronApp = await electron.launch({ args: ['../../main/main.js'] })
  await reset_user_blank();

  await setStoragePath('users/user_blank/data');

  let info = {}
  info.title = "Title3";
  info.artist = "Artist3";
  let song = {};
  song["/Desktop/Artist3 - Title3.mp3"] = info;
  await appendSong(song)
  let songs = await getSongs();

  expect(JSON.stringify(songs)).toBe(JSON.stringify([
    {
      "/Desktop/Artist3 - Title3.mp3": {
        "title": "Title3",
        "artist": "Artist3"
      }
    }
  ]));

  await electronApp.close()
});


/**
 * appendSongs test (appendSongs actually needs fixing btw)
 */ 
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

 test('appendSongs for user 2', async () => {
  electronApp = await electron.launch({ args: ['../../main/main.js'] })
  await reset_user2();

  await setStoragePath('users/user_2/data');

  let info1 = {}
  info1.title = "Title2";
  info1.artist = "Artist2";
  let song1 = {};
  song1["/Desktop/Artist2 - Title2.mp3"] = info1;

  let info2 = {}
  info2.title = "Back in Black";
  info2.artist = "ACDC";
  let song2 = {};
  song2["/Desktop/ACDC - Back in Black.mp3"] = info2;

  let songlist = [];
  songlist.push(song1);
  songlist.push(song2);

  await appendSongs(songlist)

  let songs = await getSongs();

  expect(JSON.stringify(songs)).toBe(JSON.stringify([
    {
      "/Desktop/Artist2 - Title2.mp3": {
        "title": "Title2",
        "artist": "Artist2"
      }
    },
    {
      "/Desktop/ACDC - Back in Black.mp3": {
        "title": "Back in Black",
        "artist": "ACDC"
      }
    }
  ]));
  
  await electronApp.close()
});

  test('appendSongs for user blank', async () => {
    electronApp = await electron.launch({ args: ['../../main/main.js'] })
    await reset_user_blank();
  
    await setStoragePath('users/user_blank/data');
  
    let info1 = {}
    info1.title = "Title3";
    info1.artist = "Artist3";
    let song1 = {};
    song1["/Desktop/Artist3 - Title3.mp3"] = info1;
  
    let info2 = {}
    info2.title = "Welcome to the Jungle";
    info2.artist = "Guns N' Roses";
    let song2 = {};
    song2["/Desktop/Guns N' Roses - Welcome to the Jungle.mp3"] = info2;
  
    let songlist = [];
    songlist.push(song1);
    songlist.push(song2);
  
    await appendSongs(songlist)
  
    let songs = await getSongs();
  
    expect(JSON.stringify(songs)).toBe(JSON.stringify([
      {
        "/Desktop/Artist3 - Title3.mp3": {
          "title": "Title3",
          "artist": "Artist3"
        }
      },
      {
        "/Desktop/Guns N' Roses - Welcome to the Jungle.mp3": {
          "title": "Welcome to the Jungle",
          "artist": "Guns N' Roses"
        }
      }
    ]));

  await electronApp.close()
});

//refresh environment
test('reset', async () => {
  electronApp = await electron.launch({ args: ['../../main/main.js'] })
  await reset_songs();
  await reset_user_blank();
  await electronApp.close()
});