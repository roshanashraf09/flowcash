import React, { useState } from 'react';
import { Calendar, Plus, ChevronDown, Check, Sparkles } from 'lucide-react';

export default function QuickAddExpenseCard({ onAddExpense }) {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = ['Food', 'Entertainment', 'Transportation', 'Utilities', 'Shopping', 'Coffee'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !amount) return;

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;

    onAddExpense({
      title: name.trim(),
      amount: numAmount,
      category,
      date,
    });

    // Reset fields
    setName('');
    setAmount('');
  };

  return (
    <div className="rounded-[30px] bg-[#18181c] p-6 shadow-xl border border-slate-800/80 text-white flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-white tracking-tight">
          Quick Add Expense
        </h3>
        <Sparkles size={16} className="text-purple-400" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5 flex-1 flex flex-col justify-between">
        {/* Expense Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            Expense Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Food"
            required
            className="w-full px-4 py-2.5 bg-[#232328] border border-slate-700/60 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="$ 0.00"
              required
              className="w-full px-4 py-2.5 bg-[#232328] border border-slate-700/60 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors font-mono"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            Category
          </label>
          <div className="relative">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#232328] border border-slate-700/60 rounded-2xl text-xs text-white appearance-none focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
            >
              {categories.map(c => (
                <option key={c} value={c} className="bg-[#18181c] text-white">
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-[#232328] border border-slate-700/60 rounded-2xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-white hover:bg-slate-100 text-[#18181c] text-xs font-extrabold shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 group"
          >
            <Plus size={14} className="group-hover:rotate-90 transition-transform" />
            <span>+ Add Expense</span>
          </button>
        </div>
      </form>
    </div>
  );
}
