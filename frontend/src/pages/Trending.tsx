import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { BlogCard } from '@/components/BlogCard';
import { blogService } from '@/services/blogService';
import type { Blog } from '@/types';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export function Trending() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const data = await blogService.getTrending();
        setBlogs(data);
      } catch (error) {
        console.error('Failed to load trending blogs', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTrending();
  }, []);

  if (isLoading) {
    return (
      <div className="py-32 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-[80vh]">
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden gradient-hero pt-20 pb-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-primary-600/20 blur-[120px]" />
        
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <Badge variant="primary" className="mb-6 text-sm px-4 py-1 flex items-center gap-2 w-fit mx-auto">
              <TrendingUp size={16} /> Hot Right Now
            </Badge>
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance"
          >
            Trending <span className="gradient-text">Stories</span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto text-balance"
          >
            Discover the most popular and highly-read articles from our community.
          </motion.p>
        </div>
      </section>

      {/* ===== Trending Grid ===== */}
      <section className="py-12 pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {blogs.length === 0 ? (
            <div className="text-center py-20 glass rounded-3xl">
              <TrendingUp className="mx-auto h-12 w-12 text-surface-600 mb-4" />
              <h3 className="text-xl font-heading text-surface-200">No trending blogs yet</h3>
              <p className="text-surface-400 mt-2">Check back later when there is more activity.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, i) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <div className="relative h-full">
                    {/* Number Badge */}
                    <div className="absolute -top-4 -left-4 z-10 w-12 h-12 rounded-full gradient-primary flex items-center justify-center font-heading font-bold text-2xl shadow-lg border-4 border-surface-950 text-white">
                      {i + 1}
                    </div>
                    <BlogCard blog={blog} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
