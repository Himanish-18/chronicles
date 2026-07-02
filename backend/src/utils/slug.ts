import slugify from 'slugify';
import { prisma } from '../config/database.js';

/**
 * Generate a URL-friendly slug from a title.
 * If the slug already exists in the database, appends a random suffix.
 */
export async function generateUniqueSlug(title: string): Promise<string> {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });

  // Check if slug already exists
  const existing = await prisma.blog.findUnique({
    where: { slug: baseSlug },
    select: { id: true },
  });

  if (!existing) {
    return baseSlug;
  }

  // Append random suffix for uniqueness
  const suffix = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${suffix}`;
}

/**
 * Calculate estimated read time in minutes based on word count.
 * Average reading speed: 200 words per minute.
 */
export function calculateReadTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);
  return Math.max(1, readTime); // Minimum 1 minute
}
