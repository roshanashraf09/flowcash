/**
 * FlowCash Local-First Storage Engine
 * Dual-layer persistence: Tauri FS / Web localStorage fallback
 * Optimistic updates, event-driven reactive sync, and deduplication
 */

import { INITIAL_TRANSACTIONS, INITIAL_CATEGORIES, INITIAL_RECURRING_RULES } from './mockData';

const STORAGE_KEYS = {
  TRANSACTIONS: 'flowcash_v1_transactions',
  CATEGORIES: 'flowcash_v1_categories',
  RECURRING: 'flowcash_v1_recurring',
  PREFERENCES: 'flowcash_v1_preferences',
};

// Check if running inside Tauri desktop runtime
export const isTauri = () => {
  return typeof window !== 'undefined' && (
    !!window.__TAURI_INTERNALS__ || 
    !!window.__TAURI__ || 
    !!window.__TAURI_IPC__
  );
};

// Listeners for reactive data synchronization across views
const listeners = new Set();
export const subscribeToStorage = (callback) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};

const notifyListeners = (eventType, payload) => {
  listeners.forEach((listener) => {
    try {
      listener(eventType, payload);
    } catch (err) {
      console.error('Error notifying storage listener:', err);
    }
  });
};

// In-memory cache for fast, synchronous reads and optimistic updates
let memoryCache = {
  transactions: null,
  categories: null,
  recurring: null,
  preferences: null,
};

// Initialize cache from localStorage or mock defaults
const initCache = () => {
  if (typeof window === 'undefined') return;

  try {
    const rawTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    memoryCache.transactions = rawTx ? JSON.parse(rawTx) : INITIAL_TRANSACTIONS;

    const rawCat = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    memoryCache.categories = rawCat ? JSON.parse(rawCat) : INITIAL_CATEGORIES;

    const rawRec = localStorage.getItem(STORAGE_KEYS.RECURRING);
    memoryCache.recurring = rawRec ? JSON.parse(rawRec) : INITIAL_RECURRING_RULES;

    const rawPref = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    memoryCache.preferences = rawPref ? JSON.parse(rawPref) : {
      userName: 'Roshan',
      currency: 'GBP',
      currencySymbol: '£',
      theme: 'light',
      hasSeenIntro: true,
      storageFolder: 'C:\\Users\\rosha\\Documents\\FlowCash\\Vault',
      monthlyIncome: 2500,
    };

    // If first time, commit initial dataset to localStorage
    if (!rawTx) localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(memoryCache.transactions));
    if (!rawCat) localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(memoryCache.categories));
    if (!rawRec) localStorage.setItem(STORAGE_KEYS.RECURRING, JSON.stringify(memoryCache.recurring));
    if (!rawPref) localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(memoryCache.preferences));
  } catch (err) {
    console.error('Failed to initialize local storage cache:', err);
    memoryCache.transactions = INITIAL_TRANSACTIONS;
    memoryCache.categories = INITIAL_CATEGORIES;
    memoryCache.recurring = INITIAL_RECURRING_RULES;
    memoryCache.preferences = {
      userName: 'Roshan',
      currency: 'GBP',
      currencySymbol: '£',
      theme: 'light',
      hasSeenIntro: true,
      storageFolder: 'C:\\Users\\rosha\\Documents\\FlowCash\\Vault',
      monthlyIncome: 2500,
    };
  }
};

// Run cache initialization immediately
initCache();

// Helper to persist cache to disk/storage
const persist = async (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));

    // If Tauri is active, persist to desktop filesystem asynchronously
    if (isTauri() && window.__TAURI__?.fs) {
      try {
        await window.__TAURI__.fs.writeTextFile(
          `${key}.json`,
          JSON.stringify(data, null, 2)
        );
      } catch (tauriErr) {
        console.warn('Tauri filesystem write failed, falling back to localStorage:', tauriErr);
      }
    }
  } catch (err) {
    console.error(`Failed to persist data for key ${key}:`, err);
    throw err;
  }
};

/**
 * Deduplication signature generator
 */
export const getTransactionHash = (tx) => {
  const date = tx.date || '';
  const amount = Number(tx.amount).toFixed(2);
  const desc = (tx.description || '').trim().toLowerCase();
  return `${date}_${amount}_${desc}`;
};

// ================= TRANSACTION API =================

export const getTransactions = () => {
  if (!memoryCache.transactions) initCache();
  return [...memoryCache.transactions];
};

export const saveTransaction = async (transaction) => {
  if (!memoryCache.transactions) initCache();
  const previous = [...memoryCache.transactions];

  let isNew = false;
  const existingIdx = memoryCache.transactions.findIndex(t => t.id === transaction.id);

  if (existingIdx >= 0) {
    memoryCache.transactions[existingIdx] = { ...transaction };
  } else {
    isNew = true;
    memoryCache.transactions.unshift({
      ...transaction,
      id: transaction.id || `tx-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`
    });
  }

  // Sort descending by date
  memoryCache.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));

  try {
    await persist(STORAGE_KEYS.TRANSACTIONS, memoryCache.transactions);
    notifyListeners('transactions_updated', { count: memoryCache.transactions.length });
    return transaction;
  } catch (err) {
    // Rollback optimistic update
    memoryCache.transactions = previous;
    throw err;
  }
};

