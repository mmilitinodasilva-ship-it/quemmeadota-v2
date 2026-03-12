const express = require('express');
const router = express.Router();
const successStoryController = require('../controllers/successStoryController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', successStoryController.getAllStories);
router.post('/', authMiddleware, successStoryController.createStory);
router.delete('/:id', authMiddleware, successStoryController.deleteStory);

module.exports = router;
