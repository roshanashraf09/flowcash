import React from 'react';
import {
  LayoutGrid,
  ArrowLeftRight,
  TrendingUp,
  Calendar,
  Settings,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';
import { FUN_ICONS } from './FunCategoryIcon';

export default function Sidebar({
  activeTab,
  setActiveTab,
  darkMode,
  setDarkMode,
}) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid },
    { id: 'history', label: 'History', icon: ArrowLeftRight },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'plan', label: 'Plan', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-56 shrink-0 flex flex-col justify-between p-5 select-none h-full">
      {/* Top Logo & Navigation */}
      <div className="space-y-6">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group px-1"
        >
          {FUN_ICONS.cash_logo}
          <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white">
            FlowCash
          </span>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 text-[#1D70F7] dark:text-blue-400 ring-1 ring-blue-500/20 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[#1D70F7] dark:text-blue-400' : 'text-slate-500'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Privacy Card & Theme Toggle */}
      <div className="space-y-3 pt-4">
        {/* "Stays on this device" Card */}
        <div className="rounded-2xl bg-gradient-to-br from-[#0EA5E9] via-[#0284C7] to-[#0D9488] p-4 text-white shadow-md shadow-blue-500/10 text-center space-y-2">
          <div className="flex justify-center">
            {FUN_ICONS.laptop_device}
          </div>
          <div>
            <h4 className="text-xs font-bold tracking-tight">
              Stays on this device
            </h4>
            <p className="text-[10px] text-sky-100/90 leading-tight mt-1 px-1">
              No accounts and no bank login. Add a folder in Settings to keep your own copy.
            </p>
          </div>
        </div>

        {/* Clean Theme Toggle */}
        <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-between text-xs">
          <button
            onClick={() => setDarkMode(false)}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition-all ${
              !darkMode
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun size={13} className={!darkMode ? 'text-amber-500' : ''} />
            <span>Light</span>
          </button>
          <button
            onClick={() => setDarkMode(true)}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 font-medium transition-all ${
              darkMode
                ? 'bg-slate-700 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Moon size={13} className={darkMode ? 'text-blue-300' : ''} />
            <span>Dark</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
