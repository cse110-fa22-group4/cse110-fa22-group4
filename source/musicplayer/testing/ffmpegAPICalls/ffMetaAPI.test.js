const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')

const path = require('path');
const {
  reset_user1, reset_user2, reset_user_blank, reset_all
} = require('../fsAPITesting/fsAPITester');
const { setStoragePath, getSourceFolder } = require('../../preload/fs/fsAPICalls');
const { ffmpegRead } = require('../../preload/ffmpeg/metadata/ffMetaAPICalls');
const { getSettings } = require('../../preload/fs/settings/settingsAPICalls');


let electronApp;


test('Test ffmpegRead', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })
  await setStoragePath('users/user_1/data');

  console.log(await getSettings());
  let songPath = path.join(await getSourceFolder(), 'users/user_1/songs/Different Heaven & EH!DE - My Heart [NCS Release].mp3');

  let meta = await ffmpegRead(songPath);
  console.log(meta);
  
  await electronApp.close()

});