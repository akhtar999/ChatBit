const express = require("express");
const { protect } = require("../middlewares/authMiddleware");
const {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
} = require("../controllers/chatControllers");

const router = express.Router();

router.post("/", protect, accessChat);
router.get("/", protect, fetchChat);

router.post("/group", protect, createGroupChat);
router.put("/rename", protect, renameGroup); // since it going to update the name (.put)
// router.put("/removegroup", protect, removeFromGroup);
// router.put("/groupadd", protect, addToGroup);

module.exports = router;
