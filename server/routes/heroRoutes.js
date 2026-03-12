const express = require('express');
const router = express.Router();
const heroController = require('../controllers/heroController');
const { authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', heroController.getHero);
router.put('/', authMiddleware, upload.single('image'), heroController.updateHero);

module.exports = router;
