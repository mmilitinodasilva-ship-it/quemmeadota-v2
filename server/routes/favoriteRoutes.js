const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');

// Get all favorites for a user
router.get('/:userId', async (req, res) => {
  try {
    const favorites = await Favorite.find({ userId: req.params.userId }).populate('petId');
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add to favorites
router.post('/', async (req, res) => {
  try {
    const { userId, petId } = req.body;
    const existing = await Favorite.findOne({ userId, petId });
    if (existing) return res.status(400).json({ message: 'Pet já está nos favoritos' });
    
    const favorite = new Favorite({ userId, petId });
    await favorite.save();
    res.status(201).json(favorite);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove from favorites
router.delete('/:userId/:petId', async (req, res) => {
  try {
    const { userId, petId } = req.params;
    await Favorite.findOneAndDelete({ userId, petId });
    res.json({ message: 'Removido dos favoritos' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
