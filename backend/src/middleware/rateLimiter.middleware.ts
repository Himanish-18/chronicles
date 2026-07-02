import rateLimit from 'express-rate-limit';

/**
 * Global rate limiter: 100 requests per 15 minutes per IP.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
});

/**
 * Auth rate limiter: 10 requests per 15 minutes per IP.
 * Prevents brute-force login/register attempts.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
  },
});

/**
 * Password reset rate limiter: 3 requests per 15 minutes per IP.
 * Prevents email spam via the forgot-password endpoint.
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many password reset requests, please try again later',
  },
});
