const express = require ("express");
const {createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory, getPostsByCategory} = require ("../controllers/categoryController");
const {protect, authorize} = require("../middleware/auth");
const router = express.Router();

router.get('/api/categories', protect, getAllCategories);
router.get('/api/categories/:id', protect, getCategoryById);
router.post('/api/categories',protect, authorize(["admin"]), createCategory);
router.put('/api/categories/:id', protect, authorize (["admin"]), updateCategory);
router.delete('/api/categories/:id', protect, authorize (["admin"]),deleteCategory);
router.get('/api/categories/:id/posts', getPostsByCategory);

module.exports = router;