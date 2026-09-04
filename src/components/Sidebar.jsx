import React from 'react';
import {
  LayoutGrid,
  ArrowLeftRight,
  TrendingUp,
  PiggyBank,
  Settings,
  Sparkles,
  Rocket,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  onOpenPremium,
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, color: '#3b82f6' },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight, color: '#10b981' },
    { id: 'reports', label: 'Reports', icon: TrendingUp, color: '#8b5cf6' },
    { id: 'budgets', label: 'Budgets', icon: PiggyBank, color: '#ec4899' },
    { id: 'settings', label: 'Settings', icon: Settings, color: '#f59e0b' },
  ];

  return (
    <aside className="w-60 shrink-0 flex flex-col justify-between p-6 bg-transparent select-none">
      {/* Top: Logo & Menu */}
      <div className="space-y-8">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-500/25 group-hover:scale-105 transition-all">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Flow<span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">Cash</span>
          </span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'bg-[#18181c] text-white shadow-lg shadow-black/10 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <Icon size={18} style={isActive ? { color: '#ffffff' } : { color: item.color }} />
                </div>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Upgrade Premium Card */}
      <div className="mt-8">
        <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-b from-[#1c1c22] to-[#121215] p-5 text-white shadow-xl border border-slate-800/80 group">
          {/* Subtle colorful neon glow */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-pink-500/15 rounded-full blur-xl pointer-events-none" />

          <h4 className="text-xs font-bold leading-snug pr-2 mb-3">
            Upgrade our Premium Feature Now !
          </h4>

          {/* Rocket Graphic */}
          <div className="relative py-2 flex items-center justify-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600/30 to-indigo-600/30 border border-purple-500/30 flex items-center justify-center relative shadow-inner group-hover:scale-105 transition-transform">
              <Rocket size={36} className="text-purple-400 transform -rotate-45 drop-shadow-[0_4px_10px_rgba(168,85,247,0.5)]" />
              <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-pink-400 animate-ping" />
              <span className="absolute bottom-2 left-2 w-1.5 h-1.5 rounded-full bg-yellow-300 animate-pulse" />
            </div>
          </div>

          <button
            onClick={onOpenPremium}
            className="w-full mt-3 py-2 px-3 rounded-xl bg-slate-700/60 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 text-slate-200 hover:text-white text-xs font-bold transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Zap size={13} className="text-yellow-400" />
            <span>Get Premium</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
