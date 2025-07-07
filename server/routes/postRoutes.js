const express = require ("express");
const{getAllPosts, getPostById, createPost, updatePost, deletePost} = require("../controllers/postController");
const{protect, authorize} = require("../middleware/auth");
const router = express.Router();

router.get("/",protect, getAllPosts);
router.get("/:id",protect, getPostById);
router.post("/post", protect, createPost);
router.put("/update", protect,updatePost);
router.delete("/delete", protect, authorize(["admin"]), deletePost);

module.exports = router;