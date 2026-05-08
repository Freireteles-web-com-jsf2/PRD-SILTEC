import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  headerAction?: ReactNode;
}

export function Card({ children, className = '', title, subtitle, headerAction }: CardProps) {
  return (
    <div className={`glass-card rounded-xl overflow-hidden ${className}`}>
      {(title || subtitle || headerAction) && (
        <div className="p-lg border-b border-outline-variant/10 flex justify-between items-center">
          <div>
            {title && <h4 className="font-h3 text-h3 text-on-surface">{title}</h4>}
            {subtitle && <p className="font-label-sm text-on-surface-variant mt-xs">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-lg">
        {children}
      </div>
    </div>
  );
}
