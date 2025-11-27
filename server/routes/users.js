const express = require('express');
const { body, validationResult } = require('express-validator');
const { getDB } = require('../db');
const verifyClerk = require('../middleware/verifyClerk');

const router = express.Router();

/**
 * Validation middleware for upsert endpoint
 */
const upsertValidation = [
  body('email').optional().isEmail().normalizeEmail(),
  body('firstName').optional().isString().trim().isLength({ max: 100 }),
  body('lastName').optional().isString().trim().isLength({ max: 100 }),
  body('imageUrl').optional().isURL(),
  body('phone').optional().isString().trim().isLength({ max: 20 }),
  body('metadata').optional().isObject(),
];

/**
 * POST /api/users/upsert
 * Upsert user data for authenticated Clerk user
 * 
 * Request body:
 * - email (string, optional)
 * - firstName (string, optional)
 * - lastName (string, optional)
 * - imageUrl (string, optional)
 * - phone (string, optional)
 * - metadata (object, optional)
 */
router.post('/upsert', verifyClerk, upsertValidation, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array(),
      });
    }

    const { clerkId, email: clerkEmail } = req.clerk;
    const { email, firstName, lastName, imageUrl, phone, metadata } = req.body;

    const db = getDB();
    const usersCollection = db.collection('users');

    const now = new Date();

    // Build update document
    const updateDoc = {
      $set: {
        email: email || clerkEmail || null,
        firstName: firstName || null,
        lastName: lastName || null,
        imageUrl: imageUrl || null,
        phone: phone || null,
        metadata: metadata || null,
        updatedAt: now,
        lastSeen: now,
      },
      $setOnInsert: {
        clerkId,
        createdAt: now,
      },
    };

    // Perform upsert operation
    const result = await usersCollection.updateOne(
      { clerkId },
      updateDoc,
      { upsert: true }
    );

    // Fetch the updated/inserted document
    const user = await usersCollection.findOne({ clerkId });

    res.status(200).json({
      success: true,
      data: {
        user,
        isNewUser: result.upsertedCount > 0,
      },
    });

  } catch (error) {
    console.error('Upsert error:', error);
    
    // Handle duplicate key error (shouldn't happen with proper unique index)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'User already exists',
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to upsert user',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * GET /api/users/me
 * Get current authenticated user's data
 */
router.get('/me', verifyClerk, async (req, res) => {
  try {
    const { clerkId } = req.clerk;

    const db = getDB();
    const usersCollection = db.collection('users');

    // Update lastSeen timestamp
    await usersCollection.updateOne(
      { clerkId },
      { 
        $set: { lastSeen: new Date() },
      }
    );

    // Fetch user data
    const user = await usersCollection.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found. Please call /api/users/upsert first.',
      });
    }

    res.status(200).json({
      success: true,
      data: { user },
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user data',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

module.exports = router;
