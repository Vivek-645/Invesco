const { createClerkClient } = require('@clerk/clerk-sdk-node');

// Initialize Clerk client with secret key
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_API_KEY,
});

/**
 * Verify Clerk token using Clerk SDK
 */
async function verifyWithSDK(token) {
  try {
    if (!process.env.CLERK_API_KEY) {
      throw new Error('CLERK_API_KEY environment variable is required');
    }

    // Verify the session token
    const verified = await clerkClient.verifyToken(token);

    return {
      clerkId: verified.sub,
      sessionId: verified.sid,
      email: verified.email || null,
    };
  } catch (error) {
    throw new Error(`Token verification failed: ${error.message}`);
  }
}

/**
 * Clerk authentication middleware
 * Extracts and verifies the Clerk token from Authorization header
 */
async function verifyClerk(req, res, next) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Authorization header missing or invalid. Expected format: Bearer <token>',
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Token not provided',
      });
    }

    // Verify token with Clerk SDK
    const clerkData = await verifyWithSDK(token);

    // Attach Clerk data to request object for use in route handlers
    req.clerk = {
      clerkId: clerkData.clerkId,
      sessionId: clerkData.sessionId,
      email: clerkData.email,
    };

    next();
    
  } catch (error) {
    console.error('Token verification error:', error.message);
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

module.exports = verifyClerk;
