const ContactMessage = require("../models/ContactMessage");
const Subscriber = require("../models/Subscriber");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact
exports.createContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email and message are required." });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }
    const contactMessage = await ContactMessage.create(req.body);
    res.status(201).json(contactMessage);
  } catch (err) {
    res.status(400).json({ message: "Failed to send message.", error: err.message });
  }
};

// GET /api/contact  (admin only)
exports.getContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch messages.", error: err.message });
  }
};

// PUT /api/contact/:id/read  (admin only)
exports.markAsRead = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!msg) return res.status(404).json({ message: "Message not found." });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ message: "Failed to update message.", error: err.message });
  }
};

// DELETE /api/contact/:id  (admin only)
exports.deleteContactMessage = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found." });
    res.json({ message: "Message deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete message.", error: err.message });
  }
};

// POST /api/contact/subscribe  (newsletter)
exports.subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Please provide a valid email address." });
    }
    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(200).json({ message: "You're already subscribed!" });
    }
    await Subscriber.create({ email });
    res.status(201).json({ message: "Subscribed successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Failed to subscribe.", error: err.message });
  }
};
