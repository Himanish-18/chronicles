import { categoryRepository } from '../repositories/category.repository.js';
import { NotFoundError } from '../utils/errors.js';
import type { CategoryResponse } from '../types/index.js';

/**
 * Format a Prisma category record into the frontend Category response shape.
 */
function formatCategory(category: {
  id: string;
  name: string;
  slug: string;
  color: string | null;
}): CategoryResponse {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    color: category.color,
  };
}

export const categoryService = {
  /**
   * Get all categories.
   */
  async getCategories(): Promise<CategoryResponse[]> {
    const categories = await categoryRepository.findAll();
    return categories.map(formatCategory);
  },

  /**
   * Get a single category by slug.
   */
  async getCategoryBySlug(slug: string): Promise<CategoryResponse> {
    const category = await categoryRepository.findBySlug(slug);
    if (!category) {
      throw new NotFoundError('Category not found');
    }
    return formatCategory(category);
  },
};
