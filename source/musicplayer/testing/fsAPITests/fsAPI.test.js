const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')
const path = require('path');

const {
  reset_all, reset_user1, reset_user2, reset_user_blank,
} = require('../fsAPITesting/fsAPITester');
const { setStoragePath, throwErr, throwErrOpen, getStoragePath, getSourceFolder, recursiveSearchAtPath, getSRCString } = require('../../preload/fs/fsAPICalls');

let electronApp;

//throwErr test
test('throwErr Test', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })

  try {
    throwErr('test-error');
    // no error, fail test
    expect(1).toBe(2);
  } catch(err) {
    // error caught
    expect(err).toBe('test-error');
  }

  await electronApp.close()
}); 

//throwErrOpen test
test('throwErrOpen Test', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })

  // not sure how to test this one
  /*
  try {
    throwErrOpen('', 9999919);
    // no error, fail test
    //expect(1).toBe(2);
  } catch(err) {
    // error caught
  }*/

  await electronApp.close()
}); 

//fsInit test
test('fsInit Test', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })

  // not sure how to test this one

  await electronApp.close()
}); 

//StoragePath tests
test('StoragePath Tests', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })

  await setStoragePath('users/user_1/data');
  let local = await getSourceFolder();
  let storage = await getStoragePath();
  let p = path.join(local, 'users/user_1/data');

  expect(p).toBe(storage);

  await electronApp.close()
}); 

//getSRCString test
test('getSRCString Test', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })

  expect(await getSRCString('Tobu - Hope [NCS Release].mp3')).toBe('file:///Tobu - Hope [NCS Release].mp3');

  await electronApp.close()
}); 


//recursivelySearchAtPath tests
test('recursivelySearchAtPath Test', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })
  let source = await getSourceFolder();
  let p = path.join(source, 'users/user_1/songs');
  let songs = (await recursiveSearchAtPath(p));

  expect(songs[0]).toBe(path.join(source, 'users/user_1/songs/Tobu/Tobu - Hope [NCS Release].mp3'));
  expect(songs[1]).toBe(path.join(source, 'users/user_1/songs/Tobu/Tobu - Infectious [NCS Release].mp3'));
  expect(songs[2]).toBe(path.join(source, 'users/user_1/songs//Different Heaven & EH!DE - My Heart [NCS Release].mp3'));

  p = path.join(source, 'users/user_blank/songs');
  songs = (await recursiveSearchAtPath(p));
  expect(songs).toStrictEqual([]);

  await electronApp.close()
}); 


//refresh whole environment
test('reset', async () => {
  electronApp = await electron.launch({ args: ['../../main/main.js'] })
  await reset_all();
  await electronApp.close()
});