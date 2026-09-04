import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Film, Car, Zap, UtensilsCrossed, ShoppingBag, Coffee, Plus, Check } from 'lucide-react';

import { getCurrentUser, subscribeToAuth, logoutGoogle } from './auth';
import Sidebar from './components/Sidebar';
import TopHeader from './components/TopHeader';
import HeroStatsCard from './components/HeroStatsCard';
import RecentTransactionsCard from './components/RecentTransactionsCard';
import QuickAddExpenseCard from './components/QuickAddExpenseCard';
import ReportsCard from './components/ReportsCard';
import SpendingDonutCard from './components/SpendingDonutCard';
import GoogleAuthModal from './components/GoogleAuthModal';
import PremiumModal from './components/PremiumModal';
import AddExpenseModal from './components/AddExpenseModal';
import TransactionLedger from './components/TransactionLedger';
import SpendingCaps from './components/SpendingCaps';
import StatementImportModal from './components/StatementImportModal';
import DataManagerModal from './components/DataManagerModal';
import { getTransactions, saveTransaction, deleteTransactions, bulkRecategorize, getCategories, updateCategoryCap } from './storage';

export default function FlowCash() {
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'transactions' | 'reports' | 'budgets' | 'settings'

  // Modals
  const [isGoogleAuthOpen, setIsGoogleAuthOpen] = useState(false);
  const [isPremiumOpen, setIsPremiumOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isDataManagerOpen, setIsDataManagerOpen] = useState(false);

  // Financial Stats (Matching Reference Image)
  const [stats, setStats] = useState({
    outcome: 2500,
    income: 5500,
  });

  // Recent Transactions (Matching Reference Image)
  const [recentItems, setRecentItems] = useState([
    { id: 1, title: 'Entertainment', date: '01 Jun, 11.30am', percent: 50, color: '#8b5cf6', icon: Film, amount: 1250 },
    { id: 2, title: 'Transportation', date: '01 Jun, 11.30am', percent: 25, color: '#06b6d4', icon: Car, amount: 625 },
    { id: 3, title: 'Utilities', date: '01 Jun, 11.30am', percent: 15, color: '#f59e0b', icon: Zap, amount: 375 },
    { id: 4, title: 'Food', date: '01 Jun, 11.30am', percent: 15, color: '#10b981', icon: UtensilsCrossed, amount: 375 },
  ]);

  // Donut Breakdown (Matching Reference Image)
  const [donutItems, setDonutItems] = useState([
    { title: 'Entertainment', amount: 1250, color: '#8b5cf6' },
    { title: 'Transportation', amount: 625, color: '#06b6d4' },
    { title: 'Utilities', amount: 375, color: '#f59e0b' },
    { title: 'Food', amount: 375, color: '#10b981' },
  ]);

  // Ledger storage connection
  const [allTransactions, setAllTransactions] = useState(getTransactions());
  const [categories, setCategories] = useState(getCategories());

  // Listen to auth changes
  useEffect(() => {
    const unsub = subscribeToAuth((user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  // Handle adding an expense
  const handleAddExpense = (expense) => {
    // 1. Update stats outcome
    setStats(prev => ({
      ...prev,
      outcome: prev.outcome + expense.amount,
    }));

    // 2. Persist to ledger storage
    saveTransaction({
      date: expense.date,
      amount: -Math.abs(expense.amount),
      category: expense.category.toLowerCase(),
      description: expense.title,
      paymentMethod: 'Card',
      isRecurring: false,
      tags: [expense.category.toLowerCase()]
    });
    setAllTransactions(getTransactions());

    // 3. Update donut items
    setDonutItems(prev => {
      const idx = prev.findIndex(item => item.title.toLowerCase() === expense.category.toLowerCase());
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], amount: updated[idx].amount + expense.amount };
        return updated;
      }
      return [...prev, { title: expense.category, amount: expense.amount, color: '#ec4899' }];
    });

    // 4. Update recent items
    setRecentItems(prev => {
      const now = new Date();
      const dateFormatted = `${String(now.getDate()).padStart(2, '0')} ${now.toLocaleDateString('en-US', { month: 'short' })}, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      return [
        {
          id: Date.now(),
          title: expense.title,
          date: dateFormatted,
          percent: 20,
          color: expense.category === 'Food' ? '#10b981' : expense.category === 'Transportation' ? '#06b6d4' : '#8b5cf6',
          icon: expense.category === 'Food' ? UtensilsCrossed : expense.category === 'Transportation' ? Car : Film,
          amount: expense.amount
        },
        ...prev.slice(0, 3)
      ];
    });

    // Confetti micro-celebration
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleLogout = () => {
    logoutGoogle();
    setIsGoogleAuthOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F0F1F5] dark:bg-[#0c0c10] text-slate-900 dark:text-slate-100 flex items-center justify-center p-3 sm:p-6 lg:p-8 font-sans selection:bg-purple-500/20 selection:text-purple-600">
      {/* Main Canvas Container (matches the rounded card UI in the screenshot) */}
      <div className="w-full max-w-[1380px] bg-white dark:bg-[#121216] rounded-[36px] shadow-2xl shadow-slate-300/50 dark:shadow-black/60 border border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row overflow-hidden transition-all duration-300">
        
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenPremium={() => setIsPremiumOpen(true)}
        />

        {/* Right Main Content Area */}
        <main className="flex-1 p-6 lg:p-8 space-y-6 overflow-y-auto max-h-[92vh]">
          {/* Top Header */}
          <TopHeader
            currentUser={currentUser}
            onOpenAddExpense={() => setIsAddExpenseOpen(true)}
            onOpenGoogleAuth={() => setIsGoogleAuthOpen(true)}
            onLogout={handleLogout}
          />

          {/* Tab Content */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Row 1: Dark Hero Statistics Banner */}
              <HeroStatsCard
                currentUser={currentUser}
                outcome={stats.outcome}
                income={stats.income}
              />

              {/* Row 2: Four Key Modules Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Center Left: Recent Transactions (5 cols) */}
                <div className="lg:col-span-4">
                  <RecentTransactionsCard items={recentItems} />
                </div>

                {/* Center Middle: Quick Add Expense Dark Card (4 cols) */}
                <div className="lg:col-span-4">
                  <QuickAddExpenseCard onAddExpense={handleAddExpense} />
                </div>

                {/* Right Column: Reports & Donut Breakdown (4 cols) */}
                <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
                  {/* Card 1: Reports Chart with $3400 Tooltip */}
                  <ReportsCard />

                  {/* Card 2: 50% Center Donut Chart with Category Breakdown */}
                  <SpendingDonutCard breakdown={donutItems} />
                </div>
              </div>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === 'transactions' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    All Transactions
                  </h2>
                  <p className="text-xs text-slate-400">
                    Search, filter, categorize, and export your cash-flow history
                  </p>
                </div>
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="px-3.5 py-2 rounded-2xl bg-[#18181c] text-white text-xs font-bold hover:bg-black transition-all"
                >
                  Import Statement
                </button>
              </div>

              <TransactionLedger
                transactions={allTransactions}
                categories={categories}
                onEditTransaction={() => setIsAddExpenseOpen(true)}
                onDeleteTransactions={(ids) => {
                  deleteTransactions(ids);
                  setAllTransactions(getTransactions());
                }}
                onBulkRecategorize={(ids, cat) => {
                  bulkRecategorize(ids, cat);
                  setAllTransactions(getTransactions());
                }}
                onNewTransaction={() => setIsAddExpenseOpen(true)}
              />
            </div>
          )}

          {/* Reports Tab */}
          {activeTab === 'reports' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReportsCard />
              <SpendingDonutCard breakdown={donutItems} />
              <div className="md:col-span-2">
                <RecentTransactionsCard items={recentItems} />
              </div>
            </div>
          )}

          {/* Budgets Tab */}
          {activeTab === 'budgets' && (
            <SpendingCaps
              transactions={allTransactions}
              categories={categories}
              onUpdateCategoryCap={(catId, cap) => {
                updateCategoryCap(catId, cap);
                setCategories(getCategories());
              }}
            />
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              <div className="p-6 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Google Account Session
                </h3>
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentUser?.avatar}
                      alt={currentUser?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white">
                        {currentUser?.name}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {currentUser?.email}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsGoogleAuthOpen(true)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700"
                  >
                    Switch Account
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-[28px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Data Vault & Backups
                </h3>
                <p className="text-xs text-slate-400">
                  Export your full encrypted JSON ledger or restore an existing backup.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsDataManagerOpen(true)}
                    className="px-4 py-2 rounded-xl bg-[#18181c] text-white text-xs font-bold hover:bg-black"
                  >
                    Manage Vault & Backups
                  </button>
                  <button
                    onClick={() => setIsImportModalOpen(true)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Import Bank Statement
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Google Sign In / Sign Up Modal */}
      <GoogleAuthModal
        isOpen={isGoogleAuthOpen}
        onClose={() => setIsGoogleAuthOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          confetti({ particleCount: 50, spread: 60 });
        }}
      />

      {/* Upgrade Pro Modal */}
      <PremiumModal
        isOpen={isPremiumOpen}
        onClose={() => setIsPremiumOpen(false)}
      />

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onAddExpense={handleAddExpense}
      />

      {/* Statement Import Modal */}
      <StatementImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={(rows) => {
          setAllTransactions(getTransactions());
        }}
        categories={categories}
      />

      {/* Data Vault Modal */}
      <DataManagerModal
        isOpen={isDataManagerOpen}
        onClose={() => setIsDataManagerOpen(false)}
        transactionsCount={allTransactions.length}
        recurringCount={5}
      />
    </div>
  );
}
