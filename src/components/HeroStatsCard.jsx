import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Sparkles, TrendingUp } from 'lucide-react';

export default function HeroStatsCard({
  currentUser,
  outcome = 2500,
  income = 5500,
}) {
  return (
    <div className="relative overflow-hidden rounded-[30px] bg-gradient-to-r from-[#18181c] via-[#1c1c22] to-[#161619] p-6 lg:p-7 text-white shadow-xl border border-slate-800/80">
      {/* Colorful background ambient glows */}
      <div className="absolute top-0 right-1/4 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* User Bio on Left */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={currentUser?.name || 'Tirth Gorasiya'}
              className="w-16 h-16 rounded-full object-cover ring-4 ring-purple-500/30 shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-full border-2 border-[#18181c] flex items-center justify-center">
              <Sparkles size={10} className="text-white" />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-white tracking-tight">
              {currentUser?.name || 'Tirth Gorasiya'}
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {currentUser?.role || 'UI/UX Designer'}
            </p>
          </div>
        </div>

        {/* Statistics on Right */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-slate-400 text-left md:text-center tracking-wide">
            Statistics (This Month)
          </div>

          <div className="flex items-center gap-3">
            {/* Outcome Stat Pill */}
            <div className="px-5 py-3.5 rounded-2xl bg-[#23232a] border border-slate-700/60 hover:border-rose-500/40 shadow-inner flex flex-col min-w-[130px] transition-all group">
              <span className="text-lg font-bold font-mono text-white group-hover:text-rose-400 transition-colors">
                $ {outcome.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 font-medium">
                <span className="text-rose-400 font-bold">↖</span>
                <span>Outcome</span>
              </div>
            </div>

            {/* Income Stat Pill */}
            <div className="px-5 py-3.5 rounded-2xl bg-[#23232a] border border-slate-700/60 hover:border-emerald-500/40 shadow-inner flex flex-col min-w-[130px] transition-all group">
              <span className="text-lg font-bold font-mono text-white group-hover:text-emerald-400 transition-colors">
                $ {income.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5 font-medium">
                <span className="text-emerald-400 font-bold">↘</span>
                <span>Income</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
