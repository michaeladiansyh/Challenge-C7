const express = require("express");

const router = express.Router();

const fight = require("../controllers/fightController");

const restrict = require("../middlewares/restrict");

router.post("/play/:id", restrict, fight.game);

module.exports = router;
