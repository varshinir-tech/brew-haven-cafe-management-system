const Order = require("../models/Order");
const Reservation = require("../models/Reservation");
const ContactMessage = require("../models/ContactMessage");

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// GET /api/analytics/summary  (admin only)
exports.getSummary = async (req, res) => {
  try {
    const [totalOrders, totalReservations, totalMessages, revenueAgg] = await Promise.all([
      Order.countDocuments(),
      Reservation.countDocuments(),
      ContactMessage.countDocuments(),
      Order.aggregate([{ $group: { _id: null, revenue: { $sum: "$totalAmount" } } }]),
    ]);

    // "Total customers" = distinct phone numbers across orders + reservations
    const [orderPhones, reservationPhones] = await Promise.all([
      Order.distinct("phone"),
      Reservation.distinct("phone"),
    ]);
    const totalCustomers = new Set([...orderPhones, ...reservationPhones]).size;

    const revenue = revenueAgg[0]?.revenue || 0;

    res.json({ totalOrders, totalReservations, totalCustomers, revenue });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch analytics summary.", error: err.message });
  }
};

// GET /api/analytics/monthly-orders  (admin only) - last 6 months
exports.getMonthlyOrders = async (req, res) => {
  try {
    const now = new Date();
    const buckets = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({ year: d.getFullYear(), month: d.getMonth(), label: MONTH_NAMES[d.getMonth()] });
    }

    const start = new Date(buckets[0].year, buckets[0].month, 1);
    const orders = await Order.find({ createdAt: { $gte: start } }).select("createdAt totalAmount");

    const counts = buckets.map((b) => ({ label: b.label, orders: 0, revenue: 0 }));
    orders.forEach((o) => {
      const idx = buckets.findIndex(
        (b) => b.year === o.createdAt.getFullYear() && b.month === o.createdAt.getMonth()
      );
      if (idx !== -1) {
        counts[idx].orders += 1;
        counts[idx].revenue += o.totalAmount;
      }
    });

    res.json(counts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch monthly orders.", error: err.message });
  }
};

// GET /api/analytics/reservation-trends  (admin only) - last 6 months
exports.getReservationTrends = async (req, res) => {
  try {
    const now = new Date();
    const buckets = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({ year: d.getFullYear(), month: d.getMonth(), label: MONTH_NAMES[d.getMonth()] });
    }

    const start = new Date(buckets[0].year, buckets[0].month, 1);
    const reservations = await Reservation.find({ createdAt: { $gte: start } }).select("createdAt guests");

    const counts = buckets.map((b) => ({ label: b.label, reservations: 0, guests: 0 }));
    reservations.forEach((r) => {
      const idx = buckets.findIndex(
        (b) => b.year === r.createdAt.getFullYear() && b.month === r.createdAt.getMonth()
      );
      if (idx !== -1) {
        counts[idx].reservations += 1;
        counts[idx].guests += r.guests;
      }
    });

    res.json(counts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reservation trends.", error: err.message });
  }
};
