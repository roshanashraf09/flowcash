import React from 'react';
import { Film, Car, Zap, UtensilsCrossed, ShoppingBag, Coffee, Sparkles } from 'lucide-react';

export default function RecentTransactionsCard({
  items = [
    { id: 1, title: 'Entertainment', date: '01 Jun, 11.30am', percent: 50, color: '#8b5cf6', icon: Film, amount: 1250 },
    { id: 2, title: 'Transportation', date: '01 Jun, 11.30am', percent: 25, color: '#06b6d4', icon: Car, amount: 625 },
    { id: 3, title: 'Utilities', date: '01 Jun, 11.30am', percent: 15, color: '#f59e0b', icon: Zap, amount: 375 },
    { id: 4, title: 'Food', date: '01 Jun, 11.30am', percent: 15, color: '#10b981', icon: UtensilsCrossed, amount: 375 },
  ]
}) {
  return (
    <div className="rounded-[30px] bg-white dark:bg-slate-900 p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
          Recent Transcations
        </h3>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
      </div>

      <div className="space-y-4 flex-1 flex flex-col justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const radius = 17;
          const circumference = 2 * Math.PI * radius;
          const strokeDashoffset = circumference - (item.percent / 100) * circumference;

          return (
            <div
              key={item.id || item.title}
              className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group"
            >
              <div className="flex items-center gap-3.5">
                {/* Colorful Icon Badge */}
                <div
                  style={{ backgroundColor: `${item.color}15`, borderColor: `${item.color}35` }}
                  className="w-10 h-10 rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-105"
                >
                  <Icon size={18} style={{ color: item.color }} />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400 font-medium">
                    {item.date}
                  </p>
                </div>
              </div>

              {/* Circular Progress Gauge */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 transform -rotate-90">
                  {/* Track circle */}
                  <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    className="stroke-slate-100 dark:stroke-slate-800"
                    strokeWidth="3.5"
                    fill="transparent"
                  />
                  {/* Progress circle */}
                  <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    stroke={item.color}
                    strokeWidth="3.5"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>

                {/* Percentage text inside circle */}
                <span className="absolute text-[11px] font-bold text-slate-800 dark:text-slate-100 font-mono">
                  {item.percent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
