import type { Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import type { AuthenticatedRequest } from '../types/index.js';

/**
 * Authentication middleware — verifies JWT access token and attaches user to request.
 */
export function authenticate(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Access token is required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedError('Access token is required');
    }

    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.userId,
      role: payload.role,
    };

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else {
      next(new UnauthorizedError('Invalid or expired access token'));
    }
  }
}

/**
 * Optional authentication — same as authenticate but doesn't throw on missing token.
 * Useful for public routes that optionally personalize content for logged-in users.
 */
export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next();
    }

    const payload = verifyAccessToken(token);
    req.user = {
      id: payload.userId,
      role: payload.role,
    };

    next();
  } catch {
    // Token is invalid but route is public — proceed without user context
    next();
  }
}

/**
 * Authorization middleware — checks if user has one of the required roles.
 */
export function authorize(...allowedRoles: string[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
}
