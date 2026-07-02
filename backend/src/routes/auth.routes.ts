import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimiter.middleware.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../schemas/auth.schema.js';

const router = Router();

// Public auth routes
router.post('/register', authLimiter, validate({ body: registerSchema }), authController.register);
router.post('/login', authLimiter, validate({ body: loginSchema }), authController.login);
router.post('/refresh', authController.refresh);

// Password reset routes
router.post(
  '/forgot-password',
  passwordResetLimiter,
  validate({ body: forgotPasswordSchema }),
  authController.forgotPassword,
);
router.get('/verify-reset-token/:token', authController.verifyResetToken);
router.post(
  '/reset-password',
  passwordResetLimiter,
  validate({ body: resetPasswordSchema }),
  authController.resetPassword,
);

// Protected routes (require authentication)
router.use(authenticate);

router.post('/logout', authController.logout);
router.get('/me', authController.getProfile);
router.put('/profile', validate({ body: updateProfileSchema }), authController.updateProfile);
router.put('/password', validate({ body: changePasswordSchema }), authController.changePassword);

export default router;
