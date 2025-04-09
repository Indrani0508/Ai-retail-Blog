const express = require('express');
const router = express.Router();

const { generateBlog, getAllBlogs } = require('../controllers/blogController');

// Route to generate and save a new blog post
router.post('/generate', generateBlog);

// Route to get all blog posts from the database
router.get('/', getAllBlogs);

module.exports = router;
