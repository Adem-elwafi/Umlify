// src/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const app = express();

/**
 * Prisma v7 Initialization
 * -----------------------
 * In Prisma v7, the 'datasources' option is removed. 
 * Since schema.prisma does not have a hardcoded URL, we must provide
 * a Driver Adapter (PrismaPg) initialized with our DATABASE_URL.
 */
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Foundational Architectural Health Check Route
app.get('/api/health', async (req, res) => {
  try {
    // Basic verification check query to ensure database connectivity
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
