const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  beforePhoto: { type: String, required: true },
  afterPhoto: { type: String, required: true },
  adoptionDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SuccessStory', successStorySchema);
