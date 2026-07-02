import { motion } from 'framer-motion';
import { User, Bell, Shield, Palette, Globe, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';

const sections = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'danger', label: 'Danger Zone', icon: Trash2 },
];

export function Settings() {
  const { user } = useAuth();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <h1 className="font-heading text-3xl font-bold text-surface-100 mb-1">Settings</h1>
      <p className="text-surface-400 mb-8">Manage your account preferences</p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <nav className="lg:col-span-1 space-y-1">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                s.id === 'danger'
                  ? 'text-red-400/70 hover:text-red-400 hover:bg-red-500/10'
                  : 'text-surface-400 hover:text-surface-100 hover:bg-white/5',
              )}
            >
              <s.icon size={18} />
              {s.label}
            </a>
          ))}
        </nav>

        {/* Content */}
        <div className="lg:col-span-3 space-y-8">
          {/* Account */}
          <Card id="account">
            <CardContent className="space-y-4">
              <h3 className="font-heading text-lg font-semibold text-surface-100">Account Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Full Name" defaultValue={user?.name} placeholder="Your name" />
                <Input label="Email" defaultValue={user?.email} placeholder="you@example.com" type="email" />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1.5">Bio</label>
                <textarea
                  defaultValue={user?.bio}
                  placeholder="Tell us about yourself..."
                  className="w-full rounded-xl border border-surface-700 bg-surface-900/50 px-4 py-2.5 text-sm text-surface-100 placeholder:text-surface-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none min-h-[100px]"
                />
              </div>
              <Input label="Website" placeholder="https://yoursite.com" icon={<Globe size={18} />} />
              <div className="flex justify-end">
                <Button size="sm">Save Changes</Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card id="notifications">
            <CardContent className="space-y-4">
              <h3 className="font-heading text-lg font-semibold text-surface-100">Notifications</h3>
              {[
                { label: 'Email notifications for new comments', defaultChecked: true },
                { label: 'Email notifications for new followers', defaultChecked: true },
                { label: 'Weekly digest of trending posts', defaultChecked: false },
                { label: 'Marketing and promotional emails', defaultChecked: false },
              ].map((n) => (
                <label key={n.label} className="flex items-center justify-between cursor-pointer group">
                  <span className="text-sm text-surface-300 group-hover:text-surface-200 transition-colors">{n.label}</span>
                  <input type="checkbox" defaultChecked={n.defaultChecked} className="rounded border-surface-600 bg-surface-800 text-primary-600 focus:ring-primary-500 h-4 w-4" />
                </label>
              ))}
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card id="appearance">
            <CardContent>
              <h3 className="font-heading text-lg font-semibold text-surface-100 mb-4">Appearance</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-surface-200">Dark Mode</p>
                  <p className="text-xs text-surface-500">Toggle between dark and light themes</p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>

          {/* Security */}
          <Card id="security">
            <CardContent className="space-y-4">
              <h3 className="font-heading text-lg font-semibold text-surface-100">Security</h3>
              <Input label="Current Password" type="password" placeholder="••••••••" />
              <Input label="New Password" type="password" placeholder="••••••••" />
              <Input label="Confirm New Password" type="password" placeholder="••••••••" />
              <div className="flex justify-end">
                <Button size="sm">Update Password</Button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card id="danger" className="border-red-500/20">
            <CardContent>
              <h3 className="font-heading text-lg font-semibold text-red-400">Danger Zone</h3>
              <p className="text-sm text-surface-400 mt-1 mb-4">Once you delete your account, there is no going back.</p>
              <Button variant="danger" size="sm"><Trash2 size={16} /> Delete Account</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
}
