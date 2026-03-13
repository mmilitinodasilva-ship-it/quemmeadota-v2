const BlogPost = require('../models/BlogPost');

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await BlogPost.find().sort('-createdAt');
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post não encontrado' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const postData = { ...req.body };
    if (req.file) {
      postData.image = req.file.path;
    }
    const post = new BlogPost(postData);
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const postData = { ...req.body };
    if (req.file) {
      postData.image = req.file.path;
    }
    const post = await BlogPost.findByIdAndUpdate(req.params.id, postData, { new: true });
    if (!post) return res.status(404).json({ message: 'Post não encontrado' });
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post não encontrado' });
    res.json({ message: 'Post removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
