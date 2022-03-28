var express = require("express");

var router = express.Router();

const room = require("../controllers/roomController");

const restrict = require("../middlewares/restrict");

router.post("/room", restrict, room.createRoom);

module.exports = router;
