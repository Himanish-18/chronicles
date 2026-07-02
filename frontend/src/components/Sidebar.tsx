import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, FileText, PenSquare, Bookmark, BarChart3,
  Settings, User, LogOut, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { APP_NAME, DASHBOARD_NAV, DASHBOARD_NAV_BOTTOM } from '@/utils/constants';
import { cn } from '@/utils/cn';

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard size={20} />,
  FileText: <FileText size={20} />,
  PenSquare: <PenSquare size={20} />,
  Bookmark: <Bookmark size={20} />,
  BarChart3: <BarChart3 size={20} />,
  Settings: <Settings size={20} />,
  User: <User size={20} />,
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <aside
      className={cn(
        'sticky top-0 h-screen flex flex-col border-r border-surface-800 bg-surface-950/80 backdrop-blur-xl transition-all duration-300',
        collapsed ? 'w-[var(--sidebar-collapsed-width)]' : 'w-[var(--sidebar-width)]',
      )}
    >
      {/* Header */}
      <div className={cn('flex items-center h-16 px-4 border-b border-surface-800', collapsed ? 'justify-center' : 'gap-2')}>
        <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">C</span>
        </div>
        {!collapsed && <span className="font-heading font-bold text-surface-100">{APP_NAME}</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1 scrollbar-hidden">
        {DASHBOARD_NAV.map((item) => (
          <SidebarLink key={item.href} href={item.href} icon={iconMap[item.icon]} label={item.label} collapsed={collapsed} active={location.pathname === item.href} />
        ))}
      </nav>

      {/* Bottom Nav */}
      <div className="border-t border-surface-800 py-3 px-2 space-y-1">
        {DASHBOARD_NAV_BOTTOM.map((item) => (
          <SidebarLink key={item.href} href={item.href} icon={iconMap[item.icon]} label={item.label} collapsed={collapsed} active={location.pathname === item.href} />
        ))}
        <button
          onClick={logout}
          className={cn(
            'flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer',
            'text-red-400/70 hover:text-red-400 hover:bg-red-500/10',
            collapsed && 'justify-center',
          )}
        >
          <LogOut size={20} />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>

      {/* User + Collapse Toggle */}
      <div className="border-t border-surface-800 p-3">
        {user && !collapsed && (
          <div className="flex items-center gap-3 mb-3 px-1">
            <Avatar src={user.avatar} alt={user.name} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-surface-200 truncate">{user.name}</p>
              <p className="text-xs text-surface-500 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'flex items-center justify-center w-full py-2 rounded-xl text-surface-500 hover:text-surface-300 hover:bg-white/5 transition-colors cursor-pointer',
          )}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
}

function SidebarLink({ href, icon, label, collapsed, active }: { href: string; icon: React.ReactNode; label: string; collapsed: boolean; active: boolean }) {
  return (
    <Link
      to={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
        collapsed && 'justify-center',
        active
          ? 'text-primary-400 bg-primary-500/10'
          : 'text-surface-400 hover:text-surface-100 hover:bg-white/5',
      )}
      title={collapsed ? label : undefined}
    >
      {icon}
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
