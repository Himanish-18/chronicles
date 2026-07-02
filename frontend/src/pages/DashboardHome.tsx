import { motion } from 'framer-motion';
import { FileText, Eye, MessageCircle, Users, TrendingUp, ArrowUpRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { formatNumber } from '@/utils/formatDate';
import { cn } from '@/utils/cn';

const stats = [
  { label: 'Total Posts', value: 24, icon: FileText, trend: '+3', color: 'text-primary-400 bg-primary-500/10' },
  { label: 'Total Views', value: 12400, icon: Eye, trend: '+12%', color: 'text-secondary-400 bg-secondary-500/10' },
  { label: 'Comments', value: 89, icon: MessageCircle, trend: '+5', color: 'text-accent-400 bg-accent-500/10' },
  { label: 'Followers', value: 342, icon: Users, trend: '+18', color: 'text-green-400 bg-green-500/10' },
];

const recentDrafts = [
  { title: 'Understanding WebAssembly Beyond the Hype', status: 'draft', updatedAt: '2h ago' },
  { title: 'Advanced CSS Grid Techniques', status: 'draft', updatedAt: '1d ago' },
  { title: 'Building a CLI Tool with Rust', status: 'published', updatedAt: '3d ago' },
  { title: 'State Management in 2026', status: 'published', updatedAt: '5d ago' },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function DashboardHome() {
  const { user } = useAuth();

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

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
                <Badge variant="primary" className="text-xs">
                  <TrendingUp size={12} className="mr-0.5" />
                  {stat.trend}
                </Badge>
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
              {recentDrafts.map((draft) => (
                <div key={draft.title} className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText size={18} className="text-surface-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-surface-200 truncate">{draft.title}</span>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <Badge variant={draft.status === 'published' ? 'primary' : 'outline'} className="text-xs">
                      {draft.status}
                    </Badge>
                    <span className="text-xs text-surface-500 flex items-center gap-1">
                      <Clock size={12} /> {draft.updatedAt}
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
