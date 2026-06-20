const express = require("express");
const router = express.Router();
const {
  createReservation,
  getReservations,
  updateReservationStatus,
  deleteReservation,
  exportReservationsCSV,
} = require("../controllers/reservationController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", createReservation);
router.get("/", protect, getReservations);
router.get("/export/csv", protect, exportReservationsCSV);
router.put("/:id/status", protect, updateReservationStatus);
router.delete("/:id", protect, deleteReservation);

module.exports = router;
