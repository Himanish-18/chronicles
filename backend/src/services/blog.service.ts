import { blogRepository } from '../repositories/blog.repository.js';
import { categoryRepository } from '../repositories/category.repository.js';
import { generateUniqueSlug, calculateReadTime } from '../utils/slug.js';
import { NotFoundError, ForbiddenError } from '../utils/errors.js';
import type { BlogResponse, BlogListResponse, UserResponse, CategoryResponse } from '../types/index.js';
import type { CreateBlogInput, UpdateBlogInput, BlogQueryInput } from '../schemas/blog.schema.js';
import type { Prisma } from '@prisma/client';

/**
 * Transform a Prisma blog result into the frontend Blog response shape.
 */
function formatBlog(blog: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  status: string;
  readTime: number;
  views: number;
  likes: number;
  isFeatured: boolean;
  tags: unknown;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
    bio: string | null;
    role: string;
    socialLinks: unknown;
    createdAt: Date;
  };
  categories: Array<{ category: { id: string; name: string; slug: string; color: string | null } }>;
  _count: { comments: number };
}): BlogResponse {
  const category: CategoryResponse = blog.categories[0]
    ? {
        id: blog.categories[0].category.id,
        name: blog.categories[0].category.name,
        slug: blog.categories[0].category.slug,
        color: blog.categories[0].category.color,
      }
    : { id: '', name: 'Uncategorized', slug: 'uncategorized', color: null };

  const author: UserResponse = {
    id: blog.author.id,
    name: blog.author.name,
    email: blog.author.email,
    avatar: blog.author.avatar,
    bio: blog.author.bio,
    role: blog.author.role.toLowerCase() as 'user' | 'admin',
    createdAt: blog.author.createdAt.toISOString(),
    socialLinks: blog.author.socialLinks as UserResponse['socialLinks'],
  };

  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    excerpt: blog.excerpt,
    content: blog.content,
    coverImage: blog.coverImage,
    category,
    tags: (blog.tags as string[]) || [],
    author,
    status: blog.status.toLowerCase() as 'draft' | 'published' | 'archived',
    readTime: blog.readTime,
    views: blog.views,
    likes: blog.likes,
    commentsCount: blog._count.comments,
    isFeatured: blog.isFeatured,
    publishedAt: blog.publishedAt?.toISOString() ?? null,
    createdAt: blog.createdAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString(),
  };
}

