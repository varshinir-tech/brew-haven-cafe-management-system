const Order = require("../models/Order");

// POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { customerName, phone, items, totalAmount } = req.body;
    if (!customerName || !phone || !items || !items.length || !totalAmount) {
      return res.status(400).json({ message: "Customer name, phone, items and total are required." });
    }
    const order = await Order.create(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: "Failed to create order.", error: err.message });
  }
};

// GET /api/orders  (admin only)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders.", error: err.message });
  }
};

// PUT /api/orders/:id/status  (admin only)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json(order);
  } catch (err) {
    res.status(400).json({ message: "Failed to update order.", error: err.message });
  }
};

// DELETE /api/orders/:id  (admin only)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json({ message: "Order deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete order.", error: err.message });
  }
};
