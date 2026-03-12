const express = require('express');
const router = express.Router();
const ngoController = require('../controllers/ngoController');
const { authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', ngoController.getAllNGOs);
router.get('/:id', ngoController.getNGOById);
router.post('/', authMiddleware, upload.single('logo'), ngoController.createNGO);
router.put('/:id', authMiddleware, upload.single('logo'), ngoController.updateNGO);
router.delete('/:id', authMiddleware, ngoController.deleteNGO);

module.exports = router;
