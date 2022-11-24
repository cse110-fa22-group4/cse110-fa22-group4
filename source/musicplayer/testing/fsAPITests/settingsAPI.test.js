const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')

const {
  reset_user1, reset_user2, reset_user3, reset
} = require('../fsAPITesting/fsAPITester');
const { testSettings } = require('../fsAPITesting/settingsAPITester');
const { setStoragePath } = require('../../preload/fs/fsAPICalls');

let electronApp;

test('something', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })

  await setStoragePath('users/user_1/data');
  testSettings();

  await electronApp.close()

});

//refresh environment
test('reset', async () => {
  electronApp = await electron.launch({ args: ['../../main/main.js'] })
  await reset();
  await electronApp.close()
});