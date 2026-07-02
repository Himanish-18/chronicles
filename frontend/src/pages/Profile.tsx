import { motion } from 'framer-motion';
import { Camera, MapPin, Calendar, Link2 } from 'lucide-react';
import { TwitterIcon, GithubIcon } from '@/components/icons';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { useAuth } from '@/contexts/AuthContext';
import { formatNumber } from '@/utils/formatDate';

const profileStats = [
  { label: 'Posts', value: 24 },
  { label: 'Followers', value: 342 },
  { label: 'Following', value: 128 },
];

export function Profile() {
  const { user } = useAuth();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      {/* Profile Header */}
      <Card className="relative overflow-visible mb-8">
        {/* Banner */}
        <div className="h-40 rounded-t-2xl gradient-primary opacity-70" />

        <CardContent className="relative -mt-16 pb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="relative">
              <Avatar src={user?.avatar} alt={user?.name || 'User'} size="xl" className="ring-4 ring-surface-950" />
              <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors cursor-pointer" aria-label="Change avatar">
                <Camera size={14} />
              </button>
            </div>
            <div className="flex-1">
              <h1 className="font-heading text-2xl font-bold text-surface-100">{user?.name}</h1>
              <p className="text-surface-400 text-sm">{user?.email}</p>
            </div>
            <Button variant="outline" size="sm">Edit Profile</Button>
          </div>

          <p className="mt-4 text-surface-300 text-sm max-w-xl">
            {user?.bio || 'Full-stack developer & technical writer. Passionate about DevOps, cloud infrastructure, and building developer tools.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-surface-500">
            <span className="flex items-center gap-1"><MapPin size={14} /> San Francisco, CA</span>
            <span className="flex items-center gap-1"><Calendar size={14} /> Joined June 2025</span>
            <a href="#" className="flex items-center gap-1 hover:text-primary-400 transition-colors"><Link2 size={14} /> sarahchen.dev</a>
            <a href="#" className="flex items-center gap-1 hover:text-primary-400 transition-colors"><TwitterIcon size={14} /> @sarahchen</a>
            <a href="#" className="flex items-center gap-1 hover:text-primary-400 transition-colors"><GithubIcon size={14} /> sarahchen</a>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-6 pt-6 border-t border-surface-800">
            {profileStats.map((stat) => (
              <div key={stat.label}>
                <p className="font-heading text-xl font-bold text-surface-100">{formatNumber(stat.value)}</p>
                <p className="text-xs text-surface-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skills / Interests */}
      <Card className="mb-8">
        <CardContent>
          <h3 className="font-heading font-semibold text-surface-200 mb-3">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Docker', 'Kubernetes', 'AWS', 'Node.js', 'DevOps', 'System Design'].map((skill) => (
              <Badge key={skill} variant="outline">{skill}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
