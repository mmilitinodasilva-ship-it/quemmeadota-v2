const mongoose = require('mongoose');

const ngoSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  contact: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    social: {
      instagram: String,
      facebook: String
    }
  },
  logo: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('NGO', ngoSchema);
