const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  species: { type: String, enum: ['cachorro', 'gato'], required: true },
  gender: { type: String, enum: ['macho', 'fêmea'], required: true },
  color: { type: String, required: true },
  age: { type: String, required: true },
  size: { type: String, enum: ['pequeno', 'médio', 'grande'], required: true },
  healthCondition: { type: String, required: true },
  vaccinationStatus: { type: String, required: true },
  personality: { type: String, required: true },
  likes: { type: String, required: true },
  story: { type: String, required: true },
  images: [{ type: String }], // Array of image URLs
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: 'NGO', required: true },
  status: { type: String, enum: ['available', 'reserved', 'adopted'], default: 'available' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pet', petSchema);
