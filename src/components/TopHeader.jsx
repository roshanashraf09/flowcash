import React, { useState } from 'react';
import { Plus, Bell, LogOut, UserCheck, ShieldCheck, ChevronDown, Sparkles } from 'lucide-react';

export default function TopHeader({
  currentUser,
  onOpenAddExpense,
  onOpenGoogleAuth,
  onLogout,
}) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
      {/* Greeting & Quick Action */}
      <div className="flex flex-wrap items-center gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Hello, {currentUser?.name || 'Tirth Gorasiya'}
          </h1>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
            Welcome Back !
          </p>
        </div>

        {/* Top "+ Add Expense" Pill Button */}
        <button
          onClick={onOpenAddExpense}
          className="px-4 py-2.5 rounded-2xl bg-[#18181c] hover:bg-black text-white text-xs font-bold shadow-md shadow-black/10 active:scale-95 transition-all flex items-center gap-2 group"
        >
          <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center group-hover:rotate-90 transition-transform">
            <Plus size={12} className="text-white" />
          </div>
          <span>+ Add Expense</span>
        </button>
      </div>

      {/* Right: Notifications & Google User Profile */}
      <div className="flex items-center gap-3 self-end sm:self-auto">
        {/* Notification Bell */}
        <button
          className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all relative group"
          title="Notifications"
        >
          <Bell size={18} className="group-hover:scale-110 transition-transform text-amber-500" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-800" />
        </button>

        {/* Profile Avatar & Google Account Switcher */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-sm hover:border-slate-300 transition-all group"
          >
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
              alt={currentUser?.name || 'User'}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-500/40"
            />
            <ChevronDown size={14} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform" />
          </button>

          {/* Profile Dropdown */}
          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 z-50 text-xs space-y-2 animate-in fade-in slide-in-from-top-2">
              <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl">
                <div className="font-bold text-slate-900 dark:text-white truncate">
                  {currentUser?.name || 'Tirth Gorasiya'}
                </div>
                <div className="text-[11px] text-slate-400 truncate font-mono">
                  {currentUser?.email || 'tirth.gorasiya@gmail.com'}
                </div>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  Google Account
                </span>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onOpenGoogleAuth();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition-colors text-left"
                >
                  <UserCheck size={14} className="text-blue-500" />
                  <span>Switch Google Account</span>
                </button>

                <button
                  onClick={() => {
                    setProfileDropdownOpen(false);
                    onLogout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-medium transition-colors text-left"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
