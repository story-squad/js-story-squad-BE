const cron = require('node-cron');
const CronTasks = require('./cronTasks');

/**
 * Friday reveal
 * [cron scheduled tasks]
 */
async function Friday() {
    await CronTasks.updateWinsForChildren();
    await CronTasks.updateLosesForChildren();
}

/**
 * Saturday morning reset
 * [cron scheduled tasks]
 */
async function Saturday() {
    await CronTasks.addTotalPointsToChildren();
    await CronTasks.resetTable('Points');
    await CronTasks.resetTable('Members');
    await CronTasks.resetTable('Teams');
    await CronTasks.resetTable('Faceoffs');
    await CronTasks.resetTable('Squads');
}

cron.schedule('0 15 * * 5', Friday);

cron.schedule('0 11 * * 6', Saturday);

module.exports = {
    Friday,
    Saturday
};
