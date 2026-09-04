import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Repeat,
  Plus,
  Calendar as CalendarIcon,
  Trash2,
  Clock,
  CheckCircle2,
  TrendingDown,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Info
} from 'lucide-react';
import CategoryIcon from './CategoryIcon';

export default function RecurringTracker({
  recurringRules = [],
  categories = [],
  onSaveRule,
  onDeleteRule,
  onLogPayment,
}) {
  const [activeTab, setActiveTab] = useState('list'); // 'list' | 'calendar'
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());

  // New rule form state
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState(categories[0]?.id || 'entertainment');
  const [newFrequency, setNewFrequency] = useState('monthly');
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [newAutoLog, setNewAutoLog] = useState(true);

  const categoryLookup = useMemo(() => {
    const map = {};
    categories.forEach(c => {
      map[c.id] = c;
    });
    return map;
  }, [categories]);

  // Normalized monthly and annual projections
  const projections = useMemo(() => {
    let monthlyExpenses = 0;
    let monthlyIncome = 0;

    recurringRules.forEach(rule => {
      const amt = Number(rule.amount);
      let normalizedMonthly = 0;

      if (rule.frequency === 'weekly') {
        normalizedMonthly = (amt * 52) / 12;
      } else if (rule.frequency === 'yearly') {
        normalizedMonthly = amt / 12;
      } else {
        // default monthly
        normalizedMonthly = amt;
      }

      if (amt < 0) {
        monthlyExpenses += Math.abs(normalizedMonthly);
      } else {
        monthlyIncome += normalizedMonthly;
      }
    });

    const annualExpenses = monthlyExpenses * 12;
    const annualIncome = monthlyIncome * 12;

    return {
      monthlyExpenses,
      annualExpenses,
      monthlyIncome,
      annualIncome,
      netMonthly: monthlyIncome - monthlyExpenses,
    };
  }, [recurringRules]);

  // Calendar calculations
  const calendarDays = useMemo(() => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Days in current month
    const totalDays = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

    const days = [];

    // Pad previous month days
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push({ isCurrentMonth: false, dayNumber: '' });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      // Check which rules fall on this day of month
      const matchingRules = recurringRules.filter(r => {
        // If nextDueDate falls on this day, or same day of month
        const ruleDay = parseInt(r.nextDueDate.split('-')[2]);
        return ruleDay === d;
      });

      days.push({
        isCurrentMonth: true,
        dayNumber: d,
        dateStr,
        rules: matchingRules,
        isToday: new Date().toISOString().split('T')[0] === dateStr,
      });
    }

    return days;
  }, [calendarDate, recurringRules]);

  const handleCreateRule = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount) return;

    const amt = parseFloat(newAmount);
    onSaveRule({
      title: newTitle.trim(),
      amount: -Math.abs(amt), // default expense
      category: newCategory,
      frequency: newFrequency,
      nextDueDate: newDueDate,
      autoLog: newAutoLog,
    });

    setIsAddingRule(false);
    setNewTitle('');
    setNewAmount('');
  };

  return (
    <div className="space-y-6">
      {/* Top Metric Cards: Projections */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Monthly Commitment
          </span>
          <div className="text-2xl font-bold font-mono text-rose-500 mt-1">
            -£{projections.monthlyExpenses.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Normalized monthly recurring outflow
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Annual Commitment
          </span>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-1">
            £{projections.annualExpenses.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            12-month projected subscription burden
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Recurring Inflow
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-500 mt-1">
            +£{projections.monthlyIncome.toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Salaries & recurring contracts
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
            Active Subscriptions
          </span>
          <div className="text-2xl font-bold font-mono text-indigo-500 mt-1">
            {recurringRules.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Tracked recurring agreements
          </span>
        </div>
      </div>

      {/* Action Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium self-start">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'list'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Subscriptions List
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeTab === 'calendar'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Due Dates Calendar
          </button>
        </div>

        <button
          onClick={() => setIsAddingRule(true)}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm hover:shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={15} />
          <span>New Subscription</span>
        </button>
      </div>

      {/* Add Subscription Drawer / Inline Form */}
      {isAddingRule && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          onSubmit={handleCreateRule}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-500/40 shadow-md space-y-4"
        >
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Add New Recurring Rule
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="e.g. Netflix 4K"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Amount (£)</label>
              <input
                type="number"
                step="0.01"
                value={newAmount}
                onChange={e => setNewAmount(e.target.value)}
                placeholder="15.99"
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Frequency</label>
              <select
                value={newFrequency}
                onChange={e => setNewFrequency(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              >
                <option value="monthly">Monthly</option>
                <option value="weekly">Weekly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Next Due Date</label>
              <input
                type="date"
                value={newDueDate}
                onChange={e => setNewDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ruleAutoLog"
                checked={newAutoLog}
                onChange={e => setNewAutoLog(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500"
              />
              <label htmlFor="ruleAutoLog" className="text-xs text-slate-600 dark:text-slate-300">
                Auto-log transaction on due date
              </label>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsAddingRule(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold"
              >
                Save Subscription
              </button>
            </div>
          </div>
        </motion.form>
      )}

      {/* Main Tab Content */}
      {activeTab === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recurringRules.map(rule => {
            const catMeta = categoryLookup[rule.category] || {
              label: rule.category,
              color: '#10b981',
              icon: 'Repeat'
            };
            const isIncome = rule.amount > 0;

            return (
              <div
                key={rule.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <CategoryIcon name={catMeta.icon} color={catMeta.color} size="md" />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {rule.title}
                      </h4>
                      <span className="text-xs text-slate-400 capitalize">
                        {rule.frequency} recurrence
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteRule(rule.id)}
                    className="p-1 text-slate-400 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete subscription rule"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="my-4 flex items-baseline justify-between font-mono">
                  <span className={`text-xl font-bold ${isIncome ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                    {isIncome ? '+' : ''}£{Math.abs(rule.amount).toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400">
                    Next: {new Date(rule.nextDueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400">
                    Annual: £{(Math.abs(rule.amount) * (rule.frequency === 'yearly' ? 1 : 12)).toFixed(2)}
                  </span>
                  <button
                    onClick={() => onLogPayment(rule)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white transition-all flex items-center gap-1"
                  >
                    <CheckCircle2 size={12} />
                    <span>Log Now</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Calendar Due Dates View */
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {calendarDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </h4>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => setCalendarDate(new Date())}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Today
              </button>
              <button
                onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))}
                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-slate-400 mb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((d, idx) => (
              <div
                key={idx}
                className={`min-h-[80px] p-1.5 rounded-xl border transition-all flex flex-col justify-between ${
                  !d.isCurrentMonth
                    ? 'bg-transparent border-transparent text-slate-300 dark:text-slate-700'
                    : d.isToday
                    ? 'bg-emerald-500/5 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 font-bold'
                    : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800/80 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-[11px] self-end">{d.dayNumber}</span>
                {d.rules && d.rules.length > 0 && (
                  <div className="space-y-1 mt-1">
                    {d.rules.map(r => (
                      <div
                        key={r.id}
                        className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium truncate flex items-center justify-between"
                        title={`${r.title}: £${Math.abs(r.amount).toFixed(2)}`}
                      >
                        <span className="truncate">{r.title}</span>
                        <span className="font-mono">£{Math.abs(r.amount).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
