import { cn } from '@/utils/cn';
import { CATEGORIES } from '@/utils/constants';

interface CategoryChipsProps {
  selected?: string;
  onSelect: (slug: string) => void;
  className?: string;
}

export function CategoryChips({ selected, onSelect, className }: CategoryChipsProps) {
  const allCategories = [{ id: '0', name: 'All', slug: 'all', color: '#71717a' }, ...CATEGORIES];

  return (
    <div className={cn('flex flex-wrap gap-2', className)} role="tablist" aria-label="Categories">
      {allCategories.map((cat) => {
        const isActive = selected === cat.slug || (!selected && cat.slug === 'all');
        return (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.slug === 'all' ? '' : cat.slug)}
            role="tab"
            aria-selected={isActive}
            className={cn(
              'px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
              isActive
                ? 'text-white shadow-lg'
                : 'glass text-surface-300 hover:text-surface-100 hover:bg-glass-hover',
            )}
            style={isActive ? { backgroundColor: cat.color } : undefined}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
