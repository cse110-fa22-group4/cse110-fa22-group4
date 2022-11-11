const {path} = require('path');
const {fs} = require('fs');
const {storagePath} = require('../fsAPICalls');

/**
 * @name getStats
 * @description Gets the stats as a JSON formatted object.
 * @memberOf fsAPI
 * @return {object} A JSON formatted object representing the stats.
 */
function getStats() {
    const statsPath = path.join(storagePath, 'stats.json');
    if (!fs.existsSync(statsPath)) {
        fs.closeSync(fs.openSync(statsPath, 'w'));
        fs.writeFileSync(statsPath, '{ }');
    }
    return JSON.parse(fs.readFileSync(statsPath, 'utf8'));
}

/**
 * @name writeStats
 * @description Rewrites the stats file using the given JSON formatted object.
 *               To modify a single stat, use writeToStat() or deleteStat()!
 * @memberOf fsAPI
 * @param {object} stats A JSON formatted object representing the entire
 * stats file.
 * @return {void}
 */
function writeStats(stats) {
    const statsPath = path.join(storagePath, 'stats.json');
    if (!fs.existsSync(statsPath)) {
        fs.closeSync(fs.openSync(statsPath, 'w'));
    }
    fs.writeFileSync(statsPath, JSON.stringify(stats));
}

/**
 * @name writeToStat
 * @description Modifies a single stat.
 * @memberOf fsAPI
 * @param {string} stat The stat to write to.
 * @param {string} val The value of the stat to set.
 * @return {void}
 */
function writeToStat(stat, val) {
    const stats = getStats();
    stats[stat] = val;
    writeStats(stats);
}

/**
 * @name deleteStat
 * @description Removes a stat from stats.json
 * @memberOf fsAPI
 * @param {string} stat The name of the stat to remove.
 * @return {void}
 */
function deleteStat(stat) {
    const stats = getStats();
    delete stats[stat];
    writeStats(stats);
}

module.exports = {
    getStats,
    writeStats,
    writeToStat,
    deleteStat,
};