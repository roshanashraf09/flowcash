import React from 'react';
import {
  LayoutGrid,
  ArrowLeftRight,
  TrendingUp,
  Calendar,
  Settings,
  Sun,
  Moon,
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
    <aside className="w-56 shrink-0 flex flex-col justify-between p-5 select-none h-full bg-white dark:bg-[#1C1C1E] border-r border-black/[0.05] dark:border-white/[0.08]">
      {/* Top Logo & Navigation */}
      <div className="space-y-6">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group px-1 pt-1"
        >
          {FUN_ICONS.cash_logo}
          <span className="text-lg font-bold tracking-tight text-[#1C1C1E] dark:text-white">
            FlowCash
          </span>
        </div>

        {/* Menu Items with iOS Soft Rounded Highlights */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-150 active:scale-[0.98] ${
                  isActive
                    ? 'bg-[#007AFF]/12 dark:bg-[#007AFF]/20 text-[#007AFF] dark:text-[#0A84FF]'
                    : 'text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white hover:bg-black/[0.03] dark:hover:bg-white/[0.05]'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-[#007AFF] dark:text-[#0A84FF]' : 'text-[#8E8E93]'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area: Privacy Card & iOS Segmented Theme Toggle */}
      <div className="space-y-3 pt-4">
        {/* "Stays on this device" Card */}
        <div className="rounded-[24px] bg-gradient-to-br from-[#0EA5E9] via-[#0284C7] to-[#0D9488] p-4 text-white shadow-sm text-center space-y-2">
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

        {/* Clean iOS Segmented Theme Toggle */}
        <div className="p-1 bg-[#E5E5EA] dark:bg-[#2C2C2E] rounded-xl flex items-center justify-between text-xs font-semibold">
          <button
            onClick={() => setDarkMode(false)}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              !darkMode
                ? 'bg-white text-[#1C1C1E] shadow-[0_1px_4px_rgba(0,0,0,0.1)]'
                : 'text-[#8E8E93] hover:text-[#1C1C1E]'
            }`}
          >
            <Sun size={13} className={!darkMode ? 'text-amber-500' : ''} />
            <span>Light</span>
          </button>
          <button
            onClick={() => setDarkMode(true)}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              darkMode
                ? 'bg-[#636366] text-white shadow-[0_1px_4px_rgba(0,0,0,0.1)]'
                : 'text-[#8E8E93] hover:text-white'
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
