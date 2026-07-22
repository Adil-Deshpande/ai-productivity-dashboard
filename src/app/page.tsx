'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Target, TrendingUp, Bell, ArrowRight, CheckCircle2, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI Goal Decomposition',
    description: 'Type any ambition. Our AI instantly breaks it into a prioritized, actionable task hierarchy.',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description: 'Visualize momentum with real-time completion rates, streaks, and goal health scores.',
    color: 'from-blue-500 to-cyan-600',
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Shield,
    title: 'Secure by Design',
    description: 'JWT authentication, HTTP-only cookies, and row-level data isolation keep your data private.',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
];

const demoTasks = [
  { title: 'Gather Ingredients & Equipment', done: true },
  { title: 'Preheat the Glassware', done: true },
  { title: 'Brew Fresh Coffee', done: true },
  { title: 'Prepare Sweetened Whiskey Base', done: false },
  { title: 'Whip the Cream', done: false },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex flex-col">

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Target className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Goal Engine</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-slate-300 hover:text-white text-sm font-medium transition-colors px-4 py-2 rounded-xl hover:bg-white/10"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5"
          >
            Get Started Free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-32 text-center max-w-7xl mx-auto w-full">

        {/* Glow orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Google Gemma AI
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6 max-w-4xl">
            Turn any ambition into
            <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
              a clear action plan
            </span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Goal Engine uses AI to decompose your biggest goals into prioritized, trackable tasks — so you spend less time planning and more time doing.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              href="/register"
              className="group flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 text-white font-semibold px-8 py-4 rounded-2xl text-base transition-all shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-1"
            >
              Start for free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/login"
              className="flex items-center gap-2 text-slate-300 hover:text-white font-medium px-8 py-4 rounded-2xl text-base transition-colors hover:bg-white/10 border border-white/10 hover:border-white/20"
            >
              Sign in to your account
            </Link>
          </div>
        </motion.div>

        {/* Demo UI card */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-2xl float-anim"
        >
          <div className="rounded-[24px] overflow-hidden shadow-2xl shadow-black/60 border border-white/10 bg-slate-900/80 backdrop-blur-md">
            {/* Fake title bar */}
            <div className="flex items-center gap-2 px-5 py-3.5 bg-slate-800/80 border-b border-white/10">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <div className="flex-1 mx-4 h-5 rounded-md bg-slate-700/60 flex items-center px-3">
                <span className="text-slate-500 text-xs">app.goalengine.dev/dashboard</span>
              </div>
            </div>
            {/* Fake content */}
            <div className="p-6 space-y-3">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-1">AI Generated Goal</p>
                  <p className="text-white font-semibold text-base">Master Authentic Irish Coffee</p>
                </div>
                <div className="text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full">
                  ✓ Completed
                </div>
              </div>
              {demoTasks.map((task, i) => (
                <motion.div
                  key={task.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-xl ${task.done ? 'bg-emerald-500/10 border border-emerald-500/15' : 'bg-slate-800/60 border border-white/5'}`}
                >
                  <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${task.done ? 'text-emerald-400' : 'text-slate-600'}`} />
                  <span className={`text-sm ${task.done ? 'text-slate-400 line-through decoration-emerald-500/50' : 'text-slate-300'}`}>
                    {task.title}
                  </span>
                </motion.div>
              ))}
              {/* Progress bar */}
              <div className="pt-3">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>Progress</span>
                  <span className="text-emerald-400 font-semibold">60%</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features */}
      <section className="relative z-10 bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">
              Built for high performers
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Every feature is designed to reduce friction and maximize the time you spend on work that matters.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="group p-8 rounded-[24px] border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`w-12 h-12 ${feature.bg} rounded-2xl flex items-center justify-center mb-6`}>
                    <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-xl mb-3">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-gradient-to-r from-indigo-600 to-violet-600 py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <Zap className="w-10 h-10 text-white/80 mx-auto mb-4" />
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">Ready to achieve more?</h2>
          <p className="text-indigo-200 text-lg mb-8">
            Join and start turning your goals into reality in under 60 seconds.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 font-bold px-8 py-4 rounded-2xl text-base hover:bg-indigo-50 transition-colors shadow-xl"
          >
            Create your free account
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
