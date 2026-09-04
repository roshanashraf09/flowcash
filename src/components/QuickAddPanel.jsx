import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import FunCategoryIcon from './FunCategoryIcon';

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
    <aside className="w-72 xl:w-80 shrink-0 bg-white dark:bg-[#1C1C1E] border-l border-black/[0.06] dark:border-white/[0.08] py-5 px-4 xl:px-5 flex flex-col justify-between select-none h-full shadow-[inset_1px_0_0_rgba(0,0,0,0.02)]">
      <div className="flex flex-col h-full">
        {/* iOS Header */}
        <div className="mb-3">
          <h3 className="text-base font-bold text-[#1C1C1E] dark:text-white tracking-tight">
            Quick add
          </h3>
          <p className="text-[11px] text-[#8E8E93] font-medium">
            Pick a category, put in the amount, done.
          </p>
        </div>

        {/* iOS Native Segmented Control */}
        <div className="grid grid-cols-2 p-1 bg-[#E5E5EA] dark:bg-[#2C2C2E] rounded-xl text-xs font-semibold mb-3">
          <button
            type="button"
            onClick={() => setDirection('out')}
            className={`py-1.5 rounded-lg transition-all ${
              direction === 'out'
                ? 'bg-white dark:bg-[#636366] text-[#1C1C1E] dark:text-white shadow-[0_1px_4px_rgba(0,0,0,0.1)]'
                : 'text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white'
            }`}
          >
            Money out
          </button>
          <button
            type="button"
            onClick={() => setDirection('in')}
            className={`py-1.5 rounded-lg transition-all ${
              direction === 'in'
                ? 'bg-white dark:bg-[#636366] text-[#1C1C1E] dark:text-white shadow-[0_1px_4px_rgba(0,0,0,0.1)]'
                : 'text-[#8E8E93] hover:text-[#1C1C1E] dark:hover:text-white'
            }`}
          >
            Money in
          </button>
        </div>

        {/* Form with iOS Soft Inputs */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 text-xs">
          {/* What did you buy? */}
          <div className="mb-2.5">
            <label className="block text-[#1C1C1E] dark:text-slate-300 font-semibold mb-1">
              What did you buy?
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Weekly shop"
              className="w-full px-3.5 py-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] border border-transparent focus:border-[#007AFF]/40 focus:bg-white dark:focus:bg-[#1C1C1E] focus:ring-2 focus:ring-[#007AFF]/20 rounded-xl text-[#1C1C1E] dark:text-white placeholder:text-[#8E8E93] transition-all text-xs font-medium"
            />
          </div>

          {/* How much? */}
          <div className="mb-2.5">
            <label className="block text-[#1C1C1E] dark:text-slate-300 font-semibold mb-1">
              How much?
            </label>
            <input
              type="text"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="£0.00"
              required
              className="w-full px-3.5 py-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] border border-transparent focus:border-[#007AFF]/40 focus:bg-white dark:focus:bg-[#1C1C1E] focus:ring-2 focus:ring-[#007AFF]/20 rounded-xl text-[#1C1C1E] dark:text-white font-mono tabular-nums placeholder:text-[#8E8E93] font-bold text-xs transition-all"
            />
          </div>

          {/* Category — 2×6 grid, NO SCROLLING */}
          <div className="mb-2.5">
            <label className="block text-[#1C1C1E] dark:text-slate-300 font-semibold mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-2 border-[#34C759] bg-[#34C759]/10 dark:bg-[#34C759]/20 shadow-xs'
                        : 'border-black/[0.04] dark:border-white/[0.06] hover:border-black/[0.1] dark:hover:border-white/[0.15] bg-[#F9F9FB] dark:bg-[#2C2C2E]/60'
                    }`}
                  >
                    <FunCategoryIcon name={cat.id} />
                    <span className="text-[10px] font-semibold text-[#1C1C1E] dark:text-slate-300 mt-0.5 truncate max-w-full leading-tight">
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* When? */}
          <div className="mb-2">
            <label className="block text-[#1C1C1E] dark:text-slate-300 font-semibold mb-1">
              When?
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className="w-full px-3.5 py-2 bg-[#F2F2F7] dark:bg-[#2C2C2E] border border-transparent focus:border-[#007AFF]/40 focus:bg-white dark:focus:bg-[#1C1C1E] focus:ring-2 focus:ring-[#007AFF]/20 rounded-xl text-[#1C1C1E] dark:text-white font-mono text-xs transition-all font-medium"
            />
          </div>

          {/* iOS Primary Action Button */}
          <div className="mt-auto pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-[#007AFF] hover:bg-[#0071E3] text-white font-semibold text-xs shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
            >
              <Plus size={14} />
              <span>Save it</span>
            </button>
          </div>
        </form>
      </div>
    </aside>
  );
}
