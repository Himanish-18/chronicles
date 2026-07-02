import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PenSquare, Edit, Trash2, Eye, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { SearchBar } from '@/components/SearchBar';
import { EmptyState } from '@/components/EmptyState';
import { formatDate, formatNumber } from '@/utils/formatDate';

interface MyBlog {
  id: string; title: string; slug: string; status: 'draft' | 'published';
  views: number; comments: number; publishedAt: string; coverImage: string;
  category: string;
}

const mockMyBlogs: MyBlog[] = [
  { id: '1', title: 'Building Scalable Microservices with Docker', slug: 'microservices-docker', status: 'published', views: 12400, comments: 28, publishedAt: '2026-06-15T10:00:00Z', coverImage: 'https://picsum.photos/seed/docker/200/120', category: 'DevOps' },
  { id: '2', title: 'The Complete Guide to React Server Components', slug: 'react-rsc', status: 'published', views: 8900, comments: 42, publishedAt: '2026-06-18T14:00:00Z', coverImage: 'https://picsum.photos/seed/react/200/120', category: 'Web Dev' },
  { id: '3', title: 'Understanding WebAssembly Beyond the Hype', slug: 'wasm-deep-dive', status: 'draft', views: 0, comments: 0, publishedAt: '', coverImage: 'https://picsum.photos/seed/wasm/200/120', category: 'Technology' },
  { id: '4', title: 'Advanced CSS Grid Techniques for Layouts', slug: 'css-grid', status: 'draft', views: 0, comments: 0, publishedAt: '', coverImage: 'https://picsum.photos/seed/cssgrid/200/120', category: 'Design' },
];

export function MyBlogs() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  const filtered = mockMyBlogs.filter((b) => {
    if (filter !== 'all' && b.status !== filter) return false;
    if (search && !b.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

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
                      <span>{blog.category}</span>
                      {blog.publishedAt && <span>{formatDate(blog.publishedAt)}</span>}
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-6 text-xs text-surface-500 flex-shrink-0">
                    <span className="flex items-center gap-1"><Eye size={14} /> {formatNumber(blog.views)}</span>
                    <span>{blog.comments} comments</span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link to={`/blog/${blog.slug}`} className="p-2 rounded-lg text-surface-500 hover:text-surface-200 hover:bg-white/5 transition-colors" aria-label="View">
                      <ExternalLink size={16} />
                    </Link>
                    <Link to={`/dashboard/edit/${blog.id}`} className="p-2 rounded-lg text-surface-500 hover:text-surface-200 hover:bg-white/5 transition-colors" aria-label="Edit">
                      <Edit size={16} />
                    </Link>
                    <button className="p-2 rounded-lg text-surface-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer" aria-label="Delete">
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
