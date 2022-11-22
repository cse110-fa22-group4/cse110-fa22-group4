const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')

const {
  testFS,
} = require('../fsAPITesting/fsAPITester');

let electronApp;

test('something', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })

  expect(20).toBe(20);

  await electronApp.close()

})