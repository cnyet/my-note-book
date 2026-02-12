// frontend/components/admin/StatCard.tsx
'use client';

import clsx from 'clsx';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: string;
}

export function StatCard({ title, value, change, icon }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {icon && (
            <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
              <span className="text-xl">{icon}</span>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {value}
            </p>
          </div>
        </div>
        {change !== undefined && change !== 0 && (
          <div className={change > 0 ? 'text-green-600' : 'text-red-600'}>
            <span className="text-sm">
              {change > 0 ? '+' : ''}{change}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
