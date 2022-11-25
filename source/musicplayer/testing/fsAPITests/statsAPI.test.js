const { _electron: electron } = require('playwright')
const { test, expect } = require('@playwright/test')

const {
  reset_user1, reset_user2, reset_user3, reset_stats, reset_user_blank
} = require('../fsAPITesting/fsAPITester');
const { setStoragePath } = require('../../preload/fs/fsAPICalls');
const {
    getStats, writeToStat, deleteStat, writeStats,
  } = require('../../preload/fs/stats/statsAPICalls');

let electronApp;


test('Test getStats', async () => {
  electronApp = await electron.launch({ args: ['../main/main.js'] })
  await reset_stats();
  await setStoragePath('users/user_1/data');

  let stats = await getStats();
  expect(JSON.stringify(stats)).toBe(JSON.stringify({"total_minutes_played":60,"favorite_genre":"EDM"}));
  
  await electronApp.close()

});

test('Test writeToStat', async () => {
    electronApp = await electron.launch({ args: ['../main/main.js'] })
    await reset_stats();
    await setStoragePath('users/user_1/data');
  
    
    await writeToStat("num_songs", 3);
    let stats = await getStats();
    expect(JSON.stringify(stats)).toBe(JSON.stringify({"total_minutes_played":60,"favorite_genre":"EDM","num_songs":3}));
    
    await electronApp.close()
  
  });

  test('Test deleteStat', async () => {
    electronApp = await electron.launch({ args: ['../main/main.js'] })
    await reset_stats();
    await setStoragePath('users/user_1/data');
  
    
    await deleteStat("favorite_genre");
    let stats = await getStats();
    expect(JSON.stringify(stats)).toBe(JSON.stringify({"total_minutes_played":60}));
    
    await electronApp.close()
  
  });


  test('Test writeStats', async () => {
    electronApp = await electron.launch({ args: ['../main/main.js'] })
    await reset_stats();
    await setStoragePath('users/user_1/data');
  
    
    await writeStats({"total_minutes_played":20,"favorite_genre":"rock","num_songs":30});
    let stats = await getStats();
    expect(JSON.stringify(stats)).toBe(JSON.stringify({"total_minutes_played":20,"favorite_genre":"rock","num_songs":30}));
    
    await electronApp.close()
  
  });

//refresh environment
test('reset', async () => {
  electronApp = await electron.launch({ args: ['../../main/main.js'] })
  await reset_stats();
  await reset_user_blank();
  await electronApp.close()
});