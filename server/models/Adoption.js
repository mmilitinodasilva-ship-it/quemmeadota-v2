const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
  petId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  adoptionOption: { type: String, enum: ['retirada no local', 'entrega em casa'], required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  requestDate: { type: Date, default: Date.now },
  processedDate: Date
});

module.exports = mongoose.model('Adoption', adoptionSchema);
