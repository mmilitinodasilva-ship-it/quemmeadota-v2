const mongoose = require('mongoose');

const heroSectionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  imageUrl: { type: String, required: true },
  primaryButtonText: { type: String, required: true },
  primaryButtonLink: { type: String, required: true },
  secondaryButtonText: { type: String, required: true },
  secondaryButtonLink: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HeroSection', heroSectionSchema);
