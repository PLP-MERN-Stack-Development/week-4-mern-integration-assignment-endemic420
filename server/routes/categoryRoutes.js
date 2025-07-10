const express = require('express');
const { auth, admin } = require('../middleware/auth');
const Category = require('../models/category');
const Post = require('../models/Post');
const router = express.Router();

// Get all categories (public)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error('Get categories error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get category by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (err) {
    console.error('Get category by ID error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add category (admin only)
router.post('/', auth, admin, async (req, res) => {
  const { name } = req.body;
  try {
    if (!name) return res.status(400).json({ message: 'Category name is required' });
    let category = await Category.findOne({ name });
    if (category) return res.status(400).json({ message: 'Category already exists' });
    category = new Category({ name });
    await category.save();
    res.json(category);
  } catch (err) {
    console.error('Add category error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete category (admin only)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    const posts = await Post.find({ category: req.params.id });
    if (posts.length > 0) return res.status(400).json({ message: 'Cannot delete category with associated posts' });
    await category.deleteOne(); // Updated to avoid deprecation warning
    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error('Delete category error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;