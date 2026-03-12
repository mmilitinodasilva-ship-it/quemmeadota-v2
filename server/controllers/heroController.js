const HeroSection = require('../models/HeroSection');

exports.getHero = async (req, res) => {
  try {
    const hero = await HeroSection.findOne();
    if (!hero) {
      // Default hero if none exists
      return res.json({
        title: "Encontre um amigo para a vida toda",
        subtitle: "Adote um cão ou gato e transforme duas vidas.",
        imageUrl: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=1200",
        primaryButtonText: "Ver pets disponíveis",
        primaryButtonLink: "/pets",
        secondaryButtonText: "Como funciona",
        secondaryButtonLink: "#how-it-works"
      });
    }
    res.json(hero);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateHero = async (req, res) => {
  try {
    const heroData = {
      title: req.body.title,
      subtitle: req.body.subtitle,
      // Default values for missing fields to satisfy validation
      primaryButtonText: req.body.primaryButtonText || "Ver pets disponíveis",
      primaryButtonLink: req.body.primaryButtonLink || "/pets",
      secondaryButtonText: req.body.secondaryButtonText || "Como funciona",
      secondaryButtonLink: req.body.secondaryButtonLink || "#how-it-works"
    };

    if (req.file) {
      heroData.imageUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.imageUrl) {
      heroData.imageUrl = req.body.imageUrl;
    }

    let hero = await HeroSection.findOne();
    if (hero) {
      hero = await HeroSection.findByIdAndUpdate(hero._id, heroData, { new: true });
    } else {
      hero = new HeroSection(heroData);
      await hero.save();
    }
    res.json(hero);
  } catch (error) {
    console.error('Error updating hero:', error);
    res.status(400).json({ message: error.message });
  }
};
