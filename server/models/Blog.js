const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema);
