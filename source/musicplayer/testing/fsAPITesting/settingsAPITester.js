const path = require('path');
const {
    getSettings,
    writeToSetting,
    deleteSetting,
    writeSettings,
} = require('../../preload/fs/settings/settingsAPICalls');

/**
 * @description Runs unit tests for settings API.
 * @return {Promise<void>}
 */
async function testSettings() {

    let settingName = 'testingStatus';
    await testGetSettings();

    // run twice to test override
    await testWriteToSetting(settingName, 1);
    await testWriteToSetting(settingName, 1);

    await testGetSettings();

    // run twice to test deleting non-existent setting
    await testDeleteSetting(settingName);
    await testDeleteSetting(settingName);

    let settings = await getSettings();
    await testWriteSettings(settings);

}

/**
 * @description Unit test for getSettings(). Prints out the settings file
 * @return {Promise<void>}
 */
async function testGetSettings() {
    let settings = await getSettings();
}

/**
 * @description Unit test for writeToSetting()
 * @param {string} name Name of the setting field to write
 * @param {*} val Value of the setting
 * @return {Promise<void>}
 */
async function testWriteToSetting(name, val) {
    // capture settings
    let settingsOld = await getSettings();
    await writeToSetting(name, val);
    let settingsNew = await getSettings();

    //compare settings
    for(let setting in settingsNew) {
        if(settingsOld[setting]!=settingsNew[setting]) {
            if(setting==name) {
                if(settingsNew[setting]!=val) {
                    // new setting value not achieved
                    console.error(`Setting ${name} not added properly`);
                }
            } else // other values affected
                console.error(`Insertion of Setting ${name} not done properly`);
        }         
    }
    for(let setting in settingsOld) {
        if(settingsOld[setting]!=settingsNew[setting]) {
            if(setting!=name) // other values affected
                console.error(`Removal of Setting ${name} not done properly`); 
        }
    }
}

/**
 * @description Unit test for deleteSetting()
 * @param {string} name Setting field to delete
 * @return {Promise<void>}
 */
async function testDeleteSetting(name) {
    // capture settings
    let settingsOld = await getSettings();
    await deleteSetting(name);
    let settingsNew = await getSettings();

    //compare settings
    for(let setting in settingsOld) {
        if(settingsOld[setting]!=settingsNew[setting]) {
            if(setting==name) {
                if(settingsNew[setting]!=null) // value not removed
                    console.error(`Setting ${name} not removed properly`);
            } else // other values affected
                console.error(`Removal of Setting ${name} not done properly`);
        }         
    }
    for(let setting in settingsNew) {
        if(settingsOld[setting]!=settingsNew[setting]) { // other values affected
            console.error(`Removal of Setting ${name} not done properly`); 
        }
    }
}


/**
 * @description Unit test for writeSettings()
 * @param {object} settings The new settings to set, in JSON format.
 * @return {Promise<void>}
 */
async function testWriteSettings(settings) {
    await writeSettings(settings);
    let settingsNew = await getSettings();

    // check for equality
    if(!settingsEqual(settings, settingsNew))
        console.error('WriteSettings unsuccessful');
}

/**
* @description Checks if two setting objects have equal fields
 * @param {object} settings1 JSON format settings
 * @param {object} settings2 Another JSON format settings
 * @returns {boolean} Whether the settings are equal
 */
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