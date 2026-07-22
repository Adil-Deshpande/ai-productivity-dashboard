'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Command, ShieldCheck, Terminal } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAF9F5] text-[#141413] font-sans">
      {/* Left Column — Architectural Panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-[#141413] text-[#FAF9F5] flex-col justify-between p-12 border-r border-[#2A2927]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-white text-[#141413] rounded flex items-center justify-center font-mono font-bold text-xs">
            GE
          </div>
          <span className="font-bold text-sm tracking-tight text-white">GOAL ENGINE</span>
        </div>

        <div>
          <span className="font-mono text-[11px] font-bold text-[#D97706] uppercase tracking-widest block mb-3">
            AUTHENTICATION SYSTEM
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-4 leading-snug">
            Access your structured workspace.
          </h2>
          <p className="text-xs text-[#A3A29E] leading-relaxed mb-8 max-w-sm">
            Stateless JWT authentication with secure HTTP-only cookies and complete user session isolation.
          </p>

          <div className="p-4 rounded-lg bg-[#1E1E1C] border border-[#2A2927] font-mono text-xs text-[#A3A29E] space-y-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              <span>JWT Cookie Encryption Verified</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              <span>PostgreSQL Connection Active</span>
            </div>
          </div>
        </div>

        <div className="font-mono text-[11px] text-[#73726D]">
          SYSTEM ID // GE-AUTH-SECURE
        </div>
      </div>

      {/* Right Column — Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8">
            <span className="font-mono text-[11px] font-bold text-[#73726D] uppercase tracking-widest block mb-1">
              SIGN IN
            </span>
            <h1 className="text-2xl font-bold text-[#141413] tracking-tight mb-2">Welcome back</h1>
            <p className="text-xs text-[#73726D]">
              New to Goal Engine?{' '}
              <Link href="/register" className="font-semibold text-[#141413] underline underline-offset-4 hover:text-[#73726D] transition-colors">
                Create an account
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#141413] uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full px-3.5 py-2.5 bg-white border border-[#E8E6DF] rounded-md text-sm text-[#141413] placeholder-[#A3A199] focus:outline-none focus:border-[#141413] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-[#141413] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-white border border-[#E8E6DF] rounded-md text-sm text-[#141413] placeholder-[#A3A199] focus:outline-none focus:border-[#141413] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#141413] hover:bg-[#2A2927] text-[#FAF9F5] text-xs font-semibold py-3 rounded-md transition-all flex items-center justify-center gap-2 shadow-sm tactile-btn disabled:opacity-60"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
