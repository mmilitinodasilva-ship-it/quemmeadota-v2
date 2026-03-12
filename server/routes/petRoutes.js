const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const { authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', petController.getAllPets);
router.get('/stats', petController.getStats);
router.get('/:id', petController.getPetById);
router.post('/', authMiddleware, upload.array('images', 5), petController.createPet);
router.put('/:id', authMiddleware, upload.array('images', 5), petController.updatePet);
router.delete('/:id', authMiddleware, petController.deletePet);

module.exports = router;
