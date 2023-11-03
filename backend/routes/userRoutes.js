const { registerUser } = require("../controllers/userConrollers");

const express = require(express);

const router = express.Router();

router.route("/").post(registerUser);
// router.post("/login", authUser);

module.exports = router;
