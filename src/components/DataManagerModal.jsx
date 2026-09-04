import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  DownloadCloud,
  UploadCloud,
  RotateCcw,
  Trash2,
  Lock,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  X,
  FileJson
} from 'lucide-react';
import {
  downloadBackupFile,
  restoreFromBackup,
  resetToDemoData,
  wipeAllData,
  isTauri
} from '../storage';

export default function DataManagerModal({
  isOpen,
  onClose,
  transactionsCount = 0,
  recurringCount = 0,
}) {
  const [restoreStatus, setRestoreStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleBackup = () => {
    downloadBackupFile();
  };

  const handleRestoreFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result;
        if (typeof text !== 'string') return;
        const parsed = JSON.parse(text);
        const result = await restoreFromBackup(parsed);
        setRestoreStatus(result);
      } catch (err) {
        setErrorMsg(err.message || 'Invalid JSON backup format.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDemo = async () => {
    if (window.confirm('Reset all ledger and recurring rules to sample demo data?')) {
      await resetToDemoData();
      onClose();
    }
  };

  const handleWipeData = async () => {
    if (window.confirm('WARNING: This will permanently wipe all transactions and subscriptions from your local device. Continue?')) {
      await wipeAllData();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Privacy & Data Vault
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Offline-first storage, encrypted JSON backup & restore
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          {/* Privacy Isolation Status */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 flex items-start gap-3">
            <Lock size={18} className="text-emerald-500 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <div className="font-bold text-emerald-800 dark:text-emerald-300">
                100% Offline-First Data Isolation
              </div>
              <p className="text-emerald-700/80 dark:text-emerald-400/80 leading-relaxed">
                FlowCash stores all ledgers locally on your device ({isTauri() ? 'Native Desktop Filesystem' : 'Browser LocalStorage'}). There are zero telemetry trackers, zero third-party cloud syncs, and your financial data never leaves this machine.
              </p>
            </div>
          </div>

          {/* Backup Export */}
          <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Export Full Backup
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Download formatted JSON backup with {transactionsCount} transactions & {recurringCount} rules.
              </p>
            </div>
            <button
              onClick={handleBackup}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm flex items-center gap-1.5 transition-all"
            >
              <DownloadCloud size={14} />
              <span>Download JSON</span>
            </button>
          </div>

          {/* Restore from File */}
          <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Restore Backup File
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Merge backup JSON with automatic duplicate prevention.
                </p>
              </div>

              <div>
                <input
                  type="file"
                  id="backupFileInput"
                  accept=".json"
                  onChange={handleRestoreFile}
                  className="hidden"
                />
                <label
                  htmlFor="backupFileInput"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer flex items-center gap-1.5 transition-all"
                >
                  <UploadCloud size={14} />
                  <span>Choose File</span>
                </label>
              </div>
            </div>

            {restoreStatus && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>
                  Restored successfully! Imported {restoreStatus.importedCount} new entries (skipped {restoreStatus.skippedDuplicates} duplicates).
                </span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-600 text-xs">
                {errorMsg}
              </div>
            )}
          </div>

          {/* Reset & Wipe Danger Zone */}
          <div className="p-4 rounded-2xl border border-rose-200/40 dark:border-rose-950/40 bg-rose-50/20 dark:bg-rose-950/10 space-y-3">
            <h4 className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
              Danger Zone
            </h4>

            <div className="flex flex-col sm:flex-row gap-2 pt-1">
              <button
                onClick={handleResetDemo}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw size={13} />
                <span>Reset to Sample Data</span>
              </button>

              <button
                onClick={handleWipeData}
                className="flex-1 px-3 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 size={13} />
                <span>Wipe All Records</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
