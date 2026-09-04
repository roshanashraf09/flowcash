import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  subscribeToStorage,
  getTransactions,
  saveTransaction,
  deleteTransactions,
  bulkRecategorize,
  getCategories,
  updateCategoryCap,
  getRecurringRules,
  saveRecurringRule,
  deleteRecurringRule,
  importTransactions
} from './storage';

import Navbar from './components/Navbar';
import MetricCards from './components/MetricCards';
import CashFlowChart from './components/CashFlowChart';
import CategoryDonutChart from './components/CategoryDonutChart';
import UpcomingBills from './components/UpcomingBills';
import TransactionLedger from './components/TransactionLedger';
import SpendingCaps from './components/SpendingCaps';
import RecurringTracker from './components/RecurringTracker';
import TransactionModal from './components/TransactionModal';
import StatementImportModal from './components/StatementImportModal';
import DataManagerModal from './components/DataManagerModal';

export default function FlowCash() {
  // Navigation & Theme
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'ledger' | 'caps' | 'recurring'
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('flowcash_theme') !== 'light';
    }
    return true;
  });

  // Core Data State
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recurringRules, setRecurringRules] = useState([]);

  // Modals
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDataManagerModalOpen, setIsDataManagerModalOpen] = useState(false);

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync theme to <html> class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('flowcash_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('flowcash_theme', 'light');
    }
  }, [darkMode]);

  // Load initial data
  const refreshData = useCallback(() => {
    setTransactions(getTransactions());
    setCategories(getCategories());
    setRecurringRules(getRecurringRules());
  }, []);

  useEffect(() => {
    refreshData();
    // Subscribe to storage persistence updates
    const unsubscribe = subscribeToStorage(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, [refreshData]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger when user is typing in an input or textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setEditingTx(null);
        setIsTxModalOpen(true);
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        setIsImportModalOpen(true);
      } else if (e.key === '1') {
        setActiveTab('dashboard');
      } else if (e.key === '2') {
        setActiveTab('ledger');
      } else if (e.key === '3') {
        setActiveTab('caps');
      } else if (e.key === '4') {
        setActiveTab('recurring');
      } else if (e.key === 'Escape') {
        setIsTxModalOpen(false);
        setIsImportModalOpen(false);
        setIsDataManagerModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for Transactions
  const handleSaveTransaction = async (tx) => {
    try {
      await saveTransaction(tx);
      showToast(tx.id ? 'Transaction updated successfully' : 'Transaction recorded successfully');
    } catch (err) {
      showToast(err.message || 'Failed to record transaction', 'error');
    }
  };

  const handleDeleteTransactions = async (ids) => {
    try {
      await deleteTransactions(ids);
      showToast(`Deleted ${ids.length} transaction${ids.length > 1 ? 's' : ''}`);
    } catch (err) {
      showToast('Failed to delete transactions', 'error');
    }
  };

  const handleBulkRecategorize = async (ids, newCategory) => {
    try {
      await bulkRecategorize(ids, newCategory);
      showToast(`Recategorized ${ids.length} transaction${ids.length > 1 ? 's' : ''}`);
    } catch (err) {
      showToast('Failed to recategorize transactions', 'error');
    }
  };

  // Handlers for Budget Caps
  const handleUpdateCategoryCap = async (categoryId, newCap) => {
    try {
      await updateCategoryCap(categoryId, newCap);
      showToast('Budget cap updated');
    } catch (err) {
      showToast('Failed to update cap', 'error');
    }
  };

  // Handlers for Recurring
  const handleSaveRecurringRule = async (rule) => {
    try {
      await saveRecurringRule(rule);
      showToast('Recurring subscription rule saved');
    } catch (err) {
      showToast('Failed to save subscription rule', 'error');
    }
  };

  const handleDeleteRecurringRule = async (ruleId) => {
    try {
      await deleteRecurringRule(ruleId);
      showToast('Subscription rule removed');
    } catch (err) {
      showToast('Failed to delete subscription rule', 'error');
    }
  };

  const handleLogUpcomingBill = async (bill) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      await saveTransaction({
        date: today,
        amount: bill.amount,
        category: bill.category,
        description: `${bill.title} (Scheduled)`,
        paymentMethod: 'Direct Debit',
        isRecurring: true,
        tags: ['subscription', 'autopay']
      });

      // Roll next due date forward by 1 month
      const curDue = new Date(bill.nextDueDate);
      curDue.setMonth(curDue.getMonth() + 1);
      const nextDueStr = curDue.toISOString().split('T')[0];
      await saveRecurringRule({
        ...bill,
        nextDueDate: nextDueStr
      });

      showToast(`Logged payment of £${Math.abs(bill.amount).toFixed(2)} for ${bill.title}`);
    } catch (err) {
      showToast('Failed to log payment', 'error');
    }
  };

  // Statement Import Completion
  const handleImportComplete = async (parsedRows) => {
    try {
      const result = await importTransactions(parsedRows);
      showToast(`Imported ${result.importedCount} transactions (${result.skippedDuplicates} duplicates skipped)`);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      showToast(err.message || 'Import failed', 'error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewTransaction={() => { setEditingTx(null); setIsTxModalOpen(true); }}
        onOpenImport={() => setIsImportModalOpen(true)}
        onOpenDataManager={() => setIsDataManagerModalOpen(true)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8 space-y-6">
        {/* Module A: Overview & Cash Flow Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Metric Cards */}
            <MetricCards transactions={transactions} />

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7">
                <CashFlowChart transactions={transactions} />
              </div>
              <div className="lg:col-span-5">
                <CategoryDonutChart transactions={transactions} categories={categories} />
              </div>
            </div>

            {/* Upcoming Bills & Quick Ledger preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-5">
                <UpcomingBills
                  recurringRules={recurringRules}
                  categories={categories}
                  onLogPayment={handleLogUpcomingBill}
                />
              </div>

              <div className="lg:col-span-7">
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        Recent Activity
                      </h3>
                      <p className="text-xs text-slate-400">
                        Latest settled transactions in your ledger
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveTab('ledger')}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      View Full Ledger →
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {transactions.slice(0, 5).map(t => (
                      <div key={t.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div className="min-w-0 pr-2">
                          <p className="font-semibold text-slate-900 dark:text-white truncate">
                            {t.description}
                          </p>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {t.date} • {t.category}
                          </span>
                        </div>
                        <span className={`font-mono font-bold whitespace-nowrap ${t.amount > 0 ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                          {t.amount > 0 ? '+' : ''}£{Math.abs(t.amount).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Module B: Transaction Ledger & Entry */}
        {activeTab === 'ledger' && (
          <TransactionLedger
            transactions={transactions}
            categories={categories}
            onEditTransaction={(tx) => { setEditingTx(tx); setIsTxModalOpen(true); }}
            onDeleteTransactions={handleDeleteTransactions}
            onBulkRecategorize={handleBulkRecategorize}
            onNewTransaction={() => { setEditingTx(null); setIsTxModalOpen(true); }}
          />
        )}

        {/* Module C: Spending Caps & Budget Enforcement */}
        {activeTab === 'caps' && (
          <SpendingCaps
            transactions={transactions}
            categories={categories}
            onUpdateCategoryCap={handleUpdateCategoryCap}
          />
        )}

        {/* Module D: Recurring Subscriptions Tracker */}
        {activeTab === 'recurring' && (
          <RecurringTracker
            recurringRules={recurringRules}
            categories={categories}
            onSaveRule={handleSaveRecurringRule}
            onDeleteRule={handleDeleteRecurringRule}
            onLogPayment={handleLogUpcomingBill}
          />
        )}
      </main>

      {/* Transaction Modal / Fast Entry Drawer */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSave={handleSaveTransaction}
        categories={categories}
        initialData={editingTx}
      />

      {/* Module E: Bank Statement Parser Modal */}
      <StatementImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={handleImportComplete}
        categories={categories}
      />

      {/* Module F: Privacy Vault & Backup Modal */}
      <DataManagerModal
        isOpen={isDataManagerModalOpen}
        onClose={() => setIsDataManagerModalOpen(false)}
        transactionsCount={transactions.length}
        recurringCount={recurringRules.length}
      />

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold border flex items-center gap-2 ${
            toast.type === 'error'
              ? 'bg-rose-500 text-white border-rose-600'
              : 'bg-emerald-600 text-white border-emerald-500'
          }`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
