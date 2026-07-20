import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Bookmark as BookmarkIcon } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { BlogCard } from '@/components/BlogCard';
import { blogService } from '@/services/blogService';
import type { Blog } from '@/types';
import { useNavigate } from 'react-router-dom';

export function Bookmarks() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBookmarks = async () => {
    setIsLoading(true);
    try {
      const data = await blogService.getBookmarks();
      setBlogs(data);
    } catch (error) {
      console.error('Failed to fetch bookmarks', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  if (isLoading) {
    return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-surface-100 flex items-center gap-2">
            <BookmarkIcon className="text-primary-400" /> Bookmarks
          </h1>
          <p className="mt-1 text-surface-400">Your saved articles for later reading</p>
        </div>
      </div>

      {blogs.length === 0 ? (
        <EmptyState 
          title="No bookmarks yet" 
          description="Save interesting articles to read them later" 
          actionLabel="Browse Blogs" 
          onAction={() => navigate('/blogs')} 
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog, i) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <BlogCard blog={blog} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
