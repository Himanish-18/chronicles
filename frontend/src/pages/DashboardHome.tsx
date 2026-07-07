import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Eye, MessageCircle, Users, ArrowUpRight, Clock, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { formatNumber, formatDate } from '@/utils/formatDate';
import { cn } from '@/utils/cn';
import { blogService } from '@/services/blogService';
import type { Blog } from '@/types';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function DashboardHome() {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const data = await blogService.getMyBlogs();
        setBlogs(data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const totalViews = blogs.reduce((acc, blog) => acc + (blog.views || 0), 0);
  const totalComments = blogs.reduce((acc, blog) => acc + (blog.commentsCount || 0), 0);

  const stats = [
    { label: 'Total Posts', value: blogs.length, icon: FileText, color: 'text-primary-400 bg-primary-500/10' },
    { label: 'Total Views', value: totalViews, icon: Eye, color: 'text-secondary-400 bg-secondary-500/10' },
    { label: 'Comments', value: totalComments, icon: MessageCircle, color: 'text-accent-400 bg-accent-500/10' },
    { label: 'Followers', value: 0, icon: Users, color: 'text-green-400 bg-green-500/10' },
  ];

  const recentActivity = blogs.slice(0, 4);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (isLoading) {
    return <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;
  }

  return (
    <div>
      {/* Welcome */}
      <motion.div {...fadeUp} transition={{ duration: 0.5 }}>
        <h1 className="font-heading text-3xl font-bold text-surface-100">
          {greeting()}, {user?.name?.split(' ')[0] || 'Writer'} 👋
        </h1>
        <p className="mt-1 text-surface-400">Here's what's happening with your blog today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} {...fadeUp} transition={{ delay: i * 0.1 }}>
            <Card hover className="p-5">
              <div className="flex items-start justify-between">
                <div className={cn('p-2.5 rounded-xl', stat.color)}>
                  <stat.icon size={20} />
                </div>
              </div>
              <p className="mt-4 text-2xl font-heading font-bold text-surface-100">{formatNumber(stat.value)}</p>
              <p className="text-sm text-surface-500">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Drafts */}
      <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="mt-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-heading text-xl font-bold text-surface-100">Recent Activity</h2>
          <Link to="/dashboard/blogs" className="text-sm text-primary-400 hover:text-primary-300 flex items-center gap-1 transition-colors">
            View all <ArrowUpRight size={14} />
          </Link>
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-surface-800">
              {recentActivity.map((draft) => (
                <div key={draft.id} className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText size={18} className="text-surface-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-surface-200 truncate">{draft.title}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge variant={draft.status === 'published' ? 'primary' : 'outline'} className="text-xs">
                      {draft.status}
                    </Badge>
                    <span className="text-xs text-surface-500 flex items-center gap-1">
                      <Clock size={12} /> {formatDate(draft.updatedAt || draft.createdAt)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
