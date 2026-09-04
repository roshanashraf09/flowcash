import React from 'react';

export default function SpendingDonutCard({
  breakdown = [
    { title: 'Entertainment', amount: 1250, color: '#8b5cf6', dotClass: 'bg-purple-500' },
    { title: 'Transportation', amount: 625, color: '#06b6d4', dotClass: 'bg-cyan-500' },
    { title: 'Utilities', amount: 375, color: '#f59e0b', dotClass: 'bg-amber-500' },
    { title: 'Food', amount: 375, color: '#10b981', dotClass: 'bg-emerald-500' },
  ]
}) {
  return (
    <div className="rounded-[30px] bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between">
      {/* Circular Multi-Tone Donut */}
      <div className="relative w-full h-44 flex items-center justify-center">
        <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r="38"
            className="stroke-slate-100 dark:stroke-slate-800"
            strokeWidth="10"
            fill="transparent"
          />

          {/* Segment 1: Entertainment 50% */}
          <circle
            cx="50"
            cy="50"
            r="38"
            stroke="#18181c"
            className="dark:stroke-purple-500"
            strokeWidth="10"
            strokeDasharray="119.38 238.76"
            strokeDashoffset="0"
            strokeLinecap="round"
            fill="transparent"
          />

          {/* Segment 2: Transportation 25% */}
          <circle
            cx="50"
            cy="50"
            r="38"
            stroke="#94a3b8"
            className="dark:stroke-cyan-500"
            strokeWidth="10"
            strokeDasharray="59.69 238.76"
            strokeDashoffset="-125"
            strokeLinecap="round"
            fill="transparent"
          />

          {/* Segment 3: Utilities 15% */}
          <circle
            cx="50"
            cy="50"
            r="38"
            stroke="#cbd5e1"
            className="dark:stroke-amber-500"
            strokeWidth="10"
            strokeDasharray="35.81 238.76"
            strokeDashoffset="-188"
            strokeLinecap="round"
            fill="transparent"
          />

          {/* Segment 4: Food 10% */}
          <circle
            cx="50"
            cy="50"
            r="38"
            stroke="#e2e8f0"
            className="dark:stroke-emerald-500"
            strokeWidth="10"
            strokeDasharray="23.87 238.76"
            strokeDashoffset="-226"
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* 50% Big Center Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
            50%
          </span>
        </div>
      </div>

      {/* Legend with Amounts */}
      <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
        {breakdown.map((item) => (
          <div key={item.title} className="flex items-center justify-between font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-600 dark:text-slate-300">{item.title}</span>
            </div>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              $ {item.amount.toLocaleString('en-US', { minimumFractionDigits: 0 })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
