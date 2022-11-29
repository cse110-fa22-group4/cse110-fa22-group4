const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')

const {
  reset_user1, reset_user2, reset_settings, reset_user_blank
} = require('../fsAPITesting/fsAPITester');
const { testSettings } = require('../fsAPITesting/settingsAPITester');
const { setStoragePath } = require('../../preload/fs/fsAPICalls');
const { getSetting, getSettings, writeSettings, writeToSetting, deleteSetting } = require('../../preload/fs/settings/settingsAPICalls');

let electronApp;

/**
 * Testing settings using old testing code
 */
test('Testing settings', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })

  await reset_user1();
  await setStoragePath('users/user_1/data');
  await testSettings();

  
  await electronApp.close()

});

/**
 * Test getSettings
 */
test('Test getSettings for user 1', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })
  await reset_user1();
  await setStoragePath('users/user_1/data');

  let settings = await getSettings();

  expect(JSON.stringify(settings)).toBe(JSON.stringify({"Which User is this?":"1","testing":"100"}));
  
  await electronApp.close()

});

test('Test getSettings for user 2', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })
  await reset_user2();
  await setStoragePath('users/user_2/data');

  let settings = await getSettings();

  expect(JSON.stringify(settings)).toBe(JSON.stringify({}));
  
  await electronApp.close()

});


test('Test getSettings for user blank', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })
  await reset_user_blank();
  await setStoragePath('users/user_blank/data');

  let settings = await getSettings();

  expect(JSON.stringify(settings)).toBe(JSON.stringify({}));
  
  await electronApp.close()

});

/**
 * Test getSetting
 */
test('Test getSetting for user 1', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })
  await reset_user1();
  await setStoragePath('users/user_1/data');

  let setting = await getSetting('testing');
  expect(JSON.parse(setting)).toBe(100);

  setting = await getSetting('Which User is this?');
  expect(JSON.parse(setting)).toBe(1);
  
  await electronApp.close()

});

test('Test getSetting for user 2', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })
  await reset_user2();
  await setStoragePath('users/user_2/data');

  let setting = await getSetting('DNE');

  if(setting != null)
    expect(JSON.parse(setting)).toBe("something that it definitely is not equal to");
  
  await electronApp.close()

});

test('Test getSetting for user blank', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })
  await reset_user_blank();
  await setStoragePath('users/user_blank/data');

  let setting = await getSetting('garbage_setting_that_does_not_exist');
  
  if(setting != null)
    expect(JSON.parse(setting)).toBe("something that it definitely is not equal to");
  
  await electronApp.close()

});

/**
 * Test writeToSetting for user 1
 */
test('Test writeToSetting for user 1', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })
  await reset_user1();
  await setStoragePath('users/user_1/data');

  await writeToSetting("written", 1);
  let settings = await getSettings();
  expect(JSON.stringify(settings)).toBe(JSON.stringify({"Which User is this?":"1","testing":"100","written":"1"}));
  
  await electronApp.close()

});

/**
 * Test writeToSetting for user 2
 */
 test('Test writeToSetting for user 2', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })
  await reset_user2();
  await setStoragePath('users/user_2/data');

  await writeToSetting("write", 2);
  let settings = await getSettings();
  expect(JSON.stringify(settings)).toBe(JSON.stringify({"write":"2"}));
  
  await electronApp.close()

});

/**
 * Test writeToSetting for user blank
 */
 test('Test writeToSetting for user blank', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })
  await reset_user_blank();
  await setStoragePath('users/user_blank/data');

  await writeToSetting("written", 5);
  let settings = await getSettings();
  expect(JSON.stringify(settings)).toBe(JSON.stringify({"write":"5"}));
  
  await electronApp.close()

});

/**
 * Test deleteSetting for user 1
 */
test('Test deleteSetting for user 1', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })
  await reset_user1();
  await setStoragePath('users/user_1/data');

  await deleteSetting("testing");
  let settings = await getSettings();
  expect(JSON.stringify(settings)).toBe(JSON.stringify({"Which User is this?":"1"}));
  
  await electronApp.close()

});

/**
 * Test deleteSetting for user 2
 */
 test('Test deleteSetting for user 2', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })
  await reset_user2();
  await setStoragePath('users/user_2/data');

  await deleteSetting("testing");
  let settings = await getSettings();
  expect(JSON.stringify(settings)).toBe(JSON.stringify({}));
  
  await electronApp.close()

});

/**
 * Test deleteSetting for user blank
 */
 test('Test deleteSetting for user blank', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })
  await reset_user_blank();
  await setStoragePath('users/user_blank/data');

  await deleteSetting("testing");
  let settings = await getSettings();
  expect(JSON.stringify(settings)).toBe(JSON.stringify({}));
  
  await electronApp.close()

});

/**
 * Test writeSettings for user 1
 */
 test('Test writeSettings for user 1', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })
  await reset_user1();
  await setStoragePath('users/user_1/data');

  await writeSettings({"hello": "0","testing": "10"});
  let settings = await getSettings();
  expect(JSON.stringify(settings)).toBe(JSON.stringify({"hello": "0","testing": "10"}));
  
  await electronApp.close()

});

/**
 * Test writeSettings for user 2
 */
 test('Test writeSettings for user 2', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })
  await reset_user2();
  await setStoragePath('users/user_2/data');

  await writeSettings({"hello": "2","testing": "3"});
  let settings = await getSettings();
  expect(JSON.stringify(settings)).toBe(JSON.stringify({"hello": "2","testing": "3"}));
  
  await electronApp.close()

});

/**
 * Test writeSettings for user blank
 */
 test('Test writeSettings for user blank', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })
  await reset_user_blank();
  await setStoragePath('users/user_blank/data');

  await writeSettings({"hello": "5","testing": "6"});
  let settings = await getSettings();
  expect(JSON.stringify(settings)).toBe(JSON.stringify({"hello": "5","testing": "6"}));
  
  await electronApp.close()

});



//refresh environment
test('reset', async () => {
  electronApp = await electron.launch({ args: ['../../main/main.js'] })
  await reset_settings();
  await reset_user_blank();
  await electronApp.close()
});