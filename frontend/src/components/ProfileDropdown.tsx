import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/utils/cn';

export function ProfileDropdown({ className }: { className?: string }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-white/5 transition-colors cursor-pointer"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Avatar src={user.avatar} alt={user.name} size="sm" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl glass-strong shadow-elevated py-1 z-[var(--z-dropdown)]">
          <div className="px-4 py-3 border-b border-surface-700/50">
            <p className="text-sm font-medium text-surface-100">{user.name}</p>
            <p className="text-xs text-surface-500 truncate">{user.email}</p>
          </div>
          <div className="py-1">
            <DropdownItem to="/dashboard/profile" icon={<User size={16} />} label="Profile" onClick={() => setOpen(false)} />
            <DropdownItem to="/dashboard/settings" icon={<Settings size={16} />} label="Settings" onClick={() => setOpen(false)} />
          </div>
          <div className="border-t border-surface-700/50 py-1">
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DropdownItem({ to, icon, label, onClick }: { to: string; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2 text-sm text-surface-300 hover:text-surface-100 hover:bg-white/5 transition-colors"
    >
      {icon}
      {label}
    </Link>
  );
}
