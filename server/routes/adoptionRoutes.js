const express = require('express');
const router = express.Router();
const adoptionController = require('../controllers/adoptionController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, adoptionController.getAllAdoptions);
router.post('/', adoptionController.createAdoption);
router.patch('/:id/status', authMiddleware, adoptionController.updateAdoptionStatus);

module.exports = router;
