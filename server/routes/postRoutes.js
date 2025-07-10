const express = require('express');
const { auth } = require('../middleware/auth');
const Post = require('../models/Post');
const router = express.Router();

// Get all posts or filter by category
router.get('/', async (req, res) => {
  try {
    const { categoryId } = req.query;
    const query = categoryId ? { category: categoryId } : {};
    const posts = await Post.find(query).populate('category').populate('author', 'name');
    res.json(posts);
  } catch (err) {
    console.error('Get posts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user posts or filter by category
router.get('/my-posts', auth, async (req, res) => {
  try {
    const { categoryId } = req.query;
    const query = { author: req.user.id, ...(categoryId && { category: categoryId }) };
    const posts = await Post.find(query).populate('category').populate('author', 'name');
    res.json(posts);
  } catch (err) {
    console.error('Get my posts error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('category').populate('author', 'name');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    console.error('Get post by ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create post
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content || !category) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const post = new Post({ title, content, category, author: req.user.id });
    await post.save();
    res.json(post);
  } catch (err) {
    console.error('Create post error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update post
router.put('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    Object.assign(post, req.body);
    await post.save();
    res.json(post);
  } catch (err) {
    console.error('Update post error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;