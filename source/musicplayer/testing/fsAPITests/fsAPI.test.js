const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')

const {
  testFS,
} = require('../fsAPITesting/fsAPITester');

let electronApp;

test('load app', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })

  await testFS();

  expect(3).toBe(3);

  await electronApp.close()

})