export const blogService = {
  /**
   * Get paginated, filtered, sorted list of published blogs.
   */
  async getBlogs(query: BlogQueryInput): Promise<BlogListResponse> {
    const { search, category, sortBy, page, limit } = query;
    const skip = (page - 1) * limit;

    // Build where clause, enforce only published blogs
    const where: Prisma.BlogWhereInput = {
      status: 'PUBLISHED',
    };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } },
      ];
    }

    if (category) {
      where.categories = {
        some: {
          category: { slug: category },
        },
      };
    }

    // Build order clause
    let orderBy: Prisma.BlogOrderByWithRelationInput;
    switch (sortBy) {
      case 'popular':
        orderBy = { views: 'desc' };
        break;
      case 'trending':
        orderBy = { views: 'desc' };
        // For trending, also filter to recent posts
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        where.publishedAt = { gte: sevenDaysAgo };
        break;
      case 'latest':
      default:
        orderBy = { publishedAt: 'desc' };
    }

    const { blogs, total } = await blogRepository.findMany({
      where,
      orderBy,
      skip,
      take: limit,
    });

    return {
      blogs: blogs.map(formatBlog),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  /**
   * Get a single blog by slug. Increments view count.
   */
  async getBlogBySlug(slug: string): Promise<BlogResponse> {
    const blog = await blogRepository.findBySlug(slug);
    if (!blog) {
      throw new NotFoundError('Blog not found');
    }

    // Increment views (fire-and-forget)
    blogRepository.incrementViews(blog.id).catch(() => {});

    return formatBlog(blog);
  },

  /**
   * Get featured blogs.
   */
  async getFeaturedBlogs(): Promise<BlogResponse[]> {
    const blogs = await blogRepository.findFeatured();
    return blogs.map(formatBlog);
  },

  /**
   * Get trending blogs.
   */
  async getTrendingBlogs(): Promise<BlogResponse[]> {
    const blogs = await blogRepository.findTrending();
    return blogs.map(formatBlog);
  },

  /**
   * Get all blogs by the current user (including drafts).
   */
  async getMyBlogs(userId: string): Promise<BlogResponse[]> {
    const blogs = await blogRepository.findByAuthor(userId);
    return blogs.map(formatBlog);
  },

  /**
   * Create a new blog.
   */
  async createBlog(input: CreateBlogInput, authorId: string): Promise<BlogResponse> {
    // Verify category exists
    const category = await categoryRepository.findById(input.categoryId);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    // Generate slug
    const slug = await generateUniqueSlug(input.title);

    // Calculate read time
    const readTime = calculateReadTime(input.content);

    // Generate excerpt if not provided
    const excerpt = input.excerpt || input.content.substring(0, 200).replace(/\n/g, ' ').trim() + '...';

    // Determine publish date
    const status = input.status?.toUpperCase() as 'DRAFT' | 'PUBLISHED';
    const publishedAt = status === 'PUBLISHED' ? new Date() : undefined;

    const blog = await blogRepository.create({
      title: input.title,
      slug,
      excerpt,
      content: input.content,
      coverImage: input.coverImage,
      status,
      readTime,
      tags: input.tags,
      authorId,
      categoryId: input.categoryId,
      publishedAt,
    });

    return formatBlog(blog);
  },

  /**
   * Update an existing blog. Only the owner or an admin can update.
   */
  async updateBlog(
    blogId: string,
    input: UpdateBlogInput,
    userId: string,
    userRole: string,
  ): Promise<BlogResponse> {
    const existing = await blogRepository.findById(blogId);
    if (!existing) {
      throw new NotFoundError('Blog not found');
    }

    // Authorization check
    if (existing.authorId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenError('You can only edit your own blogs');
    }

    // Verify category if being changed
    if (input.categoryId) {
      const category = await categoryRepository.findById(input.categoryId);
      if (!category) {
        throw new NotFoundError('Category not found');
      }
    }

    // Recalculate derived fields
    const updateData: Parameters<typeof blogRepository.update>[1] = {};

    if (input.title) {
      updateData.title = input.title;
      updateData.slug = await generateUniqueSlug(input.title);
    }
    if (input.content) {
      updateData.content = input.content;
      updateData.readTime = calculateReadTime(input.content);
    }
    if (input.excerpt !== undefined) updateData.excerpt = input.excerpt;
    if (input.coverImage !== undefined) updateData.coverImage = input.coverImage;
    if (input.tags !== undefined) updateData.tags = input.tags;
    if (input.isFeatured !== undefined) updateData.isFeatured = input.isFeatured;
    if (input.categoryId) updateData.categoryId = input.categoryId;

    if (input.status) {
      updateData.status = input.status.toUpperCase() as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
      // Set publishedAt when first published
      if (input.status === 'published' && !existing.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    const blog = await blogRepository.update(blogId, updateData);
    return formatBlog(blog);
  },

  /**
   * Soft-delete a blog. Only the owner or an admin can delete.
   */
  async deleteBlog(blogId: string, userId: string, userRole: string): Promise<void> {
    const existing = await blogRepository.findById(blogId);
    if (!existing) {
      throw new NotFoundError('Blog not found');
    }

    if (existing.authorId !== userId && userRole !== 'ADMIN') {
      throw new ForbiddenError('You can only delete your own blogs');
    }

    await blogRepository.softDelete(blogId);
  },
};
