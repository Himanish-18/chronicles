import type { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/apiResponse.js';
import type { AuthenticatedRequest } from '../types/index.js';

export const authController = {
  /**
   * POST /api/auth/register
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      sendCreated(res, result, 'Registration successful');
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/auth/login
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      
      // Set refresh token in HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      sendSuccess(res, { user: result.user, token: result.token }, 'Login successful');
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/auth/logout
   */
  async logout(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await authService.logout(req.user!.id);
      res.clearCookie('refreshToken');
      sendSuccess(res, null, 'Logout successful');
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/auth/refresh
   */
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        throw new Error('No refresh token provided'); // Handled by global error handler
      }

      const result = await authService.refreshToken(refreshToken);

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      sendSuccess(res, { token: result.token }, 'Token refreshed');
    } catch (error) {
      res.clearCookie('refreshToken');
      next(error);
    }
  },

  /**
   * GET /api/auth/me
   */
  async getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.getProfile(req.user!.id);
      sendSuccess(res, user);
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/auth/profile
   */
  async updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const user = await authService.updateProfile(req.user!.id, req.body);
      sendSuccess(res, user, 'Profile updated successfully');
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/auth/password
   */
  async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await authService.changePassword(req.user!.id, req.body);
      res.clearCookie('refreshToken'); // Force re-login
      sendSuccess(res, null, 'Password changed successfully. Please log in again.');
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.forgotPassword(req.body.email);
      sendSuccess(res, null, 'If an account exists with this email, a reset link has been sent');
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/auth/verify-reset-token/:token
   */
  async verifyResetToken(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.verifyResetToken(req.params.token as string);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/auth/reset-password
   */
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      await authService.resetPassword(req.body.token, req.body.password);
      sendSuccess(res, null, 'Password reset successful');
    } catch (error) {
      next(error);
    }
  },
};
