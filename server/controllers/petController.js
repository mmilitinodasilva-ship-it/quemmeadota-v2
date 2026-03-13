const Pet = require('../models/Pet');
const NGO = require('../models/NGO');

exports.getAllPets = async (req, res) => {
  try {
    const { species, age, size, status, search, color } = req.query;
    let query = {};

    if (species) query.species = species;
    if (age) query.age = age;
    if (size) query.size = size;
    if (status) query.status = status;
    if (color) query.color = color;
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const pets = await Pet.find(query).populate('ngoId');
    res.json(pets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('ngoId');
    if (!pet) return res.status(404).json({ message: 'Pet não encontrado' });
    res.json(pet);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPet = async (req, res) => {
  try {
    const petData = { ...req.body };
    
    // Handle uploaded images
    if (req.files && req.files.length > 0) {
      petData.images = req.files.map(file => file.path);
    } else if (typeof req.body.images === 'string') {
      petData.images = [req.body.images];
    }

    const pet = new Pet(petData);
    const savedPet = await pet.save();
    res.status(201).json(savedPet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updatePet = async (req, res) => {
  try {
    const petData = { ...req.body };
    
    // Process images
    const existingImages = Array.isArray(req.body.existingImages) 
      ? req.body.existingImages 
      : (req.body.existingImages ? [req.body.existingImages] : []);
    
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map(file => file.path);
    }
    
    // Always update images field if it's sent in the request (even if only existing ones are kept)
    if (req.files?.length > 0 || req.body.existingImages !== undefined) {
      petData.images = [...existingImages, ...newImages];
    }

    const pet = await Pet.findByIdAndUpdate(req.params.id, petData, { new: true });
    if (!pet) return res.status(404).json({ message: 'Pet não encontrado' });

    // If status changed to adopted, notify clients
    if (pet.status === 'adopted') {
      const io = req.app.get('io');
      io.emit('pet_adopted', { petId: pet._id.toString() });
    }

    res.json(pet);
  } catch (error) {
    console.error('Error updating pet:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.deletePet = async (req, res) => {
  try {
    const petId = req.params.id;
    const pet = await Pet.findByIdAndDelete(petId);
    if (!pet) return res.status(404).json({ message: 'Pet não encontrado' });

    // Notify clients that pet was removed
    const io = req.app.get('io');
    io.emit('pet_removed', { petId });

    res.json({ message: 'Pet removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getStats = async (req, res) => {
  try {
    const totalPets = await Pet.countDocuments();
    const availablePets = await Pet.countDocuments({ status: 'available' });
    const adoptedPets = await Pet.countDocuments({ status: 'adopted' });
    const reservedPets = await Pet.countDocuments({ status: 'reserved' });
    
    const petsBySpecies = await Pet.aggregate([
      { $group: { _id: '$species', count: { $sum: 1 } } }
    ]);

    res.json({
      totalPets,
      availablePets,
      adoptedPets,
      reservedPets,
      petsBySpecies
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
