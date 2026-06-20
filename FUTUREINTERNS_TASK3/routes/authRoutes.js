const express = require("express");
const router = express.Router();
const { login, getMe, register } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/login", login);
router.post("/register", register); // used by seed/setup only - consider removing in production
router.get("/me", protect, getMe);

module.exports = router;
