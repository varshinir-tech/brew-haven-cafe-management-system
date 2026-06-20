const Reservation = require("../models/Reservation");

// POST /api/reservations
exports.createReservation = async (req, res) => {
  try {
    const { name, phone, date, time, guests } = req.body;
    if (!name || !phone || !date || !time || !guests) {
      return res.status(400).json({ message: "Name, phone, date, time and guests are required." });
    }
    const reservation = await Reservation.create(req.body);
    res.status(201).json(reservation);
  } catch (err) {
    res.status(400).json({ message: "Failed to create reservation.", error: err.message });
  }
};

// GET /api/reservations  (admin only)
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reservations.", error: err.message });
  }
};

// PUT /api/reservations/:id/status  (admin only)
exports.updateReservationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!reservation) return res.status(404).json({ message: "Reservation not found." });
    res.json(reservation);
  } catch (err) {
    res.status(400).json({ message: "Failed to update reservation.", error: err.message });
  }
};

// DELETE /api/reservations/:id  (admin only)
exports.deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Reservation not found." });
    res.json({ message: "Reservation deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete reservation.", error: err.message });
  }
};

// GET /api/reservations/export/csv  (admin only)
exports.exportReservationsCSV = async (req, res) => {
  try {
    const reservations = await Reservation.find().sort({ createdAt: -1 });
    const header = "Name,Phone,Email,Date,Time,Guests,SpecialRequest,Status,CreatedAt\n";
    const rows = reservations
      .map((r) => {
        const cells = [
          r.name,
          r.phone,
          r.email || "",
          r.date,
          r.time,
          r.guests,
          (r.specialRequest || "").replace(/,/g, ";"),
          r.status,
          r.createdAt.toISOString(),
        ];
        return cells.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",");
      })
      .join("\n");

    const csv = header + rows;
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=reservations.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "Failed to export reservations.", error: err.message });
  }
};
