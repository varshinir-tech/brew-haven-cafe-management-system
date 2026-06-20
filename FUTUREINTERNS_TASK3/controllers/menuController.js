const MenuItem = require("../models/MenuItem");

// GET /api/menu?category=Coffee&search=latte
exports.getMenuItems = async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category && category !== "All") filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };

    const items = await MenuItem.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch menu items.", error: err.message });
  }
};

// GET /api/menu/:id
exports.getMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found." });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch menu item.", error: err.message });
  }
};

// POST /api/menu  (admin only)
exports.createMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ message: "Failed to create menu item.", error: err.message });
  }
};

// PUT /api/menu/:id  (admin only)
exports.updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) return res.status(404).json({ message: "Menu item not found." });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: "Failed to update menu item.", error: err.message });
  }
};

// DELETE /api/menu/:id  (admin only)
exports.deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Menu item not found." });
    res.json({ message: "Menu item deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete menu item.", error: err.message });
  }
};
