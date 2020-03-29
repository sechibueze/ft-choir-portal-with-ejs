const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  source: { type: String, required: true, default: "Admin" },
  isDeleted: { type: Boolean, default: false },
  createdAt: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model("notification", notificationSchema);