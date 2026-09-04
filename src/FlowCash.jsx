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
import OnboardingScreen from './components/OnboardingScreen';
import { Folder, Check, Copy, RotateCcw, Trash2, HardDrive, Lock } from 'lucide-react';

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
  subscribeToStorage,
  getPreferences,
  savePreferences,
  setStorageFolder,
  wipeAllData,
  isTauri
} from './storage';

export default function FlowCash() {
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'history' | 'trends' | 'plan' | 'settings'
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('flowcash_theme') === 'dark';
    }
    return false;
  });

  const [preferences, setPreferences] = useState(getPreferences());
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => !getPreferences().hasSeenIntro);
  const [customFolder, setCustomFolder] = useState(() => getPreferences().storageFolder || 'C:\\Users\\rosha\\Documents\\FlowCash\\Vault');
  const [folderFeedback, setFolderFeedback] = useState('');

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
    const pref = getPreferences();
    setPreferences(pref);
    setCustomFolder(pref.storageFolder);
    if (!pref.hasSeenIntro) {
      setIsOnboardingOpen(true);
    }
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

  // Folder browser for Settings
  const handlePickSettingsFolder = async () => {
    try {
      if (isTauri() && window.__TAURI__?.dialog) {
        const selected = await window.__TAURI__.dialog.open({
          directory: true,
          multiple: false,
          title: 'Select FlowCash Storage Vault Folder'
        });
        if (selected) {
          setCustomFolder(selected);
          await setStorageFolder(selected);
          setFolderFeedback('Folder updated successfully!');
          setTimeout(() => setFolderFeedback(''), 3000);
        }
      } else if (typeof window !== 'undefined' && 'showDirectoryPicker' in window) {
        const dirHandle = await window.showDirectoryPicker();
        if (dirHandle && dirHandle.name) {
          const path = `Local Directory: /${dirHandle.name}`;
          setCustomFolder(path);
          await setStorageFolder(path);
          setFolderFeedback('Folder updated successfully!');
          setTimeout(() => setFolderFeedback(''), 3000);
        }
      } else {
        const manual = window.prompt('Enter local folder path for FlowCash data vault:', customFolder);
        if (manual && manual.trim()) {
          setCustomFolder(manual.trim());
          await setStorageFolder(manual.trim());
          setFolderFeedback('Folder updated successfully!');
          setTimeout(() => setFolderFeedback(''), 3000);
        }
      }
    } catch (err) {
      console.log('Directory selection dismissed:', err);
    }
  };

  const handleSaveCustomFolder = async () => {
    if (!customFolder.trim()) return;
    await setStorageFolder(customFolder.trim());
    setFolderFeedback('Folder location saved!');
    setTimeout(() => setFolderFeedback(''), 3000);
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
              userName={preferences.userName || 'Roshan'}
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
            <div className="space-y-5 h-full overflow-y-auto pr-1 max-w-2xl">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Settings
                </h2>
                <p className="text-xs text-slate-400">
                  Manage theme, local storage folder, and privacy backups
                </p>
              </div>

              {/* 1. Appearance */}
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

              {/* 2. User Profile & Currency */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Profile & Currency
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={preferences.userName || 'Roshan'}
                      onChange={async (e) => {
                        const updated = await savePreferences({ userName: e.target.value });
                        setPreferences(updated);
                      }}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                      Currency Symbol
                    </label>
                    <div className="flex gap-2">
                      {['£', '$', '€', '₹'].map((sym) => (
                        <button
                          key={sym}
                          type="button"
                          onClick={async () => {
                            const updated = await savePreferences({ currencySymbol: sym });
                            setPreferences(updated);
                          }}
                          className={`flex-1 py-2 rounded-xl border font-bold ${
                            preferences.currencySymbol === sym
                              ? 'border-2 border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 shadow-xs'
                              : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {sym}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Local Storage Directory / Vault Folder */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Folder size={18} className="text-amber-500" />
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Local Storage Folder & Vault Location
                    </h4>
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1">
                    <Lock size={10} />
                    <span>Offline Only</span>
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Choose the local directory on this device where FlowCash saves your encrypted JSON ledger, category configurations, and recurring bill rules.
                </p>

                {/* Directory Input & Browse Action */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={customFolder}
                        onChange={(e) => setCustomFolder(e.target.value)}
                        placeholder="e.g. C:\Users\rosha\Documents\FlowCash\Vault"
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 font-semibold"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handlePickSettingsFolder}
                      className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shrink-0 flex items-center gap-1.5"
                    >
                      <Folder size={14} className="text-amber-500" />
                      <span>Browse...</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleSaveCustomFolder}
                        className="px-3 py-1.5 rounded-lg bg-[#1D70F7] hover:bg-[#155FD6] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1"
                      >
                        <Check size={13} />
                        <span>Save Location</span>
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const defaultPath = 'C:\\Users\\rosha\\Documents\\FlowCash\\Vault';
                          setCustomFolder(defaultPath);
                          await setStorageFolder(defaultPath);
                          setFolderFeedback('Reset to default vault directory!');
                          setTimeout(() => setFolderFeedback(''), 3000);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold transition-all"
                      >
                        Default Path
                      </button>
                    </div>

                    {folderFeedback && (
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-pulse">
                        <Check size={13} />
                        <span>{folderFeedback}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 4. Local Data, Backups & Reset */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Local Data Vault & Onboarding
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Export backups or reset data. Wiping records will immediately take you through the welcoming setup onboarding screen.
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
                  <button
                    onClick={() => setIsOnboardingOpen(true)}
                    className="px-4 py-2 rounded-xl border border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/30"
                  >
                    Open Onboarding Tour
                  </button>
                  <button
                    onClick={async () => {
                      if (window.confirm('Wipe all transaction records and restart the Onboarding setup?')) {
                        await wipeAllData(true);
                        setIsOnboardingOpen(true);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Trash2 size={13} />
                    <span>Wipe Data & Reset</span>
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

      {/* Onboarding Screen */}
      <OnboardingScreen
        isOpen={isOnboardingOpen}
        onComplete={() => {
          setIsOnboardingOpen(false);
          refreshData();
        }}
        initialPreferences={preferences}
      />
    </div>
  );
}
