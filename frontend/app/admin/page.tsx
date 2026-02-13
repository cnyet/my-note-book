// frontend/app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { StatCard } from '@/components/admin/StatCard';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{
    usersCount: number;
    agentsCount: number;
    toolsCount: number;
    blogPostsCount: number;
  } | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await adminAuthApi.request<{ usersCount: number; agentsCount: number; toolsCount: number; blogPostsCount: number }>('/api/v1/admin/dashboard/stats');

        if (response.success && response.data) {
          setStats(response.data);
        } else {
          setError('Failed to load dashboard stats');
        }
      } catch (err) {
        setError('Network error loading stats');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <h1 className="text-3xl font-heading font-bold text-center text-gray-900 dark:text-white mb-8">
        Admin Dashboard
      </h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 border border-red text-red rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center text-gray-600">Loading stats...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="用户总数"
            value={stats?.usersCount || 0}
            icon="👥"
          />
          <StatCard
            title="智能体总数"
            value={stats?.agentsCount || 0}
            icon="🤖"
          />
          <StatCard
            title="工具库总数"
            value={stats?.toolsCount || 0}
            icon="🔧"
          />
          <StatCard
            title="博客文章总数"
            value={stats?.blogPostsCount || 0}
            icon="📝"
          />
        </div>
      )}
    </div>
  );
}
