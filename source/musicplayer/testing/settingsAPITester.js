const path = require('path');
const {
    getSettings,
    writeToSetting,
    deleteSetting,
    writeSettings,
} = require('../preload/fs/settings/settingsAPICalls');

async function testSettings() {

    let settingName = 'testingStatus';
    await testGetSettings();

    // run twice to test override
    await testWriteToSetting(settingName);
    await testWriteToSetting(settingName);

    await testGetSettings();

    // run twice to test deleting non-existent setting
    await testDeleteSetting(settingName);
    await testDeleteSetting(settingName);

    let settings = await getSettings();
    await testWriteSettings(settings);

}

async function testGetSettings() {
    let settings = await getSettings();
    console.log('settings file: ' + JSON.stringify(settings));
}

async function testWriteToSetting(name) {
    let settingsOld = await getSettings();
    let val = 1;
    await writeToSetting(name, val);
    let settingsNew = await getSettings();

    for(let setting in settingsNew) {
        if(settingsOld[setting]!=settingsNew[setting]) {
            if(setting==name) {
                if(settingsNew[setting]!=val) {
                    console.error(`Setting ${name} not added properly`);
                }
            } else
                console.error(`Insertion of Setting ${name} not done properly`);
        }         
    }
    for(let setting in settingsOld) {
        if(settingsOld[setting]!=settingsNew[setting]) {
            if(setting!=name)
                console.error(`Removal of Setting ${name} not done properly`); 
        }
    }
}

async function testDeleteSetting(name) {
    let settingsOld = await getSettings();
    await deleteSetting(name);
    let settingsNew = await getSettings();

    for(let setting in settingsOld) {
        if(settingsOld[setting]!=settingsNew[setting]) {
            if(setting==name) {
                if(settingsNew[setting]!=null)
                    console.error(`Setting ${name} not removed properly`);
            } else
                console.error(`Removal of Setting ${name} not done properly`);
        }         
    }
    for(let setting in settingsNew) {
        if(settingsOld[setting]!=settingsNew[setting]) {
            console.error(`Removal of Setting ${name} not done properly`); 
        }
    }
}

async function testWriteSettings(settings) {
    await writeSettings(settings);
    let settingsNew = await getSettings();

    if(!settingsEqual(settings, settingsNew))
        console.error('WriteSettings unsuccessful');
}

function settingsEqual(settings1, settings2) {
    for(let setting in settings1) {
        if(settings1[setting]!=settings2[setting])
            return false;
    }
    for(let setting in settings2) {
        if(settings1[setting]!=settings2[setting])
            return false;
    }
    return true;
}


module.exports = {
    testSettings,
};