// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../db');

/**
 * @route   POST /api/auth/signup
 * @desc    Secure account registration pipeline
 */
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Boundary check input criteria variables
    if (!email || !password) {
      return res.status(400).json({ error: "Validation Failure", message: "Email and password properties are mandatory fields." });
    }

    // Check database tracking context for identical existing records
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(409).json({ error: "Conflict Error", message: "An account with this email identifier is already registered." });
    }

    // Cryptographic hash generation using a workload factor matrix of 10
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save persistence transaction record to remote Neon cluster
    const newUser = await prisma.user.create({
      data: {
        email,
        name: name || null,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });

    res.status(201).json({
      message: "Account creation successful",
      user: newUser
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Stateless session initialization vector
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Validation Failure", message: "Email and password properties are required fields." });
    }

    // Verify account existence index matching the lookup token
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: "Authentication Failed", message: "Invalid access credentials supplied." });
    }

    // Compare raw incoming string matrix directly against encrypted database hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Authentication Failed", message: "Invalid access credentials supplied." });
    }

    // Issue cryptographically signed token configured with 24-hour expiration duration
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      message: "Session verification successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

module.exports = router;