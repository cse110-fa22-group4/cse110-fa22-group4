const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')

const {
  testFS, reset_user1, reset_user2, reset_user3, reset,
} = require('../fsAPITesting/fsAPITester');

let electronApp;

test('Example Test Build', async () => {
  electronApp = await electron.launch({ args: ['../../main/main.js'] })

  // reset data for the user you are modifying data for
  await reset_user1;

  // make test call
  expect(3).toBe(3);

  await electronApp.close()

});

//refresh entire environment at end of file
test('reset', async () => {
  electronApp = await electron.launch({ args: ['../../main/main.js'] })
  await reset();
  await electronApp.close()
});