import { useState } from 'react';
import { motion } from 'framer-motion';
import { BlogCard } from '@/components/BlogCard';
import { SearchBar } from '@/components/SearchBar';
import { CategoryChips } from '@/components/CategoryChips';
import { Pagination } from '@/components/Pagination';
import { BlogListSkeleton } from '@/components/SkeletonLoader';
import type { Blog } from '@/types';

// Mock data for demonstration
const mockBlogs: Blog[] = Array.from({ length: 9 }, (_, i) => ({
  id: String(i + 1),
  title: [
    'Building Production-Ready APIs with Express.js',
    'A Deep Dive into CSS Container Queries',
    'Terraform vs Pulumi: Infrastructure as Code Comparison',
    'Prompt Engineering for Software Developers',
    'Advanced TypeScript Patterns You Should Know',
    'Securing Your AWS Infrastructure: A Complete Guide',
    'The Rise of Edge Computing in Modern Web Apps',
    'React 19: What\'s New and Migration Guide',
    'Database Optimization Techniques for High-Traffic Apps',
  ][i],
  slug: `blog-post-${i + 1}`,
  excerpt: 'An in-depth exploration of modern development practices with practical examples and real-world use cases you can apply today.',
  content: '',
  coverImage: `https://picsum.photos/seed/blog${i + 1}/800/400`,
  category: [
    { id: '5', name: 'Web Dev', slug: 'web-dev', color: '#10b981' },
    { id: '2', name: 'Design', slug: 'design', color: '#ec4899' },
    { id: '3', name: 'DevOps', slug: 'devops', color: '#06b6d4' },
    { id: '4', name: 'AI & ML', slug: 'ai-ml', color: '#f59e0b' },
    { id: '1', name: 'Technology', slug: 'technology', color: '#7c3aed' },
    { id: '6', name: 'Cloud', slug: 'cloud', color: '#3b82f6' },
  ][i % 6],
  tags: [],
  author: {
    id: String(i + 1),
    name: ['Sarah Chen', 'Alex Rivera', 'Maya Patel', 'James Okafor', 'Emily Zhang', 'Raj Mehta'][i % 6],
    email: '',
    avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=Author${i}`,
    role: 'user',
    createdAt: '',
  },
  status: 'published',
  readTime: [8, 5, 12, 6, 10, 7, 9, 11, 15][i],
  views: [12400, 8900, 6200, 5100, 4800, 3200, 2900, 2400, 1800][i],
  likes: 100 + i * 30,
  commentsCount: 10 + i * 5,
  isFeatured: i === 0,
  publishedAt: new Date(2026, 5, 28 - i).toISOString(),
  createdAt: new Date(2026, 5, 28 - i).toISOString(),
  updatedAt: new Date(2026, 5, 28 - i).toISOString(),
}));

export function BlogListing() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading] = useState(false);

  const filtered = mockBlogs.filter((b) => {
    if (category && b.category.slug !== category) return false;
    if (search && !b.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const featuredBlog = filtered.find((b) => b.isFeatured) || filtered[0];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-heading text-4xl font-bold text-surface-100">Explore Stories</h1>
        <p className="mt-2 text-surface-400">Discover articles, tutorials, and insights from our community</p>
      </motion.div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        <SearchBar value={search} onChange={setSearch} className="w-full sm:max-w-sm" />
      </div>
      <CategoryChips selected={category} onSelect={setCategory} className="mb-10" />

      {isLoading ? (
        <BlogListSkeleton />
      ) : (
        <>
          {/* Featured Post */}
          {featuredBlog && !search && !category && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
              <BlogCard blog={featuredBlog} featured />
            </motion.div>
          )}

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered
              .filter((b) => b.id !== featuredBlog?.id || search || category)
              .map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
          </div>

          {/* Pagination */}
          <Pagination currentPage={page} totalPages={5} onPageChange={setPage} className="mt-12" />
        </>
      )}
    </div>
  );
}
