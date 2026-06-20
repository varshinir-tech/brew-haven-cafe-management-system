const express = require("express");
const router = express.Router();
const {
  createContactMessage,
  getContactMessages,
  markAsRead,
  deleteContactMessage,
  subscribeNewsletter,
} = require("../controllers/contactController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", createContactMessage);
router.post("/subscribe", subscribeNewsletter);
router.get("/", protect, getContactMessages);
router.put("/:id/read", protect, markAsRead);
router.delete("/:id", protect, deleteContactMessage);

module.exports = router;
