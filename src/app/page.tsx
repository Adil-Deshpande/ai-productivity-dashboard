'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check, Command, Layers, ShieldCheck, Terminal, Cpu } from 'lucide-react';

const architectureSteps = [
  {
    step: '01',
    title: 'Intelligent Goal Breakdown',
    description: 'Provide any high-level objective. The engine uses LLMs to structure a multi-stage task tree with priorities and execution steps.',
  },
  {
    step: '02',
    title: 'Cascading State Machine',
    description: 'Task statuses automatically roll up into overarching goal completion scores with zero manual tracking friction.',
  },
  {
    step: '03',
    title: 'Stateless Enterprise Auth',
    description: 'Secured via HTTP-only cookie JWT architecture, Zod contract validation, and strict database isolation.',
  },
];

const demoTasks = [
  { title: 'Gather Ingredients & Equipment', done: true, priority: 'HIGH' },
  { title: 'Preheat Glassware & Measure Ratios', done: true, priority: 'MEDIUM' },
  { title: 'Brew Dark Espresso Extraction', done: true, priority: 'HIGH' },
  { title: 'Prepare Sweetened Whiskey Base', done: false, priority: 'HIGH' },
  { title: 'Float Layered Heavy Cream', done: false, priority: 'LOW' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141413] font-sans selection:bg-stone-900 selection:text-stone-50 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-[#E8E6DF] bg-[#FAF9F5]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#141413] rounded flex items-center justify-center text-white text-xs font-mono font-bold">
              GE
            </div>
            <span className="font-bold text-sm tracking-tight text-[#141413]">GOAL ENGINE</span>
            <span className="font-mono text-[10px] bg-[#E8E6DF] text-[#52514D] px-2 py-0.5 rounded font-semibold tracking-wider">
              v2.4
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs font-semibold text-[#52514D] hover:text-[#141413] transition-colors px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-xs font-semibold bg-[#141413] hover:bg-[#2A2927] text-[#FAF9F5] px-4 py-2 rounded-md transition-all flex items-center gap-1.5 shadow-sm tactile-btn"
            >
              <span>Get Started</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero */}
      <main className="flex-1 flex flex-col items-center">
        <section className="w-full max-w-5xl mx-auto px-6 pt-20 pb-16 text-center flex flex-col items-center">
          
          {/* Eyebrow Label */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 border border-[#E8E6DF] bg-[#F2F1EC] text-[#52514D] font-mono text-[11px] font-semibold tracking-widest px-3.5 py-1.5 rounded-full uppercase mb-8"
          >
            <Terminal className="w-3.5 h-3.5 text-[#141413]" />
            TASK ARCHITECTURE PLATFORM
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#141413] leading-[1.08] max-w-4xl mb-6"
          >
            Turn complex ambitions into structured execution.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-[#52514D] max-w-2xl mx-auto mb-10 leading-relaxed font-normal"
          >
            A calm, systematic workspace powered by LLMs that decomposes high-level goals into actionable task trees with automatic progress rollups.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-3 mb-16"
          >
            <Link
              href="/register"
              className="w-full sm:w-auto bg-[#141413] hover:bg-[#2A2927] text-[#FAF9F5] text-sm font-semibold px-7 py-3.5 rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm tactile-btn"
            >
              <span>Launch Dashboard</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto border border-[#E8E6DF] bg-white hover:bg-[#F2F1EC] text-[#141413] text-sm font-semibold px-7 py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Sign In to Account
            </Link>
          </motion.div>

          {/* Live Workspace Mockup Module */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-3xl border border-[#E8E6DF] bg-white rounded-xl shadow-lg shadow-stone-200/50 overflow-hidden text-left"
          >
            {/* Header bar */}
            <div className="bg-[#F5F4EF] border-b border-[#E8E6DF] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#E8E6DF]" />
                <div className="w-3 h-3 rounded-full bg-[#E8E6DF]" />
                <div className="w-3 h-3 rounded-full bg-[#E8E6DF]" />
                <span className="font-mono text-xs text-[#73726D] ml-2">GOAL / irish-coffee-mastery</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[11px] text-[#73726D]">
                <Cpu className="w-3.5 h-3.5 text-[#141413]" />
                <span>LLM PARSED</span>
              </div>
            </div>

            {/* Content area */}
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 mb-5 border-b border-[#E8E6DF]">
                <div>
                  <h3 className="font-bold text-base text-[#141413]">Master Authentic Irish Coffee Preparation</h3>
                  <p className="text-xs text-[#73726D] mt-0.5">5 subtasks generated • 60% completion rate</p>
                </div>
                <div className="self-start sm:self-auto font-mono text-xs font-semibold text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-1 rounded">
                  STATUS: IN_PROGRESS
                </div>
              </div>

              {/* Task Tree */}
              <div className="space-y-2.5">
                {demoTasks.map((t) => (
                  <div
                    key={t.title}
                    className={`flex items-center justify-between p-3 rounded-lg border text-xs font-medium transition-colors ${
                      t.done
                        ? 'bg-[#F9F8F3] border-[#E8E6DF] text-[#73726D]'
                        : 'bg-white border-[#E8E6DF] text-[#141413]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center ${
                          t.done
                            ? 'bg-[#141413] border-[#141413] text-white'
                            : 'border-[#D1CEC4]'
                        }`}
                      >
                        {t.done && <Check className="w-3 h-3" strokeWidth={3} />}
                      </div>
                      <span className={t.done ? 'line-through text-[#73726D]' : ''}>
                        {t.title}
                      </span>
                    </div>

                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded font-semibold ${
                        t.priority === 'HIGH'
                          ? 'bg-[#FEF2F2] text-[#991B1B]'
                          : t.priority === 'MEDIUM'
                          ? 'bg-[#FFFBEB] text-[#92400E]'
                          : 'bg-[#F0FDF4] text-[#166534]'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        {/* Architecture Grid Section */}
        <section className="w-full border-t border-[#E8E6DF] bg-white py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-14">
              <span className="font-mono text-[11px] font-bold text-[#73726D] uppercase tracking-widest block mb-2">
                SYSTEM ARCHITECTURE
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-[#141413]">
                Engineered for speed and clarity.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {architectureSteps.map((item) => (
                <div
                  key={item.step}
                  className="p-6 border border-[#E8E6DF] rounded-xl bg-[#FAF9F5]/50 flex flex-col justify-between"
                >
                  <div>
                    <div className="font-mono text-sm font-bold text-[#D97706] mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-bold text-base text-[#141413] mb-2">{item.title}</h3>
                    <p className="text-xs text-[#52514D] leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="w-full border-t border-[#E8E6DF] bg-[#FAF9F5] py-16 px-6 text-center">
          <div className="max-w-xl mx-auto">
            <h3 className="text-2xl font-bold tracking-tight text-[#141413] mb-3">
              Ready to structure your goals?
            </h3>
            <p className="text-sm text-[#73726D] mb-6">
              Get started in seconds. No setup required.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 bg-[#141413] hover:bg-[#2A2927] text-[#FAF9F5] text-xs font-semibold px-6 py-3 rounded-md transition-all shadow-sm tactile-btn"
            >
              <span>Create Free Account</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E6DF] bg-[#F5F4EF] py-6 px-6 text-center font-mono text-xs text-[#73726D]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>GOAL ENGINE — CLEAN ARCHITECTURE DEMO</span>
          <span>SYSTEM RUNNING ON NEON & NEXT.JS</span>
        </div>
      </footer>
    </div>
  );
}
