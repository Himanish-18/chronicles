import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Heart, MessageCircle, Share2, Bookmark, Loader2, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { AuthorCard } from '@/components/AuthorCard';
import { BlogCard } from '@/components/BlogCard';
import { formatDate, formatNumber } from '@/utils/formatDate';
import { blogService } from '@/services/blogService';
import type { Blog } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';

export function BlogDetail() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!slug) return;
      setIsLoading(true);
      try {
        const fetchedBlog = await blogService.getBySlug(slug);
        setBlog(fetchedBlog);

        // Fetch related blogs from the same category
        const relatedRes = await blogService.getAll({ category: fetchedBlog.category.slug, limit: 4 });
        setRelatedBlogs(relatedRes.blogs.filter((b) => b.id !== fetchedBlog.id).slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch blog', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  const handleBookmark = async () => {
    if (!isAuthenticated) {
      alert('Please login to bookmark articles');
      return;
    }
    if (!blog) return;
    try {
      const res = await blogService.toggleBookmark(blog.id);
      setIsBookmarked(res.bookmarked);
    } catch (error) {
      console.error('Failed to toggle bookmark', error);
    }
  };

  // Simple markdown-to-html rendering for code blocks, headings, lists, etc.
  const renderContent = (content: string) => {
    const lines = content.trim().split('\n');
    const elements: React.ReactNode[] = [];
    let i = 0;
    let key = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Code blocks
      if (line.startsWith('```')) {
        const lang = line.slice(3).trim();
        const codeLines: string[] = [];
        i++;
        while (i < lines.length && !lines[i].startsWith('```')) {
          codeLines.push(lines[i]);
          i++;
        }
        elements.push(
          <pre key={key++} className="my-6 rounded-xl bg-surface-900 border border-surface-800 p-4 overflow-x-auto">
            <code className="text-sm font-mono text-surface-200">{codeLines.join('\n')}</code>
            {lang && <span className="block mt-2 text-xs text-surface-600 uppercase">{lang}</span>}
          </pre>,
        );
        i++;
        continue;
      }

      // Headings
      if (line.startsWith('## ')) {
        elements.push(<h2 key={key++} className="text-2xl font-heading font-bold text-surface-100 mt-10 mb-4">{line.slice(3)}</h2>);
        i++; continue;
      }

      // List items
      if (line.startsWith('- **') || line.startsWith('1. **')) {
        elements.push(
          <li key={key++} className="ml-4 text-surface-300 leading-relaxed list-disc marker:text-primary-500" dangerouslySetInnerHTML={{ __html: line.replace(/^[-\d.]+\s*/, '').replace(/\*\*(.+?)\*\*/g, '<strong class="text-surface-100">$1</strong>').replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded bg-surface-800 text-primary-300 text-sm font-mono">$1</code>') }} />,
        );
        i++; continue;
      }

      // Paragraph
      if (line.trim()) {
        elements.push(
          <p key={key++} className="text-surface-300 leading-relaxed my-4" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-surface-100">$1</strong>').replace(/`(.+?)`/g, '<code class="px-1.5 py-0.5 rounded bg-surface-800 text-primary-300 text-sm font-mono">$1</code>') }} />,
        );
      }
      i++;
    }
    return elements;
  };

  if (isLoading) {
    return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;
  }

  if (!blog) {
    return (
      <div className="py-20 text-center">
        <h2 className="font-heading text-2xl font-bold text-surface-100">Blog not found</h2>
        <p className="mt-2 text-surface-400 mb-6">The article you're looking for doesn't exist or has been removed.</p>
        <Link to="/blogs">
          <Button variant="outline"><ArrowLeft size={16} className="mr-2" /> Back to Blogs</Button>
        </Link>
      </div>
    );
  }

  return (
    <article>
      {/* Hero Image */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img src={blog.coverImage} alt={blog.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950 via-surface-950/50 to-transparent" />
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 -mt-32 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Meta */}
          <Badge color={blog.category?.color || '#3b82f6'} className="mb-4">{blog.category?.name}</Badge>
          <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-surface-100 leading-tight">
            {blog.title}
          </h1>

          {/* Author bar */}
          <div className="flex items-center justify-between mt-6 pb-6 border-b border-surface-800">
            <div className="flex items-center gap-3">
              <Avatar src={blog.author.avatar} alt={blog.author.name} size="md" />
              <div>
                <p className="text-sm font-medium text-surface-200">{blog.author.name}</p>
                <p className="text-xs text-surface-500">
                  {formatDate(blog.publishedAt || blog.createdAt)} · {blog.readTime} min read
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ActionButton icon={<Heart size={18} />} label="Like" count={blog.likes} />
              <ActionButton icon={<MessageCircle size={18} />} label="Comment" count={blog.commentsCount} />
              <ActionButton 
                icon={<Bookmark size={18} className={isBookmarked ? "fill-current" : ""} />} 
                label="Bookmark" 
                onClick={handleBookmark}
                className={isBookmarked ? "text-primary-400" : ""}
              />
              <ActionButton icon={<Share2 size={18} />} label="Share" />
            </div>
          </div>

          {/* Content */}
          <div className="py-8">
            {renderContent(blog.content)}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 py-6 border-t border-surface-800">
            {blog.tags.map((tag) => (
              <Badge key={tag} variant="outline">#{tag}</Badge>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 py-4 text-sm text-surface-500">
            <span className="flex items-center gap-1"><Eye size={16} /> {formatNumber(blog.views)} views</span>
            <span className="flex items-center gap-1"><Heart size={16} /> {formatNumber(blog.likes)} likes</span>
            <span className="flex items-center gap-1"><MessageCircle size={16} /> {blog.commentsCount} comments</span>
          </div>

          {/* Author Card */}
          <AuthorCard author={blog.author} className="my-8" />

          {/* Comments placeholder */}
          <div className="mt-10">
            <h3 className="font-heading text-xl font-bold text-surface-100 mb-6">
              Comments ({blog.commentsCount})
            </h3>
            <div className="glass rounded-2xl p-4">
              <textarea
                placeholder="Share your thoughts..."
                className="w-full bg-transparent rounded-xl border border-surface-700 p-3 text-sm text-surface-200 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none min-h-[100px]"
                aria-label="Write a comment"
              />
              <div className="flex justify-end mt-3">
                <Button size="sm">Post Comment</Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Posts */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 mt-10 border-t border-surface-800">
        <h3 className="font-heading text-2xl font-bold text-surface-100 mb-8">Related Posts</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedBlogs.map((b) => <BlogCard key={b.id} blog={b} />)}
        </div>
      </div>
    </article>
  );
}

function ActionButton({ icon, label, count, onClick, className }: { icon: React.ReactNode; label: string; count?: number, onClick?: () => void, className?: string }) {
  return (
    <button
      onClick={onClick}
      className={cn("flex items-center gap-1 px-2 py-1.5 rounded-lg text-surface-500 hover:text-primary-400 hover:bg-white/5 transition-colors text-sm cursor-pointer", className)}
      aria-label={label}
    >
      {icon}
      {count !== undefined && <span className="text-xs">{formatNumber(count)}</span>}
    </button>
  );
}
