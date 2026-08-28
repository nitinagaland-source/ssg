import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';

export function AdminLoginPage() {
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-3xl font-black text-[#0A0A0A] mb-1">SSG</div>
          <div className="text-sm text-[#6B6B6B] font-medium">Admin Dashboard</div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0A0A0A]"
              placeholder="admin@ssg.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0A0A0A]"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0A0A0A] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#FF5A1F] transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
