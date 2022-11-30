const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')

const {
  reset_user1, reset_user2, reset_stats, reset_user_blank
} = require('../fsAPITesting/fsAPITester');
const { setStoragePath } = require('../../preload/fs/fsAPICalls');
const {
    getStats, writeToStat, deleteStat, writeStats,
  } = require('../../preload/fs/stats/statsAPICalls');
const { BrowserWindow } = require('electron');

let electronApp;

test('load', async () => {
  electronApp = await electron.launch({ args: ['main/main.js'] })
  
  const window = await electronApp.firstWindow();
  
  console.log(await window.title());

  await electronApp.close()

});