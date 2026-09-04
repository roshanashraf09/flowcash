import React from 'react';
import { Plus, Check, ArrowRight } from 'lucide-react';
import FunCategoryIcon, { FUN_ICONS } from './FunCategoryIcon';

export default function CenterDashboard({
  transactions = [],
  userName = 'Roshan',
  onOpenQuickAdd,
  onRecordScheduledPayment,
  scheduledRecorded = false,
}) {
  // Current month totals
  const now = new Date();
  const currentMonthName = now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
  const curYm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  const currentMonthTx = transactions.filter(t => t.date?.startsWith(curYm));

  let moneyIn = 0;
  let moneyOut = 0;

  currentMonthTx.forEach(t => {
    const amt = Number(t.amount);
    if (amt > 0) moneyIn += amt;
    else moneyOut += Math.abs(amt);
  });

  const leftThisMonth = moneyIn - moneyOut;

  // Category breakdown for "Where it went"
  const categoryMap = {};
  currentMonthTx.filter(t => t.amount < 0).forEach(t => {
    const cat = t.category || 'other';
    categoryMap[cat] = (categoryMap[cat] || 0) + Math.abs(Number(t.amount));
  });

  const breakdownList = Object.entries(categoryMap)
    .map(([cat, total]) => ({
      category: cat,
      total,
      percent: moneyOut > 0 ? (total / moneyOut) * 100 : 0
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="flex flex-col h-full space-y-3.5 select-none overflow-hidden">
      {/* 1. iOS-style Greeting Header */}
      <div className="flex items-center justify-between shrink-0 pt-0.5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1C1E] dark:text-white">
            Hello, {userName}
          </h1>
          <p className="text-xs text-[#8E8E93] font-medium mt-0.5">
            {currentMonthTx.length} entries this month
          </p>
        </div>

        <button
          onClick={onOpenQuickAdd}
          className="px-4 py-2 rounded-full bg-[#007AFF] hover:bg-[#0071E3] text-white text-xs font-semibold shadow-sm active:scale-[0.98] transition-all flex items-center gap-1.5"
        >
          <Plus size={14} />
          <span>Add entry</span>
        </button>
      </div>

      {/* 2. Hero Cyan-Teal Banner Card with iOS Soft Corners */}
      <div className="rounded-[26px] bg-gradient-to-r from-[#1398F4] via-[#0EADD0] to-[#0CBFA0] p-5 sm:p-6 text-white shadow-[0_4px_20px_rgba(14,173,208,0.18)] relative overflow-hidden shrink-0">
        {/* Soft background light reflections */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/15 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-sky-100 tracking-wide">
              Left this month
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-xl text-white border border-white/25">
              {currentMonthName}
            </span>
          </div>

          <div className="my-2.5">
            <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white tabular-nums">
              £{leftThisMonth.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* Frosted Glass Stat Boxes */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3 mt-3">
            <div className="p-3 sm:p-3.5 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/25">
              <span className="text-[11px] font-medium text-sky-100 block">
                Money in
              </span>
              <span className="text-base sm:text-lg font-bold tabular-nums text-white mt-0.5 block">
                £{moneyIn.toLocaleString('en-GB', { minimumFractionDigits: 0 })}
              </span>
            </div>

            <div className="p-3 sm:p-3.5 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/25">
              <span className="text-[11px] font-medium text-sky-100 block">
                Money out
              </span>
              <span className="text-base sm:text-lg font-bold tabular-nums text-white mt-0.5 block">
                £{moneyOut.toLocaleString('en-GB', { minimumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. iOS-style Scheduled / Notification Bar */}
      <div className="rounded-[20px] bg-white dark:bg-[#1C1C1E] border border-black/[0.04] dark:border-white/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-3 px-4 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {FUN_ICONS.calendar_check}
          <div className="min-w-0">
            <h4 className="text-xs font-semibold text-[#1C1C1E] dark:text-white truncate">
              {scheduledRecorded ? 'All scheduled payments recorded' : '1 monthly payment still to record'}
            </h4>
            <p className="text-[11px] text-[#8E8E93] truncate">
              {scheduledRecorded ? 'Rent payment for this month is up to date' : 'Rent - £950 altogether'}
            </p>
          </div>
        </div>

        {!scheduledRecorded ? (
          <button
            onClick={onRecordScheduledPayment}
            className="px-3.5 py-1.5 rounded-full bg-[#007AFF] hover:bg-[#0071E3] text-white text-xs font-semibold shadow-xs active:scale-95 transition-all shrink-0"
          >
            Record them all
          </button>
        ) : (
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <Check size={13} />
            <span>Recorded</span>
          </span>
        )}
      </div>

      {/* 4. Bottom Split Cards: Hits bottom of the card/screen before scrolling */}
      <div className="flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-2 gap-4 pb-1">
        {/* Card 1: Latest */}
        <div className="rounded-[24px] bg-white dark:bg-[#1C1C1E] border border-black/[0.05] dark:border-white/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-4 sm:p-5 flex flex-col h-full min-h-0 overflow-hidden">
          <div className="shrink-0">
            <h3 className="text-sm font-bold text-[#1C1C1E] dark:text-white">
              Latest
            </h3>
            <p className="text-xs text-[#8E8E93]">
              The last few things you added.
            </p>
          </div>

          {currentMonthTx.length === 0 ? (
            <div className="my-auto py-6 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
                {FUN_ICONS.cash_logo}
              </div>
              <div className="text-xs text-[#8E8E93] max-w-[200px]">
                <p className="font-semibold text-slate-700 dark:text-slate-300">Nothing here yet.</p>
                <p className="text-[11px]">Add your first entry and it'll appear.</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-y-auto mt-2.5 pr-1 space-y-1">
              {currentMonthTx.slice(0, 15).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FunCategoryIcon name={tx.category} />
                    <div className="min-w-0">
                      <div className="font-semibold text-[#1C1C1E] dark:text-white truncate">
                        {tx.description}
                      </div>
                      <div className="text-[10px] text-[#8E8E93] capitalize">
                        {tx.category}
                      </div>
                    </div>
                  </div>

                  <span className={`font-semibold tabular-nums whitespace-nowrap ${tx.amount > 0 ? 'text-[#34C759]' : 'text-[#1C1C1E] dark:text-white'}`}>
                    {tx.amount > 0 ? '+' : '-'}£{Math.abs(tx.amount).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card 2: Where it went */}
        <div className="rounded-[24px] bg-white dark:bg-[#1C1C1E] border border-black/[0.05] dark:border-white/[0.08] shadow-[0_2px_12px_rgba(0,0,0,0.03)] p-4 sm:p-5 flex flex-col h-full min-h-0 overflow-hidden">
          <div className="shrink-0">
            <h3 className="text-sm font-bold text-[#1C1C1E] dark:text-white">
              Where it went
            </h3>
            <p className="text-xs text-[#8E8E93]">
              This month, biggest first.
            </p>
          </div>

          {breakdownList.length === 0 ? (
            <div className="my-auto py-6 flex flex-col items-center justify-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {FUN_ICONS.pie_chart_box}
              </div>
              <p className="text-xs text-[#8E8E93] max-w-[200px]">
                Add an expense and the split shows up here.
              </p>
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-y-auto mt-2.5 pr-1 space-y-2.5">
              {breakdownList.map((item) => (
                <div key={item.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center gap-1.5 capitalize text-[#1C1C1E] dark:text-slate-200">
                      <FunCategoryIcon name={item.category} className="w-6 h-6 [&>svg]:w-6 [&>svg]:h-6" />
                      <span className="font-semibold text-[11px]">{item.category.replace('_', ' ')}</span>
                    </div>
                    <span className="font-semibold tabular-nums text-[#1C1C1E] dark:text-white text-[11px]">
                      £{item.total.toFixed(2)} ({item.percent.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#007AFF] h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, item.percent)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
