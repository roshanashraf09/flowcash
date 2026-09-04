import React from 'react';
import {
  PieChart,
  FileSpreadsheet,
  Gauge,
  Repeat,
  Plus,
  UploadCloud,
  ShieldCheck,
  Moon,
  Sun,
  Layers,
  Sparkles,
  Command,
  Receipt
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  onOpenNewTransaction,
  onOpenImport,
  onOpenDataManager,
  darkMode,
  setDarkMode,
}) {
  const tabs = [
    { id: 'dashboard', label: 'Cash Flow', icon: PieChart, shortcut: '1' },
    { id: 'ledger', label: 'Ledger', icon: Receipt, shortcut: '2' },
    { id: 'caps', label: 'Spending Caps', icon: Gauge, shortcut: '3' },
    { id: 'recurring', label: 'Recurring Rules', icon: Repeat, shortcut: '4' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Logo & Brand */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sparkles size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white leading-none">
                Flow<span className="text-emerald-500">Cash</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-0.5">
                Offline Cash Flow
              </span>
            </div>
          </div>

          {/* Navigation Tabs (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/60 p-1 rounded-xl">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-emerald-500' : ''} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Record Button */}
          <button
            onClick={onOpenNewTransaction}
            className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm hover:shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1.5"
            title="Record transaction (Shortcut: N)"
          >
            <Plus size={15} />
            <span className="hidden sm:inline">Record</span>
            <kbd className="hidden lg:inline-block ml-1 px-1 py-0.2 rounded text-[10px] bg-emerald-600/60 font-mono font-normal">
              N
            </kbd>
          </button>

          {/* Statement Import Button */}
          <button
            onClick={onOpenImport}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
            title="Import bank statement (Shortcut: I)"
          >
            <UploadCloud size={15} />
            <span className="hidden sm:inline">Import</span>
            <kbd className="hidden lg:inline-block ml-0.5 px-1 py-0.2 rounded text-[10px] bg-slate-200 dark:bg-slate-700 font-mono font-normal text-slate-400">
              I
            </kbd>
          </button>

          {/* Privacy & Backup Vault */}
          <button
            onClick={onOpenDataManager}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all flex items-center gap-1.5"
            title="Privacy, backup and restore"
          >
            <ShieldCheck size={16} className="text-emerald-500" />
            <span className="hidden sm:inline">Vault</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} />}
          </button>
        </div>
      </div>

      {/* Mobile Tab Bar */}
      <nav className="flex md:hidden items-center justify-around mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-all ${
                isActive
                  ? 'text-emerald-500 font-bold'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </header>
  );
}
