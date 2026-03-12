const SuccessStory = require('../models/SuccessStory');

exports.getAllStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find().sort('-createdAt');
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createStory = async (req, res) => {
  try {
    const story = new SuccessStory(req.body);
    const savedStory = await story.save();
    res.status(201).json(savedStory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const story = await SuccessStory.findByIdAndDelete(req.params.id);
    if (!story) return res.status(404).json({ message: 'História não encontrada' });
    res.json({ message: 'História removida com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
