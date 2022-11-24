const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')

const {
  reset_user1, reset_user2, reset_user3, reset
} = require('../fsAPITesting/fsAPITester');
const { testSettings } = require('../fsAPITesting/settingsAPITester');
const { setStoragePath } = require('../../preload/fs/fsAPICalls');
const { getSetting, getSettings, writeSettings, writeToSetting, deleteSetting } = require('../../preload/fs/settings/settingsAPICalls');

let electronApp;

test('Testing settings', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })

  await reset_user1();

  await setStoragePath('users/user_1/data');
  await testSettings();

  
  await electronApp.close()

});


test('Test getSettings', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })
  await reset_user1();
  await setStoragePath('users/user_1/data');

  let settings = await getSettings();

  expect(JSON.stringify(settings)).toBe(JSON.stringify({"Which User is this?":1,"testing":100}));
  
  await electronApp.close()

});

test('Test getSetting', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })
  await reset_user1();
  await setStoragePath('users/user_1/data');

  let setting = await getSetting('testing');

  expect(setting).toBe(100);
  
  await electronApp.close()

});

test('Test writeSettings', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })
  await reset_user1();
  await setStoragePath('users/user_1/data');

  await writeSettings({"hello": 0,"testing": 10});
  let settings = await getSettings();
  expect(JSON.stringify(settings)).toBe(JSON.stringify({"hello": 0,"testing": 10}));
  
  await electronApp.close()

});

test('Test writeToSetting', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })
  await reset_user1();
  await setStoragePath('users/user_1/data');

  await writeToSetting("written", 1);
  let settings = await getSettings();
  expect(JSON.stringify(settings)).toBe(JSON.stringify({"Which User is this?":1,"testing":100,"written":1}));
  
  await electronApp.close()

});


test('Test deleteSetting', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })
  await reset_user1();
  await setStoragePath('users/user_1/data');

  await deleteSetting("testing");
  let settings = await getSettings();
  expect(JSON.stringify(settings)).toBe(JSON.stringify({"Which User is this?":1}));
  
  await electronApp.close()

});



//refresh environment
test('reset', async () => {
  electronApp = await electron.launch({ args: ['../../main/main.js'] })
  await reset();
  await electronApp.close()
});