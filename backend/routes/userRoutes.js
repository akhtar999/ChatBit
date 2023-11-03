const { registerUser, loginUser } = require("../controllers/userConrollers");

const express = require("express");

const router = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/", allUser);

module.exports = router;
