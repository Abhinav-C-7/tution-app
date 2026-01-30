const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');

// Middleware to strictly require authentication
const requireAuth = ClerkExpressRequireAuth();

module.exports = requireAuth;
