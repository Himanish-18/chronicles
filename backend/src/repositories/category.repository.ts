import { prisma } from '../config/database.js';

export const categoryRepository = {
  /**
   * Get all categories.
   */
  async findAll() {
    return prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  },

  /**
   * Find a category by slug.
   */
  async findBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
    });
  },

  /**
   * Find a category by ID.
   */
  async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
    });
  },
};
