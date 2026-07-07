import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PenSquare, Edit, Trash2, Eye, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { SearchBar } from '@/components/SearchBar';
import { EmptyState } from '@/components/EmptyState';
import { formatDate, formatNumber } from '@/utils/formatDate';
import { blogService } from '@/services/blogService';
import type { Blog } from '@/types';

export function MyBlogs() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const data = await blogService.getMyBlogs();
      setBlogs(data);
    } catch (error) {
      console.error('Failed to fetch my blogs', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this blog?')) {
      try {
        await blogService.delete(id);
        setBlogs(blogs.filter((b) => b.id !== id));
      } catch (error) {
        console.error('Failed to delete blog', error);
        alert('Failed to delete blog');
      }
    }
  };

  const filtered = blogs.filter((b) => {
    if (filter !== 'all' && b.status !== filter) return false;
    if (search && !b.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (isLoading) {
    return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-surface-100">My Blogs</h1>
          <p className="mt-1 text-surface-400">Manage and track your published and draft articles</p>
        </div>
        <Link to="/dashboard/create">
          <Button><PenSquare size={16} /> New Post</Button>
        </Link>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <SearchBar value={search} onChange={setSearch} placeholder="Search your blogs..." className="sm:max-w-xs" />
        <div className="flex gap-1">
          {(['all', 'published', 'draft'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors cursor-pointer ${filter === f ? 'text-primary-400 bg-primary-500/10' : 'text-surface-400 hover:text-surface-200 hover:bg-white/5'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No blogs found" description="Start writing your first blog post" actionLabel="Create Post" onAction={() => {}} />
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-surface-800">
              {filtered.map((blog, i) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.02] transition-colors group"
                >
                  <img src={blog.coverImage} alt="" className="h-14 w-20 rounded-lg object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-surface-200 truncate group-hover:text-primary-400 transition-colors">{blog.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-surface-500">
                      <Badge variant={blog.status === 'published' ? 'primary' : 'outline'} className="text-xs">{blog.status}</Badge>
                      <span>{blog.category?.name || 'Uncategorized'}</span>
                      {blog.publishedAt && <span>{formatDate(blog.publishedAt)}</span>}
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-6 text-xs text-surface-500 flex-shrink-0">
                    <span className="flex items-center gap-1"><Eye size={14} /> {formatNumber(blog.views)}</span>
                    <span>{blog.commentsCount} comments</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link to={`/blog/${blog.slug}`} className="p-2 rounded-lg text-surface-500 hover:text-surface-200 hover:bg-white/5 transition-colors" aria-label="View">
                      <ExternalLink size={16} />
                    </Link>
                    <Link to={`/dashboard/edit/${blog.id}`} className="p-2 rounded-lg text-surface-500 hover:text-surface-200 hover:bg-white/5 transition-colors" aria-label="Edit">
                      <Edit size={16} />
                    </Link>
                    <button onClick={() => handleDelete(blog.id)} className="p-2 rounded-lg text-surface-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer" aria-label="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
