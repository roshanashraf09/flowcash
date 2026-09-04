import React, { useState } from 'react';
import { Calendar, Plus, Check } from 'lucide-react';
import FunCategoryIcon, { FUN_ICONS } from './FunCategoryIcon';

export default function QuickAddPanel({ onSaveExpense }) {
  const [direction, setDirection] = useState('out'); // 'out' (Money out) | 'in' (Money in)
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('groceries');
  const [date, setDate] = useState('2026-09-04');

  const categories = [
    { id: 'groceries', label: 'Groceries' },
    { id: 'eating_out', label: 'Eating out' },
    { id: 'transport', label: 'Transport' },
    { id: 'rent', label: 'Rent' },
    { id: 'utilities', label: 'Utilities' },
    { id: 'subscriptions', label: 'Subscriptions' },
    { id: 'other', label: 'Other' },
    { id: 'coffee', label: 'Coffee' },
    { id: 'home', label: 'Home' },
    { id: 'phone', label: 'Phone' },
    { id: 'gym', label: 'Gym' },
    { id: 'travel', label: 'Travel' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount) return;

    const num = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (isNaN(num) || num <= 0) return;

    onSaveExpense({
      title: title.trim() || categories.find(c => c.id === selectedCategory)?.label || 'Expense',
      amount: direction === 'out' ? -num : num,
      category: selectedCategory,
      date,
    });

    setTitle('');
    setAmount('');
  };

  return (
    <aside className="w-80 shrink-0 bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200/80 dark:border-slate-800 shadow-sm p-5 flex flex-col justify-between select-none h-full overflow-y-auto">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            Quick add
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            Pick a category, put in the amount, done.
          </p>
        </div>

        {/* Money Out vs Money In Segmented Control */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setDirection('out')}
            className={`py-1.5 rounded-lg transition-all ${
              direction === 'out'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Money out
          </button>
          <button
            type="button"
            onClick={() => setDirection('in')}
            className={`py-1.5 rounded-lg transition-all ${
              direction === 'in'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Money in
          </button>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* What did you buy? */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              What did you buy?
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Weekly shop"
              className="w-full px-3.5 py-2.5 bg-slate-50/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {/* How much? */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              How much?
            </label>
            <input
              type="text"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="£0.00"
              required
              className="w-full px-3.5 py-2.5 bg-slate-50/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-bold"
            />
          </div>

          {/* Category 2x6 Grid */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-2 border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20 shadow-xs'
                        : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-slate-50/40 dark:bg-slate-800/30'
                    }`}
                  >
                    <FunCategoryIcon name={cat.id} />
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-1 truncate max-w-full">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* When? */}
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">
              When?
            </label>
            <div className="relative">
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-mono text-xs"
              />
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#1D70F7] hover:bg-[#155FD6] text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus size={15} />
              <span>Save it</span>
            </button>
          </div>
        </form>
      </div>
    </aside>
  );
}
