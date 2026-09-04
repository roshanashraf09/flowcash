import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import Sidebar from './components/Sidebar';
import CenterDashboard from './components/CenterDashboard';
import QuickAddPanel from './components/QuickAddPanel';
import TransactionLedger from './components/TransactionLedger';
import SpendingCaps from './components/SpendingCaps';
import CashFlowChart from './components/CashFlowChart';
import CategoryDonutChart from './components/CategoryDonutChart';
import RecurringTracker from './components/RecurringTracker';
import StatementImportModal from './components/StatementImportModal';
import DataManagerModal from './components/DataManagerModal';

import {
  getTransactions,
  saveTransaction,
  deleteTransactions,
  bulkRecategorize,
  getCategories,
  updateCategoryCap,
  getRecurringRules,
  saveRecurringRule,
  deleteRecurringRule,
  subscribeToStorage
} from './storage';

export default function FlowCash() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'history' | 'trends' | 'plan' | 'settings'
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('flowcash_theme') === 'dark';
    }
    return false;
  });

  const [transactions, setTransactions] = useState(getTransactions());
  const [categories, setCategories] = useState(getCategories());
  const [recurringRules, setRecurringRules] = useState(getRecurringRules());
  const [scheduledRecorded, setScheduledRecorded] = useState(false);

  // Modals for Import & Backup
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDataManagerOpen, setIsDataManagerOpen] = useState(false);

  // Sync theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('flowcash_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('flowcash_theme', 'light');
    }
  }, [darkMode]);

  // Reactive data sync
  const refreshData = useCallback(() => {
    setTransactions(getTransactions());
    setCategories(getCategories());
    setRecurringRules(getRecurringRules());
  }, []);

  useEffect(() => {
    refreshData();
    const unsub = subscribeToStorage(() => refreshData());
    return () => unsub();
  }, [refreshData]);

  // Handle Quick Add Expense
  const handleSaveExpense = async (expense) => {
    await saveTransaction({
      date: expense.date,
      amount: expense.amount,
      category: expense.category,
      description: expense.title,
      paymentMethod: 'Card',
      isRecurring: false,
      tags: [expense.category]
    });

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  // One-click record scheduled rent payment
  const handleRecordScheduledPayment = async () => {
    const today = new Date().toISOString().split('T')[0];
    await saveTransaction({
      date: today,
      amount: -950.00,
      category: 'rent',
      description: 'Residential Rent (Scheduled)',
      paymentMethod: 'Direct Debit',
      isRecurring: true,
      tags: ['rent', 'fixed']
    });
    setScheduledRecorded(true);
    confetti({ particleCount: 40, spread: 50 });
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#EEF4FB] dark:bg-[#0B132B] text-slate-900 dark:text-slate-100 flex font-sans select-none">
      {/* 
        Full-screen Desktop App Frame:
        Layout fills the entire viewport and maintains stable structure across all page switches.
        Never expands or shrinks between pages!
      */}
      <div className="w-full h-full bg-white dark:bg-[#111A33] flex overflow-hidden">
        
        {/* Left Column: Fixed Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        {/* Center Column: Stable Workspace Container (Never shrinks or jumps) */}
        <main className="flex-1 min-w-0 h-full px-6 xl:px-8 py-6 border-l border-slate-100 dark:border-slate-800/80 overflow-hidden flex flex-col justify-between">
          {/* Dashboard View */}
          {activeTab === 'dashboard' && (
            <CenterDashboard
              transactions={transactions}
              onOpenQuickAdd={() => {}}
              onRecordScheduledPayment={handleRecordScheduledPayment}
              scheduledRecorded={scheduledRecorded}
            />
          )}

          {/* History / Transactions View */}
          {activeTab === 'history' && (
            <div className="space-y-4 h-full overflow-y-auto pr-1 flex flex-col">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    History
                  </h2>
                  <p className="text-xs text-slate-400">
                    All settled transactions recorded on this device
                  </p>
                </div>
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#1D70F7] hover:bg-[#155FD6] text-white text-xs font-bold shadow-sm transition-all"
                >
                  Import Bank CSV
                </button>
              </div>

              <div className="flex-1 min-h-0">
                <TransactionLedger
                  transactions={transactions}
                  categories={categories}
                  onEditTransaction={() => {}}
                  onDeleteTransactions={deleteTransactions}
                  onBulkRecategorize={bulkRecategorize}
                  onNewTransaction={() => {}}
                />
              </div>
            </div>
          )}

          {/* Trends / Reports View */}
          {activeTab === 'trends' && (
            <div className="space-y-4 h-full overflow-y-auto pr-1">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Trends & Reports
                </h2>
                <p className="text-xs text-slate-400">
                  Cash-flow dynamics and category breakdown
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="min-h-[300px]">
                  <CashFlowChart transactions={transactions} />
                </div>
                <div className="min-h-[300px]">
                  <CategoryDonutChart transactions={transactions} categories={categories} />
                </div>
              </div>
            </div>
          )}

          {/* Plan / Budgets View */}
          {activeTab === 'plan' && (
            <div className="space-y-4 h-full overflow-y-auto pr-1">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Spending Caps & Plan
                </h2>
                <p className="text-xs text-slate-400">
                  Monthly envelopes, budget limits, and recurring commitments
                </p>
              </div>

              <SpendingCaps
                transactions={transactions}
                categories={categories}
                onUpdateCategoryCap={updateCategoryCap}
              />
            </div>
          )}

          {/* Settings View */}
          {activeTab === 'settings' && (
            <div className="space-y-5 h-full overflow-y-auto pr-1 max-w-xl">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Settings
                </h2>
                <p className="text-xs text-slate-400">
                  Manage theme, local storage folder, and privacy backups
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Appearance
                </h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Theme Mode</span>
                  <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                    <button
                      onClick={() => setDarkMode(false)}
                      className={`px-3 py-1 rounded-lg font-semibold ${!darkMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400'}`}
                    >
                      Light
                    </button>
                    <button
                      onClick={() => setDarkMode(true)}
                      className={`px-3 py-1 rounded-lg font-semibold ${darkMode ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400'}`}
                    >
                      Dark
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Local Data & Backups
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  All your data stays 100% on this computer. You can export a full formatted JSON backup or import existing statements.
                </p>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  <button
                    onClick={() => setIsDataManagerOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#1D70F7] hover:bg-[#155FD6] text-white text-xs font-bold shadow-sm transition-all"
                  >
                    Manage Local Vault
                  </button>
                  <button
                    onClick={() => setIsImportModalOpen(true)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Import Statements
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Right Column: Fixed "Quick add" Panel */}
        <QuickAddPanel onSaveExpense={handleSaveExpense} />
      </div>

      {/* Statement Import Modal */}
      <StatementImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={() => refreshData()}
        categories={categories}
      />

      {/* Data Manager Modal */}
      <DataManagerModal
        isOpen={isDataManagerOpen}
        onClose={() => setIsDataManagerOpen(false)}
        transactionsCount={transactions.length}
        recurringCount={recurringRules.length}
      />
    </div>
  );
}
