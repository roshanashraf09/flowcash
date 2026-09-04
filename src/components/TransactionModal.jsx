import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Plus, Calendar, Tag, CreditCard, DollarSign, Calculator, AlertCircle } from 'lucide-react';
import CategoryIcon from './CategoryIcon';
import { PaymentMethods } from '../types';

export default function TransactionModal({
  isOpen,
  onClose,
  onSave,
  categories = [],
  initialData = null,
}) {
  const [type, setType] = useState('expense'); // 'expense' | 'income'
  const [amountInput, setAmountInput] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState(PaymentMethods.CARD);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [error, setError] = useState('');

  // Sync state when modal opens or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        const amt = Number(initialData.amount);
        setType(amt >= 0 ? 'income' : 'expense');
        setAmountInput(String(Math.abs(amt)));
        setDescription(initialData.description || '');
        setCategory(initialData.category || '');
        setDate(initialData.date || new Date().toISOString().split('T')[0]);
        setPaymentMethod(initialData.paymentMethod || PaymentMethods.CARD);
        setTags(Array.isArray(initialData.tags) ? [...initialData.tags] : []);
        setIsRecurring(!!initialData.isRecurring);
      } else {
        // Reset defaults
        setType('expense');
        setAmountInput('');
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
        setPaymentMethod(PaymentMethods.CARD);
        setTags([]);
        setIsRecurring(false);
        // Default category
        const firstExp = categories.find(c => c.type === 'expense');
        setCategory(firstExp ? firstExp.id : 'groceries');
      }
      setError('');
    }
  }, [isOpen, initialData, categories]);

  // Update category when switching between income and expense
  const handleTypeChange = (newType) => {
    setType(newType);
    const matching = categories.find(c => c.type === newType);
    if (matching) {
      setCategory(matching.id);
    }
  };

  // Evaluate simple math in amount (e.g. "12.50 + 4")
  const calculateAmount = (str) => {
    try {
      const sanitized = str.replace(/[^0-9.+\-*/() ]/g, '');
      if (!sanitized) return 0;
      // Use Function constructor instead of eval for safer evaluation
      const res = new Function(`return (${sanitized})`)();
      return typeof res === 'number' && !isNaN(res) ? Math.abs(res) : 0;
    } catch {
      const num = parseFloat(str);
      return !isNaN(num) ? Math.abs(num) : 0;
    }
  };

  const handleAddTag = (e) => {
    if ((e.key === 'Enter' || e.key === ',') && tagInput.trim()) {
      e.preventDefault();
      const cleanTag = tagInput.trim().replace(/^#/, '').toLowerCase();
      if (!tags.includes(cleanTag)) {
        setTags([...tags, cleanTag]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalAmount = calculateAmount(amountInput);

    if (!finalAmount || finalAmount <= 0) {
      setError('Please enter a valid amount greater than zero.');
      return;
    }
    if (!description.trim()) {
      setError('Please enter a description or payee name.');
      return;
    }

    const payload = {
      id: initialData?.id || undefined,
      date,
      amount: type === 'expense' ? -finalAmount : finalAmount,
      category,
      description: description.trim(),
      paymentMethod,
      isRecurring,
      tags,
    };

    onSave(payload);
    onClose();
  };

  if (!isOpen) return null;

  const filteredCategories = categories.filter(c => c.type === type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {initialData ? 'Edit Transaction' : 'Record Transaction'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              FlowCash local-first ledger entry
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/40 text-xs flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Inflow / Outflow Toggle */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`py-2 rounded-xl text-sm font-semibold transition-all ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Expense (Outflow)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`py-2 rounded-xl text-sm font-semibold transition-all ${
                type === 'income'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Income (Inflow)
            </button>
          </div>

          {/* Amount Input with Currency Symbol */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Amount (£)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-2xl font-bold text-slate-400 dark:text-slate-500">
                £
              </span>
              <input
                type="text"
                value={amountInput}
                onChange={(e) => setAmountInput(e.target.value)}
                placeholder="0.00"
                autoFocus
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-2xl text-2xl font-bold font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all placeholder:text-slate-400"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Tip: You can type expressions like 15.50 + 4.20
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Description / Payee
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Tesco Groceries, Client Retainer, Coffee"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Quick Category Selection Pills */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto pr-1 py-1">
              {filteredCategories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-xs'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                    }`}
                  >
                    <CategoryIcon name={cat.icon} color={cat.color} size="xs" badge={false} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Payment Method Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              >
                <option value={PaymentMethods.CARD}>Card</option>
                <option value={PaymentMethods.CASH}>Cash</option>
                <option value={PaymentMethods.TRANSFER}>Transfer</option>
                <option value={PaymentMethods.DIRECT_DEBIT}>Direct Debit</option>
              </select>
            </div>
          </div>

          {/* Tags Chips Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
              Tags (Press Enter to add)
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl min-h-[42px]">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-rose-500"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder={tags.length === 0 ? 'Type tag and hit Enter (e.g. food, trip)...' : ''}
                className="flex-1 bg-transparent text-xs text-slate-900 dark:text-white focus:outline-none min-w-[120px]"
              />
            </div>
          </div>

          {/* Recurring commitment toggle */}
          <div className="flex items-center gap-3 pt-1">
            <input
              type="checkbox"
              id="isRecurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-500 border-slate-300 focus:ring-emerald-500"
            />
            <label htmlFor="isRecurring" className="text-xs font-medium text-slate-700 dark:text-slate-300 select-none cursor-pointer">
              Mark as Recurring Commitment (Subscription / Scheduled)
            </label>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-sm hover:shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <Check size={15} />
              <span>{initialData ? 'Save Changes' : 'Record Transaction'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
