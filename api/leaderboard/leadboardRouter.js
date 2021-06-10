const router = require('express').Router();
const redisCache = require("../middleware/redisCache")
const {authRequired} = require('../middleware');
const leaderboard = require('./leadBoardModel');
const { crudOperationsManager } = require('../../lib/');
const logger = require("../../logger");

const redisWare = redisCache.default;

router.get('/', authRequired, redisWare, (req, res) =>{
    logger.log("LEADERBOARD!")
    const redis = req.redis; // grab redis from the middleware
    res.redis = redis; // attach to response handler for crudOps usage
    crudOperationsManager.getAll(res, leaderboard.getLeaderBoardData, 'Child')
});

module.exports = router;