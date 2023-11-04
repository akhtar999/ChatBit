const {
  registerUser,
  loginUser,
  allUser,
} = require("../controllers/userConrollers");

const express = require("express");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", registerUser);
router.post("/login", loginUser);
router.get("/", protect, allUser);

module.exports = router;
