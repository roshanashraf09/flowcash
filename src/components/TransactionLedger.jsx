import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Trash2,
  Edit2,
  DownloadCloud,
  ChevronDown,
  ChevronUp,
  Tag,
  CheckSquare,
  Square,
  Layers,
  ArrowUpDown,
  CreditCard,
  Banknote,
  ArrowLeftRight,
  Receipt,
  X,
  Plus
} from 'lucide-react';
import CategoryIcon from './CategoryIcon';

export default function TransactionLedger({
  transactions = [],
  categories = [],
  onEditTransaction,
  onDeleteTransactions,
  onBulkRecategorize,
  onNewTransaction,
}) {
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all'); // 'all' | 'income' | 'expense'
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');

  // Sorting
  const [sortBy, setSortBy] = useState('date'); // 'date' | 'amount' | 'description'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  // Batch selection
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [bulkCategoryTarget, setBulkCategoryTarget] = useState('');
  const [isRecategorizeOpen, setIsRecategorizeOpen] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 15;

  const categoryLookup = useMemo(() => {
    const map = {};
    categories.forEach(c => {
      map[c.id] = c;
    });
    return map;
  }, [categories]);

  // Filtering & Sorting
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      // Search query (payee, note, tags)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const descMatch = (t.description || '').toLowerCase().includes(q);
        const tagMatch = Array.isArray(t.tags) && t.tags.some(tag => tag.toLowerCase().includes(q));
        if (!descMatch && !tagMatch) return false;
      }

      // Type filter
      if (selectedType === 'income' && t.amount <= 0) return false;
      if (selectedType === 'expense' && t.amount >= 0) return false;

      // Category filter
      if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;

      // Payment method
      if (selectedPaymentMethod !== 'all' && t.paymentMethod !== selectedPaymentMethod) return false;

      // Date range
      if (dateFrom && t.date < dateFrom) return false;
      if (dateTo && t.date > dateTo) return false;

      return true;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'date') {
        comparison = new Date(b.date) - new Date(a.date);
      } else if (sortBy === 'amount') {
        comparison = Math.abs(b.amount) - Math.abs(a.amount);
      } else if (sortBy === 'description') {
        comparison = (a.description || '').localeCompare(b.description || '');
      }
      return sortOrder === 'asc' ? -comparison : comparison;
    });
  }, [
    transactions,
    searchQuery,
    selectedCategory,
    selectedType,
    selectedPaymentMethod,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder
  ]);

  // Paged transactions
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const pagedTransactions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredTransactions.slice(start, start + pageSize);
  }, [filteredTransactions, page, pageSize]);

  // Selection handlers
  const handleSelectAllOnPage = () => {
    const next = new Set(selectedIds);
    const allPageSelected = pagedTransactions.every(t => next.has(t.id));

    if (allPageSelected) {
      pagedTransactions.forEach(t => next.delete(t.id));
    } else {
      pagedTransactions.forEach(t => next.add(t.id));
    }
    setSelectedIds(next);
  };

  const handleToggleSelect = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedIds.size} transactions?`)) {
      onDeleteTransactions(Array.from(selectedIds));
      setSelectedIds(new Set());
    }
  };

  const handleApplyBulkRecategorize = () => {
    if (!bulkCategoryTarget || selectedIds.size === 0) return;
    onBulkRecategorize(Array.from(selectedIds), bulkCategoryTarget);
    setIsRecategorizeOpen(false);
    setSelectedIds(new Set());
  };

  // CSV Export
  const exportToCSV = () => {
    const listToExport = selectedIds.size > 0
      ? transactions.filter(t => selectedIds.has(t.id))
      : filteredTransactions;

    const headers = ['ID', 'Date', 'Amount', 'Category', 'Description', 'PaymentMethod', 'IsRecurring', 'Tags'];
    const rows = listToExport.map(t => [
      t.id,
      t.date,
      t.amount,
      t.category,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      t.paymentMethod,
      t.isRecurring ? 'Yes' : 'No',
      `"${(t.tags || []).join(', ')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flowcash_ledger_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter & Action Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
              placeholder="Search by payee, notes, or #tag..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={exportToCSV}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all flex items-center gap-1.5"
              title="Export visible or selected transactions to CSV"
            >
              <DownloadCloud size={14} />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onNewTransaction}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm hover:shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Plus size={15} />
              <span>Record</span>
            </button>
          </div>
        </div>

        {/* Multi-Filters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => { setSelectedType(e.target.value); setPage(1); }}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">Inflow & Outflow</option>
              <option value="income">Income (Inflows)</option>
              <option value="expense">Expenses (Outflows)</option>
            </select>
          </div>

          {/* Payment Method */}
          <div>
            <select
              value={selectedPaymentMethod}
              onChange={(e) => { setSelectedPaymentMethod(e.target.value); setPage(1); }}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none"
            >
              <option value="all">All Payment Methods</option>
              <option value="Card">Card</option>
              <option value="Cash">Cash</option>
              <option value="Transfer">Transfer</option>
              <option value="Direct Debit">Direct Debit</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none"
              placeholder="From date"
            />
          </div>

          {/* Date To */}
          <div>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
              className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none"
              placeholder="To date"
            />
          </div>
        </div>
      </div>

      {/* Batch Actions Bar (Renders when at least 1 row selected) */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {selectedIds.size} transactions selected
              </span>
              <button
                onClick={handleClearSelection}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 underline text-[11px]"
              >
                Clear
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Bulk Recategorize */}
              <div className="flex items-center gap-1.5">
                <select
                  value={bulkCategoryTarget}
                  onChange={(e) => setBulkCategoryTarget(e.target.value)}
                  className="px-2.5 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="">Choose category...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
                <button
                  onClick={handleApplyBulkRecategorize}
                  disabled={!bulkCategoryTarget}
                  className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg font-semibold transition-all"
                >
                  Apply
                </button>
              </div>

              {/* Bulk Delete */}
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500 text-rose-600 hover:text-white border border-rose-500/20 rounded-lg font-semibold transition-all flex items-center gap-1"
              >
                <Trash2 size={13} />
                <span>Delete Selected</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction Table */}
      <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-200/70 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-3.5 w-10 text-center">
                  <button
                    onClick={handleSelectAllOnPage}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {pagedTransactions.length > 0 && pagedTransactions.every(t => selectedIds.has(t.id)) ? (
                      <CheckSquare size={16} className="text-emerald-500" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                </th>
                <th
                  onClick={() => toggleSort('date')}
                  className="p-3.5 cursor-pointer hover:text-slate-900 dark:hover:text-white select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Date</span>
                    <ArrowUpDown size={12} className="opacity-60" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('description')}
                  className="p-3.5 cursor-pointer hover:text-slate-900 dark:hover:text-white select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>Description & Tags</span>
                    <ArrowUpDown size={12} className="opacity-60" />
                  </div>
                </th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Method</th>
                <th
                  onClick={() => toggleSort('amount')}
                  className="p-3.5 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white select-none"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Amount</span>
                    <ArrowUpDown size={12} className="opacity-60" />
                  </div>
                </th>
                <th className="p-3.5 text-right w-20">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {pagedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 dark:text-slate-500">
                    No transactions found matching the selected filters.
                  </td>
                </tr>
              ) : (
                pagedTransactions.map((tx) => {
                  const isSelected = selectedIds.has(tx.id);
                  const isIncome = tx.amount > 0;
                  const catMeta = categoryLookup[tx.category] || {
                    label: tx.category,
                    color: '#94a3b8',
                    icon: 'ShoppingBag'
                  };

                  return (
                    <tr
                      key={tx.id}
                      className={`transition-colors ${
                        isSelected
                          ? 'bg-emerald-50/50 dark:bg-emerald-950/20'
                          : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleToggleSelect(tx.id)}
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {isSelected ? (
                            <CheckSquare size={16} className="text-emerald-500" />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                      </td>

                      {/* Date */}
                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {tx.date}
                      </td>

                      {/* Description & Tags */}
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>{tx.description}</span>
                          {tx.isRecurring && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-500/10 text-purple-500 border border-purple-500/20 font-medium">
                              Recurring
                            </span>
                          )}
                        </div>
                        {Array.isArray(tx.tags) && tx.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {tx.tags.map(tag => (
                              <span
                                key={tag}
                                className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>

                      {/* Category Badge */}
                      <td className="p-3.5 whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <CategoryIcon name={catMeta.icon} color={catMeta.color} size="xs" />
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {catMeta.label}
                          </span>
                        </div>
                      </td>

                      {/* Payment Method */}
                      <td className="p-3.5 whitespace-nowrap text-slate-500 dark:text-slate-400 text-[11px]">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-medium">
                          {tx.paymentMethod || 'Card'}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="p-3.5 text-right font-mono whitespace-nowrap font-bold">
                        <span className={isIncome ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}>
                          {isIncome ? '+' : ''}£{Math.abs(tx.amount).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEditTransaction(tx)}
                            title="Edit transaction"
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => onDeleteTransactions([tx.id])}
                            title="Delete transaction"
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3.5 bg-slate-50/60 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>
            Showing {Math.min(filteredTransactions.length, (page - 1) * pageSize + 1)} - {Math.min(filteredTransactions.length, page * pageSize)} of {filteredTransactions.length} entries
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-white dark:hover:bg-slate-800"
            >
              Previous
            </button>
            <span className="px-2 font-mono">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-white dark:hover:bg-slate-800"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
