'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      router.push('/login');
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
            CREATE WORKSPACE
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-white mb-4 leading-snug">
            Start structuring your execution today.
          </h2>
          <p className="text-xs text-[#A3A29E] leading-relaxed mb-8 max-w-sm">
            Free tier includes full LLM goal breakdown, progress rollups, and interactive board views.
          </p>

          <div className="p-4 rounded-lg bg-[#1E1E1C] border border-[#2A2927] font-mono text-xs text-[#A3A29E] space-y-2">
            <div className="flex items-center gap-2 text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              <span>Free Forever Core Features</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              <span>Instant AI Task Tree Generation</span>
            </div>
          </div>
        </div>

        <div className="font-mono text-[11px] text-[#73726D]">
          REGISTER // GE-V2.4
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
              SIGN UP
            </span>
            <h1 className="text-2xl font-bold text-[#141413] tracking-tight mb-2">Create an account</h1>
            <p className="text-xs text-[#73726D]">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-[#141413] underline underline-offset-4 hover:text-[#73726D] transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3 rounded bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-[#141413] uppercase tracking-wider mb-1.5">
                Full Name <span className="text-[#A3A199] font-normal">(optional)</span>
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full px-3.5 py-2.5 bg-white border border-[#E8E6DF] rounded-md text-sm text-[#141413] placeholder-[#A3A199] focus:outline-none focus:border-[#141413] transition-colors"
              />
            </div>

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
                placeholder="Min 8 characters"
                className="w-full px-3.5 py-2.5 bg-white border border-[#E8E6DF] rounded-md text-sm text-[#141413] placeholder-[#A3A199] focus:outline-none focus:border-[#141413] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#141413] hover:bg-[#2A2927] text-[#FAF9F5] text-xs font-semibold py-3 rounded-md transition-all flex items-center justify-center gap-2 shadow-sm tactile-btn disabled:opacity-60"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
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