export const deleteTransactions = async (ids) => {
  if (!ids || ids.length === 0) return;
  const idSet = new Set(ids);
  const previous = [...memoryCache.transactions];

  memoryCache.transactions = memoryCache.transactions.filter(t => !idSet.has(t.id));

  try {
    await persist(STORAGE_KEYS.TRANSACTIONS, memoryCache.transactions);
    notifyListeners('transactions_updated', { count: memoryCache.transactions.length });
  } catch (err) {
    memoryCache.transactions = previous;
    throw err;
  }
};

export const bulkRecategorize = async (ids, newCategory) => {
  if (!ids || ids.length === 0) return;
  const idSet = new Set(ids);
  const previous = [...memoryCache.transactions];

  memoryCache.transactions = memoryCache.transactions.map(t => {
    if (idSet.has(t.id)) {
      return { ...t, category: newCategory };
    }
    return t;
  });

  try {
    await persist(STORAGE_KEYS.TRANSACTIONS, memoryCache.transactions);
    notifyListeners('transactions_updated', { count: memoryCache.transactions.length });
  } catch (err) {
    memoryCache.transactions = previous;
    throw err;
  }
};

// ================= CATEGORY API =================

export const getCategories = () => {
  if (!memoryCache.categories) initCache();
  return [...memoryCache.categories];
};

export const updateCategoryCap = async (categoryId, newBudgetCap) => {
  if (!memoryCache.categories) initCache();
  const previous = [...memoryCache.categories];

  memoryCache.categories = memoryCache.categories.map(c => {
    if (c.id === categoryId) {
      return { ...c, budgetCap: newBudgetCap !== null ? Number(newBudgetCap) : null };
    }
    return c;
  });

  try {
    await persist(STORAGE_KEYS.CATEGORIES, memoryCache.categories);
    notifyListeners('categories_updated', { categories: memoryCache.categories });
  } catch (err) {
    memoryCache.categories = previous;
    throw err;
  }
};

export const saveCategory = async (category) => {
  if (!memoryCache.categories) initCache();
  const previous = [...memoryCache.categories];
  const idx = memoryCache.categories.findIndex(c => c.id === category.id);

  if (idx >= 0) {
    memoryCache.categories[idx] = { ...category };
  } else {
    memoryCache.categories.push({ ...category });
  }

  try {
    await persist(STORAGE_KEYS.CATEGORIES, memoryCache.categories);
    notifyListeners('categories_updated', { categories: memoryCache.categories });
  } catch (err) {
    memoryCache.categories = previous;
    throw err;
  }
};

// ================= RECURRING RULES API =================

export const getRecurringRules = () => {
  if (!memoryCache.recurring) initCache();
  return [...memoryCache.recurring];
};

export const saveRecurringRule = async (rule) => {
  if (!memoryCache.recurring) initCache();
  const previous = [...memoryCache.recurring];
  const id = rule.id || `rec-${Date.now()}`;
  const completeRule = { ...rule, id };

  const idx = memoryCache.recurring.findIndex(r => r.id === id);
  if (idx >= 0) {
    memoryCache.recurring[idx] = completeRule;
  } else {
    memoryCache.recurring.push(completeRule);
  }

  try {
    await persist(STORAGE_KEYS.RECURRING, memoryCache.recurring);
    notifyListeners('recurring_updated', { recurring: memoryCache.recurring });
    return completeRule;
  } catch (err) {
    memoryCache.recurring = previous;
    throw err;
  }
};

export const deleteRecurringRule = async (ruleId) => {
  if (!memoryCache.recurring) initCache();
  const previous = [...memoryCache.recurring];
  memoryCache.recurring = memoryCache.recurring.filter(r => r.id !== ruleId);

  try {
    await persist(STORAGE_KEYS.RECURRING, memoryCache.recurring);
    notifyListeners('recurring_updated', { recurring: memoryCache.recurring });
  } catch (err) {
    memoryCache.recurring = previous;
    throw err;
  }
};

// ================= IMPORT & BACKUP API =================

/**
 * Import transactions with duplicate detection
 */
