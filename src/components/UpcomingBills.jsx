import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import CategoryIcon from './CategoryIcon';

export default function UpcomingBills({
  recurringRules = [],
  categories = [],
  onLogPayment
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const categoryLookup = React.useMemo(() => {
    const map = {};
    categories.forEach(c => {
      map[c.id] = c;
    });
    return map;
  }, [categories]);

  // Filter bills due within next 14 days (or slightly overdue)
  const upcomingList = React.useMemo(() => {
    return recurringRules
      .map(rule => {
        const dueDate = new Date(rule.nextDueDate);
        dueDate.setHours(0, 0, 0, 0);
        const diffMs = dueDate - today;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return {
          ...rule,
          diffDays,
          catMeta: categoryLookup[rule.category] || {
            label: rule.category,
            color: '#10b981',
            icon: 'Repeat'
          }
        };
      })
      .filter(item => item.diffDays <= 14 && item.amount < 0) // upcoming expense bills
      .sort((a, b) => a.diffDays - b.diffDays);
  }, [recurringRules, categoryLookup]);

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-500 flex items-center justify-center">
            <Clock size={17} />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Upcoming Bills
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Scheduled charges due within the next 14 days
            </p>
          </div>
        </div>

        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          {upcomingList.length} Pending
        </span>
      </div>

      {upcomingList.length === 0 ? (
        <div className="py-8 flex flex-col items-center justify-center text-center text-slate-400">
          <CheckCircle2 size={32} className="text-emerald-500/60 mb-2" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-300">All caught up!</p>
          <p className="text-xs mt-0.5">No recurring bills due in the next 14 days.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {upcomingList.map((bill) => {
            const isOverdue = bill.diffDays < 0;
            const isToday = bill.diffDays === 0;
            const isUrgent = bill.diffDays <= 3;

            return (
              <motion.div
                key={bill.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <CategoryIcon
                    name={bill.catMeta.icon}
                    color={bill.catMeta.color}
                    size="sm"
                  />
                  <div className="min-w-0">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {bill.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(bill.nextDueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.2 rounded-md ${
                          isOverdue
                            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/50'
                            : isToday
                            ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-bold border border-amber-200/50'
                            : isUrgent
                            ? 'bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400'
                            : 'bg-slate-200/60 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        {isOverdue
                          ? `${Math.abs(bill.diffDays)}d overdue`
                          : isToday
                          ? 'Due today'
                          : `Due in ${bill.diffDays} days`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                    £{Math.abs(bill.amount).toFixed(2)}
                  </span>
                  <button
                    onClick={() => onLogPayment && onLogPayment(bill)}
                    title="Log payment to ledger now"
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white dark:text-emerald-400 transition-all border border-emerald-500/20 flex items-center gap-1.5 active:scale-95"
                  >
                    <CheckCircle2 size={13} />
                    <span>Pay</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
