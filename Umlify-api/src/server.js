// src/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import authentication channel listeners
const authRoutes = require('./routes/authRoutes');
const prisma = require('./db');

const app = express();

const PORT = process.env.PORT || 5000;

// Application Middleware Stack Configuration
app.use(cors());
app.use(express.json());

// 🚀 Mount Core Authentication API Channels
app.use('/api/auth', authRoutes);

// Foundational Architectural Health Check Route
app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: "healthy",
      timestamp: new Date(),
      database: "connected",
      environment: "production_ready"
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      database: "disconnected",
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Umlify Core Director API running smoothly on port ${PORT}`);
});