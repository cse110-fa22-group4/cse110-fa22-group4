const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')

const {
  reset, reset_user1, reset_user2, reset_user3, songTest,
} = require('../fsAPITesting/fsAPITester');
const { setStoragePath } = require('../../preload/fs/fsAPICalls');

let electronApp;

test('load app', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })

  // reset the user whose data you will modify
  await reset_user1();

  // set the user you want
  await setStoragePath('users/user_1/data');

  // run test
  expect(3).toBe(3);
  songTest();

  await electronApp.close()
}); 

//refresh whole environment
test('reset', async () => {
  electronApp = await electron.launch({ args: ['../../main/main.js'] })
  await reset();
  await electronApp.close()
});