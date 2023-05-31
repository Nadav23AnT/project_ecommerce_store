import rateLimit from 'express-rate-limit';

// Limit requests from same API to Login
export const loginLimiter = rateLimit({
  max: 5,
  windowMs: 60 * 60 * 1000, // 1 hour
  message: 'יותר מידי נסיונות התחברות אנה נסה במועד מאוחר יותר!',
});
