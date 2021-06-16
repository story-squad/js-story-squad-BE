const router = require('express').Router();
// const authRequired = require('../middleware/authRequired');  
const scheduler = require('./scheduler');
const { gardener } = require('../../gardener');
/**
 *                    /dev
 * 
 * provides a route to progress through the game;
 *               for UX testing
 */

DEVELOPER_KEY = process.env.DEVELOPER_KEY || "TEST";

router.post('/friday', async (req, res) => {
    const { body } = req;
    if (!body || body.developer !== DEVELOPER_KEY) {
        res.status(403).json({
            message: "you really shouldn't be here"
        });
        return
    }
    const result = scheduler.Friday();
    res.status(200).json([result])
})

router.post('/saturday', async (req, res) => {
    const { body } = req;
    if (!body || body.developer !== DEVELOPER_KEY) {
        res.status(403).json({
            message: "you really shouldn't be here"
        });
        return
    }
    const result = scheduler.Saturday();
    res.status(200).json([result]);
})

router.post('/zeroday', async (req, res) => {
    const { body } = req;
    if (!body || body.developer !== DEVELOPER_KEY) {
        res.status(403).json({
            message: "you really shouldn't be here"
        });
        return
    }
    const s = [
        "zeroday",
        "reset",
        "parents",
        "avatars",
        "grades",
        "stories",
        "cohorts",
        "children"
    ]
    let results = [];
    s.forEach(seed => {
        results.push(gardener(seed));
    });
    res.status(200).json([...results]);
})

router.post('/play', async (req, res) => {
    const { body } = req;
    if (!body || body.developer !== DEVELOPER_KEY) {
        res.status(403).json({
            message: "you really shouldn't be here"
        });
        return
    }
    const s = [
        "submissions",
        "art"
    ]
    let results = [];
    s.forEach(seed => {
        results.push(gardener(seed));
    });
    res.status(200).json([...results]);
})

router.post('/pair', async (req, res) => {
    const { body } = req;
    if (!body || body.developer !== DEVELOPER_KEY) {
        res.status(403).json({
            message: "you really shouldn't be here"
        });
        return
    }
    const s = [
        'squads',
        'teams',
        'members'
    ]
    let results = [];
    s.forEach(seed => {
        results.push(gardener(seed));
    });
})

router.post('/reveal', async (req, res) => {
    const { body } = req;
    if (!body || body.developer !== DEVELOPER_KEY) {
        res.status(403).json({
            message: "you really shouldn't be here"
        });
        return
    }
    const s = [
        "points",
        "achievements",
        "faceoffs"
    ]
    let results = [];
    s.forEach(seed => {
        results.push(gardener(seed));
    });
})

router.get('/', async (req, res) => {
    const available = Object.keys(scheduler).map(s => s.toLowerCase());
    res.status(200).json({
        available: [...available,
            "zeroday", "play", "pair", "reveal"]
    });
});

module.exports = router;
