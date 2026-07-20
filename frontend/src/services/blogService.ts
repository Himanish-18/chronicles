import type { Blog, BlogListResponse, BlogFilters } from '@/types';
import { api } from './api';

export const blogService = {
  getAll: (filters?: BlogFilters) => {
    const params = new URLSearchParams();
    if (filters?.search) params.set('search', filters.search);
    if (filters?.category) params.set('category', filters.category);
    if (filters?.sortBy) params.set('sortBy', filters.sortBy);
    if (filters?.page) params.set('page', String(filters.page));
    if (filters?.limit) params.set('limit', String(filters.limit));
    return api.get<BlogListResponse>(`/blogs?${params.toString()}`);
  },

  getBySlug: (slug: string) => api.get<Blog>(`/blogs/${slug}`),

  getFeatured: () => api.get<Blog[]>('/blogs/featured'),

  getTrending: () => api.get<Blog[]>('/blogs/trending'),

  create: (data: Partial<Blog>) => api.post<Blog>('/blogs', data),

  update: (id: string, data: Partial<Blog>) => api.put<Blog>(`/blogs/${id}`, data),

  delete: (id: string) => api.delete<void>(`/blogs/${id}`),

  getMyBlogs: () => api.get<Blog[]>('/blogs/me'),

  getBookmarks: () => api.get<Blog[]>('/blogs/bookmarked'),

  toggleBookmark: (id: string) => api.post<{ bookmarked: boolean }>(`/blogs/${id}/bookmark`, {}),
};
