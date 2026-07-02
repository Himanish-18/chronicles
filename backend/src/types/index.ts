import type { Request } from 'express';

// ─────────────────────────────────────────────
// JWT
// ─────────────────────────────────────────────

export interface JwtPayload {
  userId: string;
  role: string;
}

// ─────────────────────────────────────────────
// REQUEST
// ─────────────────────────────────────────────

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// ─────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

// ─────────────────────────────────────────────
// API RESPONSE
// ─────────────────────────────────────────────

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ field?: string; message: string }>;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// ─────────────────────────────────────────────
// USER (matches frontend User type)
// ─────────────────────────────────────────────

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  bio?: string | null;
  role: 'user' | 'admin';
  createdAt: string;
  socialLinks?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
  } | null;
}

// ─────────────────────────────────────────────
// BLOG (matches frontend Blog type)
// ─────────────────────────────────────────────

export interface CategoryResponse {
  id: string;
  name: string;
  slug: string;
  color?: string | null;
}

export interface BlogResponse {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  category: CategoryResponse;
  tags: string[];
  author: UserResponse;
  status: 'draft' | 'published' | 'archived';
  readTime: number;
  views: number;
  likes: number;
  commentsCount: number;
  isFeatured: boolean;
  publishedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BlogListResponse {
  blogs: BlogResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
