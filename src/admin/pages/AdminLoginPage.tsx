import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';

type View = 'login' | 'forgot' | 'sent';

export function AdminLoginPage() {
  const { login, resetPassword } = useAdminAuth();

  const [view, setView] = useState<View>('login');

  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Forgot password state
  const [resetEmail, setResetEmail] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetLoading, setResetLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setLoginError('Invalid email or password');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetError('');
    setResetLoading(true);
    try {
      await resetPassword(resetEmail);
      setView('sent');
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        setResetError('No account found with this email.');
      } else if (err.code === 'auth/invalid-email') {
        setResetError('Please enter a valid email address.');
      } else {
        setResetError('Something went wrong. Please try again.');
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* ── LOGO ─────────────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <div className="text-3xl font-black text-[#0A0A0A] mb-1">SSG</div>
          <div className="text-sm text-[#6B6B6B] font-medium">Admin Dashboard</div>
        </div>

        {/* ── LOGIN VIEW ───────────────────────────────────────────────── */}
        {view === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
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

            {/* Forgot password link */}
            <div className="text-right">
              <button
                type="button"
                onClick={() => { setView('forgot'); setResetEmail(email); setResetError(''); }}
                className="text-xs text-[#6B6B6B] hover:text-[#0A0A0A] underline underline-offset-2 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {loginError && <p className="text-xs text-red-500">{loginError}</p>}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full bg-[#0A0A0A] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#FF5A1F] transition-colors disabled:opacity-50"
            >
              {loginLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* ── FORGOT PASSWORD VIEW ─────────────────────────────────────── */}
        {view === 'forgot' && (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="mb-2">
              <h2 className="text-sm font-bold text-[#0A0A0A]">Reset your password</h2>
              <p className="text-xs text-[#6B6B6B] mt-1">
                Enter the email address linked to your admin account. We'll send you a reset link.
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#0A0A0A] mb-1.5">Email</label>
              <input
                type="email"
                value={resetEmail}
                onChange={e => setResetEmail(e.target.value)}
                className="w-full border border-[#E0E0E0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#0A0A0A]"
                placeholder="admin@ssg.com"
                required
                autoFocus
              />
            </div>

            {resetError && <p className="text-xs text-red-500">{resetError}</p>}

            <button
              type="submit"
              disabled={resetLoading}
              className="w-full bg-[#0A0A0A] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#FF5A1F] transition-colors disabled:opacity-50"
            >
              {resetLoading ? 'Sending...' : 'Send Reset Link'}
            </button>

            <button
              type="button"
              onClick={() => setView('login')}
              className="w-full text-xs text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors py-1"
            >
              ← Back to Sign In
            </button>
          </form>
        )}

        {/* ── EMAIL SENT VIEW ──────────────────────────────────────────── */}
        {view === 'sent' && (
          <div className="text-center space-y-4">
            {/* Checkmark icon */}
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0A0A0A]">Check your email</h2>
              <p className="text-xs text-[#6B6B6B] mt-1.5 leading-relaxed">
                A password reset link has been sent to<br />
                <span className="font-semibold text-[#0A0A0A]">{resetEmail}</span>.<br />
                Click the link in the email to set a new password.
              </p>
            </div>
            <p className="text-[11px] text-[#9B9B9B]">
              Didn't receive it? Check your spam folder or{' '}
              <button
                type="button"
                onClick={() => { setView('forgot'); setResetError(''); }}
                className="underline underline-offset-2 hover:text-[#0A0A0A] transition-colors"
              >
                try again
              </button>
              .
            </p>
            <button
              type="button"
              onClick={() => setView('login')}
              className="w-full bg-[#0A0A0A] text-white rounded-lg py-2.5 text-sm font-semibold hover:bg-[#FF5A1F] transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
