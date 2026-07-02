import type { Request, Response, NextFunction } from 'express';
import { blogService } from '../services/blog.service.js';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/apiResponse.js';
import type { AuthenticatedRequest } from '../types/index.js';
import type { BlogQueryInput } from '../schemas/blog.schema.js';

export const blogController = {
  /**
   * GET /api/blogs
   */
  async getBlogs(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await blogService.getBlogs(req.query as unknown as BlogQueryInput);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/blogs/featured
   */
  async getFeatured(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await blogService.getFeaturedBlogs();
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/blogs/trending
   */
  async getTrending(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await blogService.getTrendingBlogs();
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/blogs/me
   */
  async getMyBlogs(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await blogService.getMyBlogs(req.user!.id);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * GET /api/blogs/:slug
   */
  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await blogService.getBlogBySlug(req.params.slug as string);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * POST /api/blogs
   */
  async createBlog(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await blogService.createBlog(req.body, req.user!.id);
      sendCreated(res, result, 'Blog created successfully');
    } catch (error) {
      next(error);
    }
  },

  /**
   * PUT /api/blogs/:id
   */
  async updateBlog(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const result = await blogService.updateBlog(
        req.params.id as string,
        req.body,
        req.user!.id,
        req.user!.role,
      );
      sendSuccess(res, result, 'Blog updated successfully');
    } catch (error) {
      next(error);
    }
  },

  /**
   * DELETE /api/blogs/:id
   */
  async deleteBlog(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      await blogService.deleteBlog(req.params.id as string, req.user!.id, req.user!.role);
      sendSuccess(res, null, 'Blog deleted successfully');
    } catch (error) {
      next(error);
    }
  },
};
