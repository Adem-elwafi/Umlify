const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// Initialize the PostgreSQL connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Initialize the Prisma adapter for PostgreSQL
const adapter = new PrismaPg(pool);

// Instantiate the Prisma Client using the adapter
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
