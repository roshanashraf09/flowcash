import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  UploadCloud,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ArrowRight,
  Filter,
  Check,
  RotateCcw
} from 'lucide-react';
import CategoryIcon from './CategoryIcon';
import { parseStatement, SAMPLE_STATEMENTS } from '../parseStatement';

export default function StatementImportModal({
  isOpen,
  onClose,
  onImportComplete,
  categories = []
}) {
  const [statementText, setStatementText] = useState('');
  const [fileName, setFileName] = useState('');
  const [parsedResult, setParsedResult] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [parseError, setParseError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const categoryLookup = React.useMemo(() => {
    const map = {};
    categories.forEach(c => {
      map[c.id] = c;
    });
    return map;
  }, [categories]);

  const handleParse = (textToParse) => {
    try {
      setParseError('');
      const res = parseStatement(textToParse);
      setParsedResult(res);
      setParsedRows(res.transactions);
    } catch (err) {
      setParseError(err.message || 'Failed to parse bank statement.');
      setParsedResult(null);
      setParsedRows([]);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        setStatementText(content);
        handleParse(content);
      }
    };
    reader.readAsText(file);
  };

  const handleLoadSample = (sampleKey) => {
    const sample = SAMPLE_STATEMENTS[sampleKey];
    if (sample) {
      setFileName(`sample_${sampleKey}_statement.csv`);
      setStatementText(sample);
      handleParse(sample);
    }
  };

  const handleToggleRow = (idx) => {
    setParsedRows(rows => rows.map((r, i) => i === idx ? { ...r, selected: !r.selected } : r));
  };

  const handleToggleAll = () => {
    const allSelected = parsedRows.every(r => r.selected);
    setParsedRows(rows => rows.map(r => ({ ...r, selected: !allSelected })));
  };

  const handleCategoryChange = (idx, newCat) => {
    setParsedRows(rows => rows.map((r, i) => i === idx ? { ...r, category: newCat, confidence: 1.0 } : r));
  };

  const handleCommit = () => {
    const selectedRows = parsedRows.filter(r => r.selected);
    if (selectedRows.length === 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      onImportComplete(selectedRows);
      setIsProcessing(false);
      onClose();
    }, 400);
  };

  if (!isOpen) return null;

  const selectedCount = parsedRows.filter(r => r.selected).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <UploadCloud size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Import Bank Statement
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Supports Barclays, Lloyds, Revolut, Chase, Monzo, and generic CSV or plain text
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
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Step 1: Input / Dropzone */}
          {!parsedResult ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 rounded-2xl p-8 text-center transition-all">
                <input
                  type="file"
                  id="statementFile"
                  accept=".csv, .txt"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="statementFile"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <FileSpreadsheet size={40} className="text-emerald-500 mb-3" />
                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                    Drop bank statement CSV or click to browse
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    Processed entirely on your device. Zero cloud uploads.
                  </span>
                </label>
              </div>

              {/* Paste or Try Sample Statements */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Or load sample bank dump:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLoadSample('monzo')}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 hover:text-emerald-500 transition-all"
                  >
                    Monzo Sample
                  </button>
                  <button
                    onClick={() => handleLoadSample('barclays')}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 hover:text-emerald-500 transition-all"
                  >
                    Barclays Sample
                  </button>
                  <button
                    onClick={() => handleLoadSample('chase')}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500/10 hover:text-emerald-500 transition-all"
                  >
                    Chase Sample
                  </button>
                </div>
              </div>

              {/* Textarea Paste */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Paste raw statement text
                </label>
                <textarea
                  rows={4}
                  value={statementText}
                  onChange={e => setStatementText(e.target.value)}
                  placeholder="Paste CSV lines or plain-text statement lines here..."
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => handleParse(statementText)}
                    disabled={!statementText.trim()}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white text-xs font-bold transition-all"
                  >
                    Parse Statement
                  </button>
                </div>
              </div>

              {parseError && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs border border-rose-200">
                  {parseError}
                </div>
              )}
            </div>
          ) : (
            /* Step 2: Review & Reconciliation Preview Table */
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Detected: {parsedResult.detectedFormat}
                  </span>
                  <span className="text-slate-500">
                    Parsed {parsedRows.length} transactions
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => { setParsedResult(null); setStatementText(''); }}
                    className="px-2.5 py-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs flex items-center gap-1"
                  >
                    <RotateCcw size={12} />
                    <span>Re-upload</span>
                  </button>
                  <button
                    onClick={handleToggleAll}
                    className="px-2.5 py-1 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg font-semibold"
                  >
                    {parsedRows.every(r => r.selected) ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden max-h-[380px] overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 font-semibold sticky top-0 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="p-3 w-10 text-center">Inc</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Description</th>
                      <th className="p-3">Auto-Categorized</th>
                      <th className="p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {parsedRows.map((row, idx) => {
                      const isIncome = row.amount > 0;
                      const catMeta = categoryLookup[row.category] || {
                        label: row.category,
                        color: '#10b981',
                        icon: 'ShoppingBag'
                      };

                      return (
                        <tr
                          key={row.id || idx}
                          className={`transition-colors ${
                            row.selected
                              ? 'bg-emerald-50/40 dark:bg-emerald-950/10'
                              : 'opacity-50 hover:opacity-80'
                          }`}
                        >
                          <td className="p-3 text-center">
                            <input
                              type="checkbox"
                              checked={row.selected}
                              onChange={() => handleToggleRow(idx)}
                              className="w-4 h-4 rounded text-emerald-500"
                            />
                          </td>
                          <td className="p-3 font-mono whitespace-nowrap text-slate-600 dark:text-slate-300">
                            {row.date}
                          </td>
                          <td className="p-3 font-medium text-slate-900 dark:text-white max-w-[200px] truncate">
                            {row.description}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5">
                              <select
                                value={row.category}
                                onChange={e => handleCategoryChange(idx, e.target.value)}
                                className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
                              >
                                {categories.map(c => (
                                  <option key={c.id} value={c.id}>
                                    {c.label}
                                  </option>
                                ))}
                              </select>
                              {row.confidence >= 0.8 && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-500 font-bold">
                                  Rule Match
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3 text-right font-mono font-bold whitespace-nowrap">
                            <span className={isIncome ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}>
                              {isIncome ? '+' : ''}£{Math.abs(row.amount).toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {parsedResult && (
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {selectedCount} of {parsedRows.length} transactions selected for import
            </span>

            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCommit}
                disabled={selectedCount === 0 || isProcessing}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white text-xs font-bold shadow-sm flex items-center gap-2"
              >
                <Check size={14} />
                <span>Commit {selectedCount} Transactions</span>
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
