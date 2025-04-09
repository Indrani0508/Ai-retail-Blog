const OpenAI = require('openai');
const Blog = require('../models/Blog');

const openai = new OpenAI({
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
});

// ✅ Generate blog using Groq
const generateBlog = async (req, res) => {
  const { topic } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: [
        { role: 'system', content: 'You are a retail blog writer.' },
        { role: 'user', content: `Write an SEO-optimized blog post about: ${topic}` },
      ],
    });

    const content = response.choices[0].message.content;

    // Save blog to MongoDB
    const blog = new Blog({ topic, content });
    await blog.save();

    res.status(200).json({ content });
  } catch (error) {
    console.error("Groq API Error:", error);
    res.status(500).json({ error: 'Failed to generate blog post' });
  }
};

// ✅ Get all blogs
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
};

// ✅ Update blog by ID
const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { topic, content } = req.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { topic, content },
      { new: true }
    );
    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: 'Failed to update blog post' });
  }
};

// ✅ Delete blog by ID
const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: 'Failed to delete blog post' });
  }
};

module.exports = {
  generateBlog,
  getAllBlogs,
  updateBlog,
  deleteBlog,
};
