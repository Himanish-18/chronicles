import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { BlogCard } from '@/components/BlogCard';
import { CATEGORIES } from '@/utils/constants';
import type { Blog } from '@/types';

// Mock featured blogs for the landing page
const mockFeaturedBlogs: Blog[] = [
  {
    id: '1', title: 'Building Scalable Microservices with Docker and Kubernetes', slug: 'building-scalable-microservices',
    excerpt: 'Learn how to design, build, and deploy microservices at scale using container orchestration best practices.',
    content: '', coverImage: 'https://picsum.photos/seed/docker/800/400',
    category: { id: '3', name: 'DevOps', slug: 'devops', color: '#06b6d4' },
    tags: ['docker', 'kubernetes'], author: { id: '1', name: 'Sarah Chen', email: 's@c.com', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Sarah', role: 'user', createdAt: '' },
    status: 'published', readTime: 8, views: 12400, likes: 342, commentsCount: 28, isFeatured: true, publishedAt: '2026-06-15T10:00:00Z', createdAt: '2026-06-15T10:00:00Z', updatedAt: '2026-06-15T10:00:00Z',
  },
  {
    id: '2', title: 'The Complete Guide to React Server Components', slug: 'react-server-components-guide',
    excerpt: 'Everything you need to know about RSC, streaming, and the future of React rendering.',
    content: '', coverImage: 'https://picsum.photos/seed/react/800/400',
    category: { id: '5', name: 'Web Dev', slug: 'web-dev', color: '#10b981' },
    tags: ['react', 'rsc'], author: { id: '2', name: 'Alex Rivera', email: 'a@r.com', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alex', role: 'user', createdAt: '' },
    status: 'published', readTime: 12, views: 8900, likes: 256, commentsCount: 42, isFeatured: true, publishedAt: '2026-06-18T14:00:00Z', createdAt: '2026-06-18T14:00:00Z', updatedAt: '2026-06-18T14:00:00Z',
  },
  {
    id: '3', title: 'Designing for AI: UI Patterns for Intelligent Applications', slug: 'designing-for-ai',
    excerpt: 'Explore the emerging design patterns that make AI-powered applications intuitive and delightful.',
    content: '', coverImage: 'https://picsum.photos/seed/aidesign/800/400',
    category: { id: '4', name: 'AI & ML', slug: 'ai-ml', color: '#f59e0b' },
    tags: ['ai', 'design'], author: { id: '3', name: 'Maya Patel', email: 'm@p.com', avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Maya', role: 'user', createdAt: '' },
    status: 'published', readTime: 6, views: 6200, likes: 189, commentsCount: 15, isFeatured: true, publishedAt: '2026-06-22T09:00:00Z', createdAt: '2026-06-22T09:00:00Z', updatedAt: '2026-06-22T09:00:00Z',
  },
];

const trendingPosts = [
  { title: 'Why Rust is the Future of Systems Programming', views: '15.2K' },
  { title: 'Zero-Downtime Deployments with GitHub Actions', views: '12.1K' },
  { title: 'The Art of Writing Clean TypeScript', views: '9.8K' },
  { title: 'From Monolith to Microservices: A Migration Story', views: '8.4K' },
  { title: 'Understanding WebAssembly Beyond the Hype', views: '7.1K' },
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

export function Landing() {
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
            {mockFeaturedBlogs.map((blog) => (
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
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/blogs?category=${cat.slug}`}
                className="group"
              >
                <div
                  className="px-6 py-3 rounded-2xl glass text-surface-300 font-medium transition-all duration-300 hover:scale-105 hover:shadow-card"
                  style={{ borderColor: `${cat.color}30` }}
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
                {trendingPosts.map((post, i) => (
                  <Link
                    key={post.title}
                    to="/blogs"
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
