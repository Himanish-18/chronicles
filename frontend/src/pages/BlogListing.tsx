import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BlogCard } from '@/components/BlogCard';
import { SearchBar } from '@/components/SearchBar';
import { CategoryChips } from '@/components/CategoryChips';
import { Pagination } from '@/components/Pagination';
import { BlogListSkeleton } from '@/components/SkeletonLoader';
import { blogService } from '@/services/blogService';
import type { Blog } from '@/types';

export function BlogListing() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset to page 1 when filters change
    setPage(1);
  }, [search, category]);

  useEffect(() => {
    const fetchBlogs = async () => {
      setIsLoading(true);
      try {
        const res = await blogService.getAll({ search, category, page, limit: 9 });
        setBlogs(res.blogs);
        setTotalPages(res.totalPages || 1);
      } catch (error) {
        console.error('Failed to fetch blogs', error);
      } finally {
        setIsLoading(false);
      }
    };
    // small debounce for search could go here, but direct call is fine for now
    const timeout = setTimeout(fetchBlogs, 300);
    return () => clearTimeout(timeout);
  }, [search, category, page]);

  const featuredBlog = blogs.find((b) => b.isFeatured) || blogs[0];

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
            {blogs
              .filter((b) => b.id !== featuredBlog?.id || search || category)
              .map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} className="mt-12" />
          )}
        </>
      )}
    </div>
  );
}
