const sh = require('shelljs'); // https://documentup.com/shelljs/shelljs
const KNEX_SEED_FOLDER = 'data/seeds';

/**
 * NOTE:
 * 
 * this script was written with brevity in mind,
 * to seed your database from the command line.
 * 
 */


/**
 * knex seed file names; shorthand
 */
const changes = {
    reset: "000_cleanup",
    cleanup: "000_cleanup",
    parents: "001_Parents",
    avatars: "002_Avatars",
    grades: "003_GradeLevels",
    stories: "004_Stories",
    cohorts: "005_Cohorts",
    children: "006_Children",
    submissions: "007_Submissions",
    art: "008_Writings_Drawings",
    writings: "008_Writings_Drawings",
    drawings: "008_Writings_Drawings",
    squads: "009_Squads",
    teams: "010_Teams",
    members: "011_Members",
    points: "012_Points",
    achievements: "013_Achievements",
    faceoffs: "014_Faceoffs",
}

/**
 * list of file names within the knex seed folder
 */
const seedFiles = sh.ls(KNEX_SEED_FOLDER).map(function (file) {
    return file
});

/**
 * searches a list of file names
 * @param {string} searchstring
 * @returns array - matches
 */
const searchName = (searchstring) => seedFiles.filter(function (fname, _, __) {
    return fname.toLowerCase().search(searchstring.toLowerCase()) > 0
});

seedFiles.forEach(function (fname) {
    changes[fname] = fname;
});

/**
 * Plant a seed of change
 * @param {string} seed
 * @returns Returns an object containing the return code and output as string.
 */
const plant = (seed) => sh.exec(`npx knex seed:run --specific="${seed}"`);
const [_, __, seed, matches] = process.argv;
const optionSwitches = ["all", "search", "--help"];
const availableOptions = Object.keys(changes) + optionSwitches + Object.keys(changes).map((s) => s + '.js'); // concatenate 3 lists


/**
 * 
 * @returns Returns an object containing the return code and output as string.
 */
function dataFarm({ option }) {
    const change = option.endsWith('.js') ? option : changes[option] + '.js';
    if (!availableOptions.includes(option)) {
        return sh.echo('do you need --help with that ?');
    }
    return plant(change);
}

function cli(virtualSeed) {
    if (!virtualSeed) {
        const fname = __filename.split('/').pop();
        sh.echo(`usage: node ${fname} {option}`)
        sh.echo('for a list of available {options}, type');
        sh.echo(`       node ${fname} --help`);
        return false;
    }
    switch (virtualSeed) {
        case "all":
            sh.echo("Running ALL seeds...");
            sh.exec('npx knex seed:run');
            break;

        case "search":
            sh.echo(searchName(matches));
            break;

        case "--help":
            sh.echo('available options');
            sh.echo(`   --help -> this!`);
            sh.echo(`   all -> 'npx knex seed:run'`);
            Object.keys(changes).map((option) => sh.echo(`   ${option} -> ${changes[option]}.js`));
            break;
        // TODO: create cases to seed the database for each stage of the game.
        default:
            dataFarm({ option: virtualSeed });
    }
    return true;
}

cli(seed);

/**
 * const { gardener } = require('./gardener');
 */
module.exports = {
    gardener: (s) => cli(s)
}