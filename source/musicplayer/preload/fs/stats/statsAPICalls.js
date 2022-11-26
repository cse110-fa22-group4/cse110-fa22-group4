const path = require('path');
const fs = require('fs');
const {throwErr, throwErrOpen, getStoragePath} = require('../fsAPICalls');

/**
 * @name getStats
 * @description Gets the stats as a JSON formatted object.
 * @memberOf fsAPI
 * @return {Promise<object>} A JSON formatted object representing the stats.
 */
async function getStats() {
	const storagePath = await getStoragePath();
	const statsPath = path.join(storagePath, 'stats.json');
	//if (!(await fs.exists(settingsPath))) {
	await fs.exists(statsPath, async (e) => {
		//await fs.close(await fs.open(settingsPath, 'w'));
		if(!e) {
				await fs.open(statsPath, 'w', throwErrOpen);
				await fs.writeFile(statsPath, '{ }', throwErr);
		}

	});
	return JSON.parse(fs.readFileSync(statsPath, 'utf8'));
}

/**
 * @name writeStats
 * @description Rewrites the stats file using the given JSON formatted object.
 *               To modify a single stat, use writeToStat() or deleteStat()!
 * @memberOf fsAPI
 * @param {object} stats A JSON formatted object representing the entire
 * stats file.
 * @return {Promise<void>}
 */
async function writeStats(stats) {
	const storagePath = await getStoragePath();
	const statsPath = path.join(storagePath, 'stats.json');
	await fs.exists(statsPath, async (e) => {
		if(!e) {
			await fs.open(statsPath, 'w', throwErrOpen);
			await fs.writeFile(statsPath, '{ }', throwErr);
		}
	});
	await fs.writeFileSync(statsPath, JSON.stringify(stats));
}

/**
 * @name writeToStat
 * @description Modifies a single stat.
 * @memberOf fsAPI
 * @param {string} stat The stat to write to.
 * @param {string} val The value of the stat to set.
 * @return {Promise<void>}
 */
async function writeToStat(stat, val) {
	const stats = await getStats();
	stats[stat] = val;
	await writeStats(stats);
}

/**
 * @name deleteStat
 * @description Removes a stat from stats.json
 * @memberOf fsAPI
 * @param {string} stat The name of the stat to remove.
 * @return {Promise<void>}
 */
async function deleteStat(stat) {
	const stats = await getStats();
	delete stats[stat];
	await writeStats(stats);
}

module.exports = {
	getStats,
	writeStats,
	writeToStat,
	deleteStat,
};
