import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`bg-white/95 rounded-2xl border border-border/80 shadow-[0_10px_30px_rgba(15,23,42,0.06)] ring-1 ring-black/5 p-1 ${className}`}>
      {children}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export function StatCard({ title, value, icon, trend, description }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="mb-2">{value}</h3>
          {trend && (
            <p className={`text-sm ${trend.isPositive ? 'text-green-600' : 'text-destructive'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              {description && <span className="text-muted-foreground ml-1">{description}</span>}
            </p>
          )}
        </div>
        <div className="p-3 bg-primary/10 rounded-xl text-primary ring-1 ring-primary/10">
          {icon}
        </div>
      </div>
    </Card>
  );
}
