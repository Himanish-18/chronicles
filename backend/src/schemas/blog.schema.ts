import { z } from 'zod';

// ─────────────────────────────────────────────
// BLOG SCHEMAS
// ─────────────────────────────────────────────

export const createBlogSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must be at most 200 characters')
    .trim(),
  content: z
    .string()
    .min(10, 'Content must be at least 10 characters'),
  excerpt: z
    .string()
    .max(500, 'Excerpt must be at most 500 characters')
    .optional(),
  categoryId: z.string().uuid('Invalid category ID'),
  tags: z.array(z.string().trim()).max(10, 'Maximum 10 tags allowed').optional(),
  status: z.enum(['draft', 'published']).optional().default('draft'),
  coverImage: z.string().url('Invalid cover image URL').optional(),
});

export const updateBlogSchema = z.object({
  title: z.string().min(3).max(200).trim().optional(),
  content: z.string().min(10).optional(),
  excerpt: z.string().max(500).optional(),
  categoryId: z.string().uuid().optional(),
  tags: z.array(z.string().trim()).max(10).optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  coverImage: z.string().url().optional().nullable(),
  isFeatured: z.boolean().optional(),
});

export const blogQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  sortBy: z.enum(['latest', 'popular', 'trending']).optional().default('latest'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(9),
});

export const blogParamsSchema = z.object({
  slug: z.string().min(1),
});

export const blogIdParamsSchema = z.object({
  id: z.string().uuid('Invalid blog ID'),
});

// ─────────────────────────────────────────────
// TYPE EXPORTS
// ─────────────────────────────────────────────

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type BlogQueryInput = z.infer<typeof blogQuerySchema>;
