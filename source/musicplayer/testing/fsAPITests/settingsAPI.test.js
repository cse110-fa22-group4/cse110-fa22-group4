const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')

const {
  testFS, reset_user1, reset_user2, reset_user3, reset,
} = require('../fsAPITesting/fsAPITester');

let electronApp;

test('something', async () => {
  electronApp = await electron.launch({ args: ['../../main/main.js'] })

  expect(20).toBe(20);

  await electronApp.close()

});

//refresh environment
test('reset', async () => {
  electronApp = await electron.launch({ args: ['../../main/main.js'] })
  await reset();
  await electronApp.close()
});

