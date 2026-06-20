const express = require("express");
const router = express.Router();
const {
  getSummary,
  getMonthlyOrders,
  getReservationTrends,
} = require("../controllers/analyticsController");
const { protect } = require("../middleware/authMiddleware");

router.get("/summary", protect, getSummary);
router.get("/monthly-orders", protect, getMonthlyOrders);
router.get("/reservation-trends", protect, getReservationTrends);

module.exports = router;
