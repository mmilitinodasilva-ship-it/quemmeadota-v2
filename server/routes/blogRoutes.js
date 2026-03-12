const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { authMiddleware } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', blogController.getAllPosts);
router.get('/:id', blogController.getPostById);
router.post('/', authMiddleware, upload.single('image'), blogController.createPost);
router.put('/:id', authMiddleware, upload.single('image'), blogController.updatePost);
router.delete('/:id', authMiddleware, blogController.deletePost);

module.exports = router;
