import { prisma } from '../config/database.js';
import type { Prisma } from '@prisma/client';

/**
 * Common include clause for blog queries — joins author and categories.
 */
const blogInclude = {
  author: {
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      bio: true,
      role: true,
      socialLinks: true,
      createdAt: true,
    },
  },
  categories: {
    include: {
      category: true,
    },
  },
  _count: {
    select: { comments: true },
  },
} as const;

export const blogRepository = {
  /**
   * Find a blog by slug (published, non-deleted).
   */
  async findBySlug(slug: string) {
    return prisma.blog.findFirst({
      where: { slug, deletedAt: null },
      include: blogInclude,
    });
  },

  /**
   * Find a blog by ID.
   */
  async findById(id: string) {
    return prisma.blog.findFirst({
      where: { id, deletedAt: null },
      include: blogInclude,
    });
  },

  /**
   * List published blogs with pagination, filtering, sorting, and search.
   */
  async findMany(options: {
    where?: Prisma.BlogWhereInput;
    orderBy?: Prisma.BlogOrderByWithRelationInput;
    skip: number;
    take: number;
  }) {
    const baseWhere: Prisma.BlogWhereInput = {
      deletedAt: null,
      status: 'PUBLISHED',
      ...options.where,
    };

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where: baseWhere,
        include: blogInclude,
        orderBy: options.orderBy || { publishedAt: 'desc' },
        skip: options.skip,
        take: options.take,
      }),
      prisma.blog.count({ where: baseWhere }),
    ]);

    return { blogs, total };
  },

  async findFeatured(limit = 5) {
    const featured = await prisma.blog.findMany({
      where: { isFeatured: true, status: 'PUBLISHED', deletedAt: null },
      include: blogInclude,
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });

    if (featured.length === 0) {
      // Fallback to latest blogs if none are explicitly featured
      return prisma.blog.findMany({
        where: { status: 'PUBLISHED', deletedAt: null },
        include: blogInclude,
        orderBy: { publishedAt: 'desc' },
        take: limit,
      });
    }

    return featured;
  },

  /**
   * Find trending blogs (most views in last 7 days).
   */
  async findTrending(limit = 5) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return prisma.blog.findMany({
      where: {
        status: 'PUBLISHED',
        deletedAt: null,
        publishedAt: { gte: sevenDaysAgo },
      },
      include: blogInclude,
      orderBy: { views: 'desc' },
      take: limit,
    });
  },

  /**
   * Find all blogs by a specific author (including drafts for the owner).
   */
  async findByAuthor(authorId: string) {
    return prisma.blog.findMany({
      where: { authorId, deletedAt: null },
      include: blogInclude,
      orderBy: { updatedAt: 'desc' },
    });
  },

  /**
   * Create a new blog with category associations.
   */
  async create(data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    status: 'DRAFT' | 'PUBLISHED';
    readTime: number;
    tags?: string[];
    authorId: string;
    categoryId: string;
    publishedAt?: Date;
  }) {
    const { categoryId, tags, ...blogData } = data;
    return prisma.blog.create({
      data: {
        ...blogData,
        tags: tags || [],
        categories: {
          create: { categoryId },
        },
      },
      include: blogInclude,
    });
  },

  /**
   * Update a blog.
   */
  async update(id: string, data: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    coverImage?: string | null;
    status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
    readTime?: number;
    tags?: string[];
    isFeatured?: boolean;
    categoryId?: string;
    publishedAt?: Date | null;
  }) {
    const { categoryId, tags, ...blogData } = data;

    // If category changed, update the junction table
    if (categoryId) {
      await prisma.blogCategory.deleteMany({ where: { blogId: id } });
      await prisma.blogCategory.create({ data: { blogId: id, categoryId } });
    }

    return prisma.blog.update({
      where: { id },
      data: {
        ...blogData,
        ...(tags !== undefined && { tags }),
      },
      include: blogInclude,
    });
  },

  /**
   * Soft-delete a blog.
   */
  async softDelete(id: string) {
    return prisma.blog.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  /**
   * Increment view count.
   */
  async incrementViews(id: string) {
    return prisma.blog.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
  },

  /**
   * Get bookmarked blogs for a user
   */
  async findBookmarkedByUser(userId: string) {
    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        blog: {
          include: blogInclude
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return bookmarks.map(b => b.blog).filter(b => b.deletedAt === null);
  },

  /**
   * Toggle a bookmark
   */
  async toggleBookmark(userId: string, blogId: string) {
    const existing = await prisma.bookmark.findUnique({
      where: { userId_blogId: { userId, blogId } }
    });

    if (existing) {
      await prisma.bookmark.delete({
        where: { userId_blogId: { userId, blogId } }
      });
      return false; // bookmarked = false
    } else {
      await prisma.bookmark.create({
        data: { userId, blogId }
      });
      return true; // bookmarked = true
    }
  },
};
