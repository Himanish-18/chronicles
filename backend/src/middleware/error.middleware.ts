import type { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors.js';
import { sendError } from '../utils/apiResponse.js';
import { env } from '../config/env.js';

/**
 * Global error handler middleware.
 * Must be registered last in the middleware chain (4 arguments).
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // Log error in development
  if (env.NODE_ENV === 'development') {
    console.error('❌ Error:', err);
  }

  // Validation error — include field-level errors
  if (err instanceof ValidationError) {
    sendError(res, err.message, err.statusCode, err.errors);
    return;
  }

  // Known operational error
  if (err instanceof AppError) {
    sendError(res, err.message, err.statusCode);
    return;
  }

  // Prisma known errors
  if (err.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaError = (err as unknown) as { code: string; meta?: { target?: string[] } };
    if (prismaError.code === 'P2002') {
      const target = prismaError.meta?.target?.join(', ') || 'field';
      sendError(res, `A record with this ${target} already exists`, 409);
      return;
    }
    if (prismaError.code === 'P2025') {
      sendError(res, 'Record not found', 404);
      return;
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid token', 401);
    return;
  }
  if (err.name === 'TokenExpiredError') {
    sendError(res, 'Token has expired', 401);
    return;
  }

  // Unknown error — never expose details in production
  const message = env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message || 'Internal server error';

  sendError(res, message, 500);
}
