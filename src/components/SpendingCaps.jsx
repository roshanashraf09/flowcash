import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Gauge, AlertTriangle, CheckCircle2, AlertCircle, Edit3, Check, X, ShieldAlert, Sparkles } from 'lucide-react';
import CategoryIcon from './CategoryIcon';

export default function SpendingCaps({
  transactions = [],
  categories = [],
  onUpdateCategoryCap
}) {
  const [editingCapId, setEditingCapId] = useState(null);
  const [capInputValue, setCapInputValue] = useState('');
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'capped' | 'warning'

  const now = new Date();
  const curYm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  // Compute spend per category for current month
  const categoryStats = useMemo(() => {
    const spendMap = {};

    transactions.forEach(t => {
      if (t.amount < 0 && t.date.startsWith(curYm)) {
        const cat = t.category || 'shopping';
        spendMap[cat] = (spendMap[cat] || 0) + Math.abs(Number(t.amount));
      }
    });

    return categories
      .filter(c => c.type === 'expense')
      .map(c => {
        const spent = spendMap[c.id] || 0;
        const cap = c.budgetCap !== null && c.budgetCap !== undefined ? Number(c.budgetCap) : null;
        const ratio = cap ? (spent / cap) * 100 : 0;
        const remaining = cap ? Math.max(0, cap - spent) : null;
        const isExceeded = cap ? spent > cap : false;
        const isWarning = cap ? ratio >= 75 && !isExceeded : false;

        return {
          ...c,
          spent,
          cap,
          ratio,
          remaining,
          isExceeded,
          isWarning,
        };
      });
  }, [transactions, categories, curYm]);

  // Overall totals
  const totalCappedBudget = categoryStats.reduce((sum, c) => sum + (c.cap || 0), 0);
  const totalSpendOnCapped = categoryStats.reduce((sum, c) => sum + (c.cap ? c.spent : 0), 0);
  const overallRatio = totalCappedBudget > 0 ? (totalSpendOnCapped / totalCappedBudget) * 100 : 0;
  const warningCount = categoryStats.filter(c => c.isWarning || c.isExceeded).length;

  const filteredStats = categoryStats.filter(c => {
    if (filterMode === 'capped') return c.cap !== null;
    if (filterMode === 'warning') return c.isWarning || c.isExceeded;
    return true;
  });

  const handleStartEdit = (cat) => {
    setEditingCapId(cat.id);
    setCapInputValue(cat.cap !== null ? String(cat.cap) : '');
  };

  const handleSaveCap = (catId) => {
    const val = capInputValue.trim() === '' ? null : parseFloat(capInputValue);
    onUpdateCategoryCap(catId, val && val > 0 ? val : null);
    setEditingCapId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Budget vs Actual */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
              Total Budgeted Envelope
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
                £{totalSpendOnCapped.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                / £{totalCappedBudget.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  overallRatio >= 90
                    ? 'bg-rose-500'
                    : overallRatio >= 75
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.min(100, overallRatio)}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-medium">
              <span>{overallRatio.toFixed(1)}% Utilized</span>
              <span>£{(totalCappedBudget - totalSpendOnCapped).toFixed(2)} Remaining</span>
            </div>
          </div>
        </div>

        {/* Status Alerts Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
            warningCount > 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
          }`}>
            {warningCount > 0 ? <AlertTriangle size={24} /> : <CheckCircle2 size={24} />}
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              {warningCount > 0 ? `${warningCount} Budget Warnings` : 'All Budgets Healthy'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {warningCount > 0
                ? 'Categories nearing or surpassing established monthly caps.'
                : 'Spending across all capped categories is within safe thresholds.'}
            </p>
          </div>
        </div>

        {/* Cap Controls & Filter */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Filter Envelopes
          </span>
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium mt-2">
            <button
              onClick={() => setFilterMode('all')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                filterMode === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              All ({categoryStats.length})
            </button>
            <button
              onClick={() => setFilterMode('capped')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                filterMode === 'capped'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Capped ({categoryStats.filter(c => c.cap).length})
            </button>
            <button
              onClick={() => setFilterMode('warning')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                filterMode === 'warning'
                  ? 'bg-white dark:bg-slate-700 text-rose-600 dark:text-rose-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Alerts ({warningCount})
            </button>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStats.map((item) => {
          const isEditing = editingCapId === item.id;
          const ratio = Math.min(100, item.ratio);

          // Determine color based on threshold requirements:
          // green under 75%, amber at 75-90%, red over 90% or exceeded
          let barColor = 'bg-emerald-500';
          let badgeColor = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/50';
          let statusText = 'Normal';

          if (item.isExceeded) {
            barColor = 'bg-rose-500';
            badgeColor = 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200/50';
            statusText = 'Exceeded';
          } else if (item.ratio >= 90) {
            barColor = 'bg-rose-500';
            badgeColor = 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200/50';
            statusText = 'Critical (>90%)';
          } else if (item.ratio >= 75) {
            barColor = 'bg-amber-500';
            badgeColor = 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200/50';
            statusText = 'Caution (75-90%)';
          }

          return (
            <motion.div
              key={item.id}
              layout
              className={`p-5 rounded-2xl bg-white dark:bg-slate-900/90 border transition-all duration-200 ${
                item.isExceeded
                  ? 'border-rose-300 dark:border-rose-900/60 shadow-sm shadow-rose-500/5 ring-1 ring-rose-500/20'
                  : item.ratio >= 75
                  ? 'border-amber-300 dark:border-amber-900/60'
                  : 'border-slate-200/80 dark:border-slate-800/80'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <CategoryIcon name={item.icon} color={item.color} size="sm" />
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.label}
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      {item.cap ? `£${item.spent.toFixed(2)} of £${item.cap.toFixed(2)}` : 'No monthly cap set'}
                    </span>
                  </div>
                </div>

                {item.cap ? (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}`}>
                    {statusText}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-400">
                    Uncapped
                  </span>
                )}
              </div>

              {/* Progress Bar (if capped) */}
              {item.cap ? (
                <div className="space-y-1.5 my-3">
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${Math.min(100, item.ratio)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>{item.ratio.toFixed(1)}% spent</span>
                    <span className={item.isExceeded ? 'text-rose-500 font-bold' : ''}>
                      {item.isExceeded
                        ? `£${(item.spent - item.cap).toFixed(2)} over`
                        : `£${item.remaining.toFixed(2)} left`}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-2.5 text-xs text-slate-400 font-mono">
                  Current spend: £{item.spent.toFixed(2)}
                </div>
              )}

              {/* Card Footer / Inline Cap Editor */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                {isEditing ? (
                  <div className="flex items-center gap-1.5 w-full">
                    <span className="text-xs font-mono text-slate-400">£</span>
                    <input
                      type="number"
                      value={capInputValue}
                      onChange={(e) => setCapInputValue(e.target.value)}
                      placeholder="e.g. 350"
                      autoFocus
                      className="w-24 px-2 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none"
                    />
                    <button
                      onClick={() => handleSaveCap(item.id)}
                      className="p-1 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
                    >
                      <Check size={13} />
                    </button>
                    <button
                      onClick={() => setEditingCapId(null)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-[11px] text-slate-400">
                      Cap: {item.cap ? `£${item.cap}` : 'None'}
                    </span>
                    <button
                      onClick={() => handleStartEdit(item)}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Edit3 size={12} />
                      <span>{item.cap ? 'Adjust Cap' : 'Set Cap'}</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
