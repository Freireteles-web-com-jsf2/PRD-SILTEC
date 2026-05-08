interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'error' | 'outline';
  className?: string;
}

export function Badge({ children, variant = 'primary', className = '' }: BadgeProps) {
  const variants = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    tertiary: 'bg-tertiary/10 text-tertiary',
    error: 'bg-error/10 text-error',
    outline: 'border border-outline-variant/30 text-on-surface-variant'
  };

  return (
    <span className={`${variants[variant]} px-sm py-xs rounded text-label-sm font-bold ${className}`}>
      {children}
    </span>
  );
}
