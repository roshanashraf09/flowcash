import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Folder,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Wallet,
  Coins
} from 'lucide-react';
import FunCategoryIcon, { FUN_ICONS } from './FunCategoryIcon';
import { savePreferences, resetToDemoData, wipeAllData, isTauri } from '../storage';

export default function OnboardingScreen({
  isOpen,
  onComplete,
  initialPreferences = {},
}) {
  const [step, setStep] = useState(1);
  const [userName, setUserName] = useState(initialPreferences.userName || 'Roshan');
  const [currencySymbol, setCurrencySymbol] = useState(initialPreferences.currencySymbol || '£');
  const [monthlyIncome, setMonthlyIncome] = useState(initialPreferences.monthlyIncome || '2500');
  const [startMode, setStartMode] = useState('fresh'); // 'fresh' | 'demo'
  const [storageFolder, setStorageFolder] = useState(
    initialPreferences.storageFolder || 'C:\\Users\\rosha\\Documents\\FlowCash\\Vault'
  );
  const [folderPicking, setFolderPicking] = useState(false);

  if (!isOpen) return null;

  // Folder browser using Web File System Access API or Tauri Native Dialog
  const handlePickFolder = async () => {
    setFolderPicking(true);
    try {
      if (isTauri() && window.__TAURI__?.dialog) {
        const selected = await window.__TAURI__.dialog.open({
          directory: true,
          multiple: false,
          title: 'Select FlowCash Storage Vault Folder'
        });
        if (selected) {
          setStorageFolder(selected);
        }
      } else if (typeof window !== 'undefined' && 'showDirectoryPicker' in window) {
        const dirHandle = await window.showDirectoryPicker();
        if (dirHandle && dirHandle.name) {
          setStorageFolder(`Local Folder: /${dirHandle.name}`);
        }
      } else {
        const manual = window.prompt(
          'Enter local folder path for FlowCash data vault:',
          storageFolder
        );
        if (manual && manual.trim()) {
          setStorageFolder(manual.trim());
        }
      }
    } catch (err) {
      // User cancelled or browser rejected
      console.log('Folder pick dismissed:', err);
    } finally {
      setFolderPicking(false);
    }
  };

  const handleFinish = async () => {
    await savePreferences({
      userName: userName.trim() || 'Roshan',
      currencySymbol,
      monthlyIncome: parseFloat(monthlyIncome) || 2500,
      storageFolder,
      hasSeenIntro: true,
    });

    if (startMode === 'demo') {
      await resetToDemoData();
    } else {
      // Clean slate
      await wipeAllData(false);
    }

    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.55 },
    });

    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-md select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl shadow-blue-950/30 border border-slate-200/90 dark:border-slate-800 overflow-hidden flex flex-col"
      >
        {/* Playful Top Hero Banner with Cartoon Icons */}
        <div className="relative bg-gradient-to-br from-[#0EA5E9] via-[#0284C7] to-[#0D9488] p-6 text-white text-center overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -top-10 -right-10 w-36 h-36 bg-white/20 rounded-full blur-xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Floating Gemini-style cartoon icon trio */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="transform -rotate-6 shadow-md rounded-full bg-white/20 p-1 backdrop-blur-xs">
                <FunCategoryIcon name="groceries" className="w-9 h-9" />
              </div>
              <div className="transform scale-110 shadow-lg rounded-full bg-white/30 p-1.5 backdrop-blur-xs">
                {FUN_ICONS.cash_logo}
              </div>
              <div className="transform rotate-6 shadow-md rounded-full bg-white/20 p-1 backdrop-blur-xs">
                <FunCategoryIcon name="transport" className="w-9 h-9" />
              </div>
            </div>

            <h2 className="text-2xl font-extrabold tracking-tight">
              Welcome to FlowCash
            </h2>
            <p className="text-xs text-sky-100 font-medium max-w-xs mt-1">
              Your offline-first, private cash-flow engine. No accounts, zero cloud trackers.
            </p>
          </div>

          {/* Stepper indicator dots */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === 1 ? 'w-6 bg-white' : 'w-2 bg-white/40'
              }`}
            />
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step === 2 ? 'w-6 bg-white' : 'w-2 bg-white/40'
              }`}
            />
          </div>
        </div>

        {/* Step Content Container */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    What should we call you?
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. Roshan"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                    Primary Currency
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { sym: '£', code: 'GBP', name: 'Pounds' },
                      { sym: '$', code: 'USD', name: 'Dollars' },
                      { sym: '€', code: 'EUR', name: 'Euros' },
                      { sym: '₹', code: 'INR', name: 'Rupees' },
                    ].map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => setCurrencySymbol(item.sym)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          currencySymbol === item.sym
                            ? 'border-2 border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                            : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="text-base font-extrabold">{item.sym}</div>
                        <div className="text-[10px] text-slate-400">{item.code}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1">
                    Estimated Monthly Take-Home Income
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-slate-400 font-bold">
                      {currencySymbol}
                    </span>
                    <input
                      type="number"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      placeholder="2500"
                      className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full py-3 rounded-xl bg-[#1D70F7] hover:bg-[#155FD6] text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Next: Storage & Starting Data</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4 text-xs"
              >
                {/* Starting Data Mode */}
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-bold mb-1.5">
                    How would you like to start?
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setStartMode('fresh')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        startMode === 'fresh'
                          ? 'border-2 border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1">
                        <Sparkles size={14} className="text-emerald-500" />
                        <span>Fresh Start</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                        Clean empty ledger. Ready for your actual expenses.
                      </p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setStartMode('demo')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        startMode === 'demo'
                          ? 'border-2 border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-1">
                        <Coins size={14} className="text-blue-500" />
                        <span>Sample Pack</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                        Preload with sample bills, groceries, and salary to test.
                      </p>
                    </button>
                  </div>
                </div>

                {/* Local Storage Directory */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white">
                      <Folder size={14} className="text-amber-500" />
                      <span>Local Storage Vault Folder</span>
                    </div>
                    <button
                      type="button"
                      onClick={handlePickFolder}
                      disabled={folderPicking}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-[11px] font-bold hover:bg-slate-100 transition-all shadow-2xs"
                    >
                      Browse...
                    </button>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 font-mono text-[11px] text-slate-600 dark:text-slate-300 break-all">
                    {storageFolder}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <Lock size={11} />
                    <span>All financial records stay 100% on this computer.</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleFinish}
                    className="flex-1 py-3 rounded-xl bg-[#1D70F7] hover:bg-[#155FD6] text-white font-bold text-xs shadow-md shadow-blue-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 size={15} />
                    <span>Launch FlowCash</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
