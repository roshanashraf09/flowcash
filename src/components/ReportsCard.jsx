import React, { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';

export default function ReportsCard() {
  const [selectedMonth, setSelectedMonth] = useState('Jan');
  const [activeRange, setActiveRange] = useState('Month');

  const months = ['Jan', 'Feb', 'March', 'April', 'May'];

  // Wave points mapping for svg smooth bezier
  const points = [
    { x: 30, y: 80, month: 'Jan', val: '2.4k' },
    { x: 80, y: 35, month: 'Feb', val: '12.8k' },
    { x: 130, y: 110, month: 'March', val: '1.2k' },
    { x: 180, y: 48, month: 'April', val: '3400.00', isHighlight: true },
    { x: 230, y: 120, month: 'May', val: '0.8k' },
  ];

  return (
    <div className="rounded-[30px] bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
          Reports
        </h3>

        <div className="relative">
          <button className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <span>{activeRange}</span>
            <ChevronDown size={13} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="relative w-full h-44 my-1">
        {/* Y-Axis Labels */}
        <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] font-mono text-slate-400 select-none">
          <span>15k</span>
          <span>10k</span>
          <span>5k</span>
          <span>0k</span>
        </div>

        {/* Highlight Tooltip on Peak */}
        <div className="absolute left-[135px] top-[2px] z-10 animate-pulse-subtle">
          <div className="relative px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg text-[11px] font-semibold text-slate-800 dark:text-white">
            <span className="text-slate-400 text-[10px] block">Expense</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">$ 3400.00</span>
            {/* Arrow down pointer */}
            <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 bg-white dark:bg-slate-800 border-r border-b border-slate-200 dark:border-slate-700 transform rotate-45" />
          </div>
        </div>

        {/* SVG Smooth Wave */}
        <svg className="w-full h-full pl-8 pr-2" viewBox="0 0 250 140" fill="none">
          {/* Defs for colorful gradient */}
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area fill under curve */}
          <path
            d="M 30 80 Q 55 10 80 35 T 130 110 T 180 48 T 230 120 L 230 140 L 30 140 Z"
            fill="url(#areaGradient)"
          />

          {/* Smooth Curve Line */}
          <path
            d="M 30 80 Q 55 10 80 35 T 130 110 T 180 48 T 230 120"
            stroke="#18181c"
            className="dark:stroke-slate-200"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="transparent"
          />

          {/* Peak Highlight Circle Indicator */}
          <circle cx="180" cy="48" r="4.5" className="fill-white stroke-slate-900 dark:stroke-white" strokeWidth="2.5" />
        </svg>
      </div>

      {/* Months Selector / Legend */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold">
        {months.map((m) => {
          const isSelected = selectedMonth === m;
          return (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className={`px-3 py-1 rounded-full transition-all ${
                isSelected
                  ? 'bg-[#18181c] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {m}
            </button>
          );
        })}
      </div>
    </div>
  );
}
