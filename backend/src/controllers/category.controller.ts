import type { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/category.service.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const categoryController = {
  /**
   * GET /api/categories
   */
  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await categoryService.getCategories();
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  },
};
