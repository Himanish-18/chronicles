import { Search } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ value, onChange, placeholder = 'Search articles...', className }: SearchBarProps) {
  return (
    <div className={cn('relative w-full max-w-md', className)}>
      <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-500" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-xl border border-surface-700 bg-surface-900/50 pl-10 pr-4 py-2.5 text-sm text-surface-100',
          'placeholder:text-surface-500',
          'focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500',
          'transition-all duration-200',
        )}
        aria-label="Search"
      />
    </div>
  );
}
