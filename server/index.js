require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Routes
const blogRoutes = require('./routes/blogs');
const authRoutes = require('./routes/auth'); // 👈 Added auth routes

// Use Routes
app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes); // 👈 Mounted auth routes

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    
    // Start server only after DB is connected
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🌐 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// Root route
app.get('/', (req, res) => {
  res.send('🚀 Retail Blog AI backend is running!');
});

