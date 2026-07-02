import type { Response } from 'express';
import type { ApiSuccessResponse, ApiErrorResponse } from '../types/index.js';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
): void {
  const response: ApiSuccessResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  errors?: Array<{ field?: string; message: string }>,
): void {
  const response: ApiErrorResponse = {
    success: false,
    message,
    ...(errors && { errors }),
  };
  res.status(statusCode).json(response);
}

export function sendCreated<T>(res: Response, data: T, message = 'Created successfully'): void {
  sendSuccess(res, data, message, 201);
}

export function sendNoContent(res: Response): void {
  res.status(204).send();
}
