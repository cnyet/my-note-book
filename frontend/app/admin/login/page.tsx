// frontend/app/admin/login/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuthApi } from '@/lib/admin-api';
import { setAuthTokens, setAdminUser } from '@/lib/admin-auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const response = await adminAuthApi.login(username, password);

    if (!response.success) {
      setError(response.error?.message || 'Login failed');
      setLoading(false);
      return;
    }

    const { access_token, refresh_token } = response.data!;

    setAuthTokens(access_token, refresh_token);

    // Get user info
    const userResponse = await adminAuthApi.verify();
    if (userResponse.success) {
      setAdminUser(userResponse.data!);
      router.push('/admin');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 bg-surface rounded-lg border border-gray-200 dark:border-gray-800">
        <h1 className="text-2xl font-heading font-bold text-center mb-6 text-primary">
          Admin Login
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-error-100 dark:bg-error-900/20 border border-error text-error rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-void border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-secondary mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-void border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-primary text-surface font-medium rounded hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
