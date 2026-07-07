import { Router } from 'express';
import { blogController } from '../controllers/blog.controller.js';
import { authenticate, optionalAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createBlogSchema,
  updateBlogSchema,
  blogQuerySchema,
  blogParamsSchema,
  blogIdParamsSchema,
} from '../schemas/blog.schema.js';

const router = Router();

// Public routes (with optional auth for personalization later)
router.get('/', optionalAuth, validate({ query: blogQuerySchema }), blogController.getBlogs);
router.get('/featured', optionalAuth, blogController.getFeatured);
router.get('/trending', optionalAuth, blogController.getTrending);
router.get('/me', authenticate, blogController.getMyBlogs);
router.get('/:slug', optionalAuth, validate({ params: blogParamsSchema }), blogController.getBySlug);

// Protected routes (require authentication)
router.use(authenticate);

router.post('/', validate({ body: createBlogSchema }), blogController.createBlog);
router.put(
  '/:id',
  validate({ params: blogIdParamsSchema, body: updateBlogSchema }),
  blogController.updateBlog,
);
router.delete('/:id', validate({ params: blogIdParamsSchema }), blogController.deleteBlog);

export default router;
