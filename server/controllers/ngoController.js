const NGO = require('../models/NGO');
const Pet = require('../models/Pet');

exports.getAllNGOs = async (req, res) => {
  try {
    const ngos = await NGO.find();
    
    // Add animal count for each NGO (only available pets)
    const ngosWithCount = await Promise.all(ngos.map(async (ngo) => {
      const animalCount = await Pet.countDocuments({ ngoId: ngo._id, status: 'available' });
      return { ...ngo._doc, animalCount };
    }));
    
    res.json(ngosWithCount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNGOById = async (req, res) => {
  try {
    const ngo = await NGO.findById(req.params.id);
    if (!ngo) return res.status(404).json({ message: 'ONG não encontrada' });
    const animalCount = await Pet.countDocuments({ ngoId: ngo._id });
    res.json({ ...ngo._doc, animalCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createNGO = async (req, res) => {
  try {
    const { body, file } = req;
    
    const ngoData = {
      name: body.name,
      description: body.description,
      location: {
        address: body['location[address]'] || body.location?.address,
        city: body['location[city]'] || body.location?.city,
        state: body['location[state]'] || body.location?.state,
        latitude: parseFloat(body['location[latitude]'] || body.location?.latitude) || 0,
        longitude: parseFloat(body['location[longitude]'] || body.location?.longitude) || 0
      },
      contact: {
        phone: body['contact[phone]'] || body.contact?.phone,
        email: body['contact[email]'] || body.contact?.email,
        social: {
          instagram: body['contact[social][instagram]'] || body.contact?.social?.instagram || '',
          facebook: body['contact[social][facebook]'] || body.contact?.social?.facebook || ''
        }
      }
    };

    if (file) {
      ngoData.logo = file.path;
    } else if (body.logo) {
      ngoData.logo = body.logo;
    }

    const ngo = new NGO(ngoData);
    const savedNGO = await ngo.save();
    res.status(201).json(savedNGO);
  } catch (error) {
    console.error('Error creating NGO:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.updateNGO = async (req, res) => {
  try {
    const { body, file } = req;
    const ngoId = req.params.id;

    const ngoData = {
      name: body.name,
      description: body.description,
      location: {
        address: body['location[address]'] || body.location?.address,
        city: body['location[city]'] || body.location?.city,
        state: body['location[state]'] || body.location?.state,
        latitude: parseFloat(body['location[latitude]'] || body.location?.latitude) || 0,
        longitude: parseFloat(body['location[longitude]'] || body.location?.longitude) || 0
      },
      contact: {
        phone: body['contact[phone]'] || body.contact?.phone,
        email: body['contact[email]'] || body.contact?.email,
        social: {
          instagram: body['contact[social][instagram]'] || body.contact?.social?.instagram || '',
          facebook: body['contact[social][facebook]'] || body.contact?.social?.facebook || ''
        }
      }
    };

    if (file) {
      ngoData.logo = file.path;
    } else if (body.logo) {
      ngoData.logo = body.logo;
    }

    const ngo = await NGO.findByIdAndUpdate(ngoId, ngoData, { new: true });
    if (!ngo) return res.status(404).json({ message: 'ONG não encontrada' });
    res.json(ngo);
  } catch (error) {
    console.error('Error updating NGO:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.deleteNGO = async (req, res) => {
  try {
    const ngoId = req.params.id;
    const ngo = await NGO.findByIdAndDelete(ngoId);
    if (!ngo) return res.status(404).json({ message: 'ONG não encontrada' });
    
    // Also delete pets associated with this NGO
    const pets = await Pet.find({ ngoId });
    await Pet.deleteMany({ ngoId });
    
    // Notify clients that pets were removed
    const io = req.app.get('io');
    pets.forEach(pet => {
      io.emit('pet_removed', { petId: pet._id });
    });
    
    res.json({ message: 'ONG e seus animais removidos com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
