import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Mail, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BlogCard } from '@/components/BlogCard';
import { blogService } from '@/services/blogService';
import { categoryService } from '@/services/categoryService';
import type { Blog, Category } from '@/types';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export function Landing() {
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [trendingBlogs, setTrendingBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [featured, trending, cats] = await Promise.all([
          blogService.getFeatured(),
          blogService.getTrending(),
          categoryService.getAll(),
        ]);
        setFeaturedBlogs(featured.slice(0, 3));
        setTrendingBlogs(trending.slice(0, 5));
        setCategories(cats);
      } catch (error) {
        console.error('Failed to load landing data', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;
  }

  return (
    <div>
      {/* ===== Hero ===== */}
      <section className="relative overflow-hidden gradient-hero pt-20 pb-28">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-primary-600/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-secondary-500/15 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <Badge variant="primary" className="mb-6 text-sm px-4 py-1">
              ✨ The modern publishing platform
            </Badge>
          </motion.div>

          <motion.h1
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-balance"
          >
            Where Ideas{' '}
            <span className="gradient-text">Come Alive</span>
          </motion.h1>

          <motion.p
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto text-balance"
          >
            A modern publishing platform for developers and creators. Write, share, and grow your audience with beautiful stories.
          </motion.p>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register">
              <Button size="lg">
                Start Writing <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/blogs">
              <Button variant="secondary" size="lg">
                Explore Blogs
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ===== Featured Blogs ===== */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="flex items-center justify-between mb-10">
            <div>
              <h2 className="font-heading text-3xl font-bold text-surface-100">Featured Stories</h2>
              <p className="mt-2 text-surface-400">Handpicked articles from our community</p>
            </div>
            <Link to="/blogs" className="text-sm text-primary-400 hover:text-primary-300 transition-colors flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredBlogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== Categories ===== */}
      <section className="py-16 border-t border-surface-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold text-surface-100">Explore Topics</h2>
            <p className="mt-2 text-surface-400">Find articles in your area of interest</p>
          </motion.div>

          <motion.div {...fadeUp} className="flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/blogs?category=${cat.slug}`}
                className="group"
              >
                <div
                  className="px-6 py-3 rounded-2xl glass text-surface-300 font-medium transition-all duration-300 hover:scale-105 hover:shadow-card"
                  style={{ borderColor: cat.color ? `${cat.color}30` : undefined }}
                >
                  <span className="group-hover:text-surface-100 transition-colors">{cat.name}</span>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ===== Trending ===== */}
      <section className="py-16 border-t border-surface-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div {...fadeUp}>
              <h2 className="font-heading text-3xl font-bold text-surface-100 flex items-center gap-2">
                <TrendingUp className="text-primary-500" size={28} />
                Trending Now
              </h2>
              <div className="mt-8 space-y-0">
                {trendingBlogs.map((post, i) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="flex items-start gap-4 py-4 border-b border-surface-800/50 hover:bg-white/[0.02] -mx-3 px-3 rounded-xl transition-colors group"
                  >
                    <span className="font-heading text-3xl font-bold text-surface-700 group-hover:text-primary-600 transition-colors min-w-[2.5rem]">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="font-medium text-surface-200 group-hover:text-primary-400 transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-xs text-surface-500 mt-1">{post.views} views</p>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Newsletter */}
            <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
              <div className="glass rounded-2xl p-8 lg:p-10 h-full flex flex-col justify-center">
                <div className="p-3 rounded-xl bg-primary-600/10 w-fit mb-6">
                  <Mail className="text-primary-400" size={24} />
                </div>
                <h2 className="font-heading text-2xl font-bold text-surface-100">Stay in the loop</h2>
                <p className="mt-2 text-surface-400">
                  Get the best articles delivered straight to your inbox. No spam, unsubscribe anytime.
                </p>
                <div className="mt-6 flex gap-3">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="flex-1 rounded-xl border border-surface-700 bg-surface-900/50 px-4 py-2.5 text-sm text-surface-100 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
                    aria-label="Email for newsletter"
                  />
                  <Button>Subscribe</Button>
                </div>
                <p className="mt-3 text-xs text-surface-600">Join 2,500+ subscribers</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
