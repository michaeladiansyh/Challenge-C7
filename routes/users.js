var express = require("express");
var router = express.Router();

const user = require("../controllers/userController");
const restrict = require("../middlewares/restrict");

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.post("/register", user.register);
router.post("/login", user.login);
router.get("/list-user", restrict, user.getUsers);

module.exports = router;
