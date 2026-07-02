import { Link } from 'react-router-dom';
import { Clock, Bookmark } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Blog } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate } from '@/utils/formatDate';
import { cn } from '@/utils/cn';

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
  className?: string;
}

export function BlogCard({ blog, featured = false, className }: BlogCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn('group', className)}
    >
      <Link to={`/blog/${blog.slug}`} className="block">
        <div
          className={cn(
            'rounded-2xl glass overflow-hidden transition-all duration-300',
            'hover:shadow-card hover:-translate-y-1 hover:bg-glass-hover',
            featured && 'md:flex',
          )}
        >
          {/* Cover Image */}
          <div className={cn('relative overflow-hidden', featured ? 'md:w-1/2' : 'h-48')}>
            <img
              src={blog.coverImage || `https://picsum.photos/seed/${blog.slug}/800/400`}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <Badge color={blog.category.color} className="absolute top-3 left-3">
              {blog.category.name}
            </Badge>
          </div>

          {/* Content */}
          <div className={cn('p-5', featured && 'md:w-1/2 md:p-8 md:flex md:flex-col md:justify-center')}>
            <h3
              className={cn(
                'font-heading font-semibold text-surface-100 line-clamp-2 group-hover:text-primary-400 transition-colors',
                featured ? 'text-xl md:text-2xl' : 'text-base',
              )}
            >
              {blog.title}
            </h3>
            <p className="mt-2 text-sm text-surface-400 line-clamp-2">{blog.excerpt}</p>

            {/* Meta */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar src={blog.author.avatar} alt={blog.author.name} size="sm" />
                <div>
                  <p className="text-xs font-medium text-surface-200">{blog.author.name}</p>
                  <p className="text-xs text-surface-500">{formatDate(blog.publishedAt || blog.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-surface-500">
                <span className="flex items-center gap-1 text-xs">
                  <Clock size={14} />
                  {blog.readTime} min
                </span>
                <button
                  onClick={(e) => { e.preventDefault(); }}
                  className="hover:text-primary-400 transition-colors cursor-pointer"
                  aria-label="Bookmark"
                >
                  <Bookmark size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
