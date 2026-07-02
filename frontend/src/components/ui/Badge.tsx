import { cn } from '@/utils/cn';

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'accent' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  color?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-surface-800 text-surface-300',
  primary: 'bg-primary-600/20 text-primary-300',
  secondary: 'bg-secondary-600/20 text-secondary-300',
  accent: 'bg-accent-500/20 text-accent-400',
  outline: 'border border-surface-600 text-surface-300 bg-transparent',
};

export function Badge({ children, variant = 'default', className, color }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        !color && variantStyles[variant],
        className,
      )}
      style={
        color
          ? { backgroundColor: `${color}20`, color }
          : undefined
      }
    >
      {children}
    </span>
  );
}
