const Adoption = require('../models/Adoption');
const Pet = require('../models/Pet');

exports.getAllAdoptions = async (req, res) => {
  try {
    const adoptions = await Adoption.find().populate('petId');
    res.json(adoptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createAdoption = async (req, res) => {
  try {
    const adoption = new Adoption(req.body);
    const savedAdoption = await adoption.save();
    
    // Update pet status to reserved
    await Pet.findByIdAndUpdate(req.body.petId, { status: 'reserved' });
    
    res.status(201).json(savedAdoption);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateAdoptionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const adoption = await Adoption.findByIdAndUpdate(req.params.id, { 
      status, 
      processedDate: Date.now() 
    }, { new: true });
    
    if (!adoption) return res.status(404).json({ message: 'Solicitação não encontrada' });

    // If approved, mark pet as adopted. If rejected, mark pet as available.
    if (status === 'approved') {
      await Pet.findByIdAndUpdate(adoption.petId, { status: 'adopted' });
      
      // Emit socket event to notify all clients
      const io = req.app.get('io');
      io.emit('pet_adopted', { petId: adoption.petId.toString() });
    } else if (status === 'rejected') {
      await Pet.findByIdAndUpdate(adoption.petId, { status: 'available' });
    }

    res.json(adoption);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
