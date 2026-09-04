import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Wallet, PiggyBank, Receipt, DollarSign } from 'lucide-react';

export default function MetricCards({ transactions = [] }) {
  // Current month calculation
  const now = new Date();
  const currentYearMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Previous month calculation
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevYearMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`;

  // Current month totals
  let curIncome = 0;
  let curExpenses = 0;
  let allTimeNet = 0;

  // Previous month totals for trends
  let prevIncome = 0;
  let prevExpenses = 0;

  transactions.forEach((t) => {
    const amt = Number(t.amount);
    allTimeNet += amt;

    if (t.date.startsWith(currentYearMonth)) {
      if (amt > 0) curIncome += amt;
      else curExpenses += Math.abs(amt);
    } else if (t.date.startsWith(prevYearMonth)) {
      if (amt > 0) prevIncome += amt;
      else prevExpenses += Math.abs(amt);
    }
  });

  const curNetCashFlow = curIncome - curExpenses;
  const savingsRate = curIncome > 0 ? Math.max(0, ((curIncome - curExpenses) / curIncome) * 100) : 0;

  // Calculate percentage changes
  const incomeChange = prevIncome > 0 ? ((curIncome - prevIncome) / prevIncome) * 100 : 0;
  const expenseChange = prevExpenses > 0 ? ((curExpenses - prevExpenses) / prevExpenses) * 100 : 0;

  const cards = [
    {
      title: 'Net Cash Flow',
      subtitle: 'This Month',
      value: `£${curNetCashFlow.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: Wallet,
      color: curNetCashFlow >= 0 ? '#10b981' : '#ef4444',
      badge: curNetCashFlow >= 0 ? 'Surplus' : 'Deficit',
      badgeType: curNetCashFlow >= 0 ? 'positive' : 'negative',
      detail: `All-time Net: £${allTimeNet.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    },
    {
      title: 'Total Inflow',
      subtitle: 'This Month',
      value: `£${curIncome.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: ArrowUpRight,
      color: '#10b981',
      trend: incomeChange !== 0 ? `${incomeChange > 0 ? '+' : ''}${incomeChange.toFixed(1)}% vs last mo` : 'Stable',
      trendPositive: incomeChange >= 0,
      detail: `${transactions.filter(t => t.date.startsWith(currentYearMonth) && t.amount > 0).length} income receipts`,
    },
    {
      title: 'Total Outflow',
      subtitle: 'This Month',
      value: `£${curExpenses.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: ArrowDownRight,
      color: '#f43f5e',
      trend: expenseChange !== 0 ? `${expenseChange > 0 ? '+' : ''}${expenseChange.toFixed(1)}% vs last mo` : 'On track',
      trendPositive: expenseChange <= 0, // Lower expenses is positive
      detail: `${transactions.filter(t => t.date.startsWith(currentYearMonth) && t.amount < 0).length} payments tracked`,
    },
    {
      title: 'Savings Rate',
      subtitle: 'Cash Retained',
      value: `${savingsRate.toFixed(1)}%`,
      icon: PiggyBank,
      color: '#8b5cf6',
      badge: savingsRate >= 30 ? 'Target Exceeded' : savingsRate >= 15 ? 'On Track' : 'Needs Attention',
      badgeType: savingsRate >= 30 ? 'positive' : savingsRate >= 15 ? 'neutral' : 'warning',
      detail: `£${Math.max(0, curNetCashFlow).toFixed(2)} retained this cycle`,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: idx * 0.05 }}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <span className="text-xs font-semibold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                  {card.subtitle}
                </span>
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                  {card.title}
                </h3>
              </div>
              <div
                style={{ backgroundColor: `${card.color}15`, borderColor: `${card.color}30` }}
                className="w-10 h-10 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105"
              >
                <IconComponent size={20} style={{ color: card.color }} />
              </div>
            </div>

            <div className="my-1">
              <div className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
                {card.value}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400 truncate max-w-[65%]">
                {card.detail}
              </span>
              {card.badge && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    card.badgeType === 'positive'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40'
                      : card.badgeType === 'warning'
                      ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/40'
                  }`}
                >
                  {card.badge}
                </span>
              )}
              {card.trend && (
                <span
                  className={`inline-flex items-center gap-1 font-medium ${
                    card.trendPositive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {card.trendPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  {card.trend}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
