// src/routes/diagramRoutes.js
const express = require('express');
const router = express.Router();
const prisma = require('../db');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Force strict session interception across all diagram interaction pipelines
router.use(authenticateToken);

/**
 * @route   POST /api/diagrams/save
 * @desc    Upsert canvas configurations (Save new or overwrite owned diagram)
 */
router.post('/save', async (req, res) => {
  try {
    const { id, title, payload } = req.body;
    const userId = req.user.id; // Extracted directly from secure JWT verification payload

    if (!title || !payload) {
      return res.status(400).json({
        error: "Validation Failure",
        message: "The diagram 'title' and structural canvas 'payload' objects are mandatory fields."
      });
    }

    // 🔄 Conditional Check: If an explicit ID exists, handle ownership and update
    if (id) {
      const existingDiagram = await prisma.diagram.findUnique({
        where: { id }
      });

      if (!existingDiagram) {
        return res.status(404).json({ error: "Not Found", message: "Target diagram record does not exist." });
      }

      // 🛡️ Security Check: Prevent Cross-Tenant Object Tampering
      if (existingDiagram.userId !== userId) {
        return res.status(403).json({ 
          error: "Forbidden Resource", 
          message: "Malicious action blocked: You do not possess structural ownership permissions over this asset." 
        });
      }

      // Safe Update Transaction Execution
      const updatedDiagram = await prisma.diagram.update({
        where: { id },
        data: {
          title,
          payload // Automatically mapped as native JSON binary fields inside PostgreSQL
        }
      });

      return res.status(200).json({
        message: "Diagram updated successfully",
        diagram: updatedDiagram
      });
    }

    // 🆕 Fresh Creation: If no ID exists, create a brand-new canvas record
    const newDiagram = await prisma.diagram.create({
      data: {
        title,
        payload,
        userId
      }
    });

    return res.status(201).json({
      message: "Diagram created successfully",
      diagram: newDiagram
    });

  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

/**
 * @route   GET /api/diagrams
 * @desc    Fetch light structural metadata listings for active user
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;

    // Minimize network payload delivery size by explicitly omitting heavy raw canvas elements arrays
    const userDiagrams = await prisma.diagram.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true
        // payload is excluded here to optimize board view performance
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return res.status(200).json(userDiagrams);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

/**
 * @route   GET /api/diagrams/:id
 * @desc    Retrieve full canvas configuration snapshot for loading actions
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const diagram = await prisma.diagram.findUnique({
      where: { id }
    });

    if (!diagram) {
      return res.status(404).json({ error: "Not Found", message: "Target diagram snapshot could not be located." });
    }

    // 🛡️ Security Check: Block unauthorized users from reading private canvas payloads
    if (diagram.userId !== userId) {
      return res.status(403).json({ 
        error: "Forbidden Access", 
        message: "You lack authorized credentials to view this canvas composition data." 
      });
    }

    return res.status(200).json(diagram);
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

/**
 * @route   DELETE /api/diagrams/:id
 * @desc    Permanently wipe a matching diagram file asset
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const diagram = await prisma.diagram.findUnique({
      where: { id }
    });

    if (!diagram) {
      return res.status(404).json({ error: "Not Found", message: "Target diagram file already cleared or missing." });
    }

    // 🛡️ Security Check: Ensure destructive mutations are completely locked down by owner identity
    if (diagram.userId !== userId) {
      return res.status(403).json({ 
        error: "Forbidden Action", 
        message: "Wipe command rejected: You cannot remove assets belonging to separate tenant domains." 
      });
    }

    await prisma.diagram.delete({
      where: { id }
    });

    return res.status(200).json({
      message: "Diagram deleted successfully from canvas persistence storage cluster."
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
});

module.exports = router;