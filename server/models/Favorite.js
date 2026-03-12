const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Simple unique ID for anonymous users (e.g. cookie-based or local storage)
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Favorite', favoriteSchema);