export const importTransactions = async (newTransactions) => {
  if (!memoryCache.transactions) initCache();
  const existingTx = memoryCache.transactions;
  const existingHashes = new Set(existingTx.map(getTransactionHash));
  const existingIds = new Set(existingTx.map(t => t.id));

  let importedCount = 0;
  let skippedDuplicates = 0;
  const toAdd = [];

  for (const item of newTransactions) {
    const hash = getTransactionHash(item);
    if (existingHashes.has(hash) || (item.id && existingIds.has(item.id))) {
      skippedDuplicates++;
    } else {
      const sanitized = {
        id: item.id || `tx-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        date: item.date,
        amount: Number(item.amount),
        category: item.category || 'shopping',
        description: item.description || 'Imported Transaction',
        paymentMethod: item.paymentMethod || 'Card',
        isRecurring: !!item.isRecurring,
        tags: Array.isArray(item.tags) ? item.tags : ['imported']
      };
      existingHashes.add(hash);
      existingIds.add(sanitized.id);
      toAdd.push(sanitized);
      importedCount++;
    }
  }

  if (toAdd.length > 0) {
    memoryCache.transactions = [...toAdd, ...memoryCache.transactions];
    memoryCache.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    await persist(STORAGE_KEYS.TRANSACTIONS, memoryCache.transactions);
    notifyListeners('transactions_updated', { count: memoryCache.transactions.length });
  }

  return { importedCount, skippedDuplicates };
};

/**
 * Export full backup as formatted JSON
 */
export const exportFullBackup = () => {
  if (!memoryCache.transactions) initCache();
  return {
    app: 'FlowCash',
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    transactions: memoryCache.transactions,
    categories: memoryCache.categories,
    recurringRules: memoryCache.recurring,
    preferences: memoryCache.preferences,
  };
};

/**
 * Trigger browser file download for backup
 */
export const downloadBackupFile = () => {
  const data = exportFullBackup();
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const dateStamp = new Date().toISOString().split('T')[0];
  link.href = url;
  link.download = `flowcash_backup_${dateStamp}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Restore from JSON backup file without duplicates
 */
export const restoreFromBackup = async (backupData) => {
  if (!backupData || !Array.isArray(backupData.transactions)) {
    throw new Error('Invalid FlowCash backup structure. Missing transactions array.');
  }

  // Restore categories if present
  if (Array.isArray(backupData.categories) && backupData.categories.length > 0) {
    const existingCatIds = new Set(memoryCache.categories.map(c => c.id));
    const mergedCategories = [...memoryCache.categories];

    for (const cat of backupData.categories) {
      if (!existingCatIds.has(cat.id)) {
        mergedCategories.push(cat);
      }
    }
    memoryCache.categories = mergedCategories;
    await persist(STORAGE_KEYS.CATEGORIES, memoryCache.categories);
  }

  // Restore recurring rules if present
  if (Array.isArray(backupData.recurringRules)) {
    const existingRecIds = new Set(memoryCache.recurring.map(r => r.id));
    const mergedRules = [...memoryCache.recurring];

    for (const rule of backupData.recurringRules) {
      if (!existingRecIds.has(rule.id)) {
        mergedRules.push(rule);
      }
    }
    memoryCache.recurring = mergedRules;
    await persist(STORAGE_KEYS.RECURRING, memoryCache.recurring);
  }

  // Restore transactions with deduplication
  const result = await importTransactions(backupData.transactions);
  notifyListeners('full_restore_completed', result);
  return result;
};

/**
 * Reset data back to initial sample state
 */
export const resetToDemoData = async () => {
  memoryCache.transactions = [...INITIAL_TRANSACTIONS];
  memoryCache.categories = [...INITIAL_CATEGORIES];
  memoryCache.recurring = [...INITIAL_RECURRING_RULES];

  await persist(STORAGE_KEYS.TRANSACTIONS, memoryCache.transactions);
  await persist(STORAGE_KEYS.CATEGORIES, memoryCache.categories);
  await persist(STORAGE_KEYS.RECURRING, memoryCache.recurring);

  notifyListeners('transactions_updated', {});
  notifyListeners('categories_updated', {});
  notifyListeners('recurring_updated', {});
};

/**
 * Wipe all data with option to trigger Onboarding
 */
export const wipeAllData = async (triggerOnboarding = true) => {
  memoryCache.transactions = [];
  memoryCache.recurring = [];

  if (triggerOnboarding) {
    if (!memoryCache.preferences) initCache();
    memoryCache.preferences = {
      ...memoryCache.preferences,
      hasSeenIntro: false,
    };
    await persist(STORAGE_KEYS.PREFERENCES, memoryCache.preferences);
  }

  await persist(STORAGE_KEYS.TRANSACTIONS, []);
  await persist(STORAGE_KEYS.RECURRING, []);

  notifyListeners('transactions_updated', {});
  notifyListeners('recurring_updated', {});
  notifyListeners('preferences_updated', memoryCache.preferences);
};

/**
 * Preferences API
 */
export const getPreferences = () => {
  if (!memoryCache.preferences) initCache();
  return {
    userName: 'Roshan',
    currency: 'GBP',
    currencySymbol: '£',
    theme: 'light',
    hasSeenIntro: true,
    storageFolder: 'C:\\Users\\rosha\\Documents\\FlowCash\\Vault',
    monthlyIncome: 2500,
    ...memoryCache.preferences,
  };
};

export const savePreferences = async (newPref) => {
  if (!memoryCache.preferences) initCache();
  memoryCache.preferences = {
    ...getPreferences(),
    ...newPref,
  };
  await persist(STORAGE_KEYS.PREFERENCES, memoryCache.preferences);
  notifyListeners('preferences_updated', memoryCache.preferences);
  return memoryCache.preferences;
};

export const setStorageFolder = async (folderPath) => {
  return await savePreferences({ storageFolder: folderPath });
};
