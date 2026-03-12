const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, chatController.getAllMessages);
router.get('/:petId', chatController.getMessagesByPet);
router.post('/', chatController.sendMessage);

module.exports = router;
