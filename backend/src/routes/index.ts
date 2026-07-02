import { Router } from 'express';
import authRoutes from './auth.routes.js';
import blogRoutes from './blog.routes.js';
import categoryRoutes from './category.routes.js';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Mount modules
router.use('/auth', authRoutes);
router.use('/blogs', blogRoutes);
router.use('/categories', categoryRoutes);

export default router;
