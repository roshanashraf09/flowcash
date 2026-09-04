/**
 * FlowCash Core Type Definitions and Constants
 */

export const PaymentMethods = {
  CARD: 'Card',
  CASH: 'Cash',
  TRANSFER: 'Transfer',
  DIRECT_DEBIT: 'Direct Debit',
};

export const CategoryTypes = {
  INCOME: 'income',
  EXPENSE: 'expense',
};

export const RecurringFrequencies = {
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
};

export const DEFAULT_CATEGORIES = [
  // Expense Categories
  { id: 'groceries', label: 'Groceries', type: 'expense', icon: 'ShoppingBag', color: '#10b981', budgetCap: 450 },
  { id: 'eating_out', label: 'Eating out', type: 'expense', icon: 'UtensilsCrossed', color: '#f59e0b', budgetCap: 250 },
  { id: 'coffee', label: 'Coffee', type: 'expense', icon: 'Coffee', color: '#b45309', budgetCap: 50 },
  { id: 'rent', label: 'Rent & Mortgage', type: 'expense', icon: 'Home', color: '#6366f1', budgetCap: 1250 },
  { id: 'utilities', label: 'Utilities', type: 'expense', icon: 'Zap', color: '#06b6d4', budgetCap: 180 },
  { id: 'transport', label: 'Transport', type: 'expense', icon: 'Car', color: '#3b82f6', budgetCap: 180 },
  { id: 'entertainment', label: 'Entertainment', type: 'expense', icon: 'Gamepad2', color: '#ec4899', budgetCap: 120 },
  { id: 'shopping', label: 'Shopping', type: 'expense', icon: 'ShoppingBag', color: '#8b5cf6', budgetCap: 200 },
  { id: 'clothes', label: 'Clothes', type: 'expense', icon: 'Shirt', color: '#a855f7', budgetCap: 120 },
  { id: 'phone', label: 'Phone & Internet', type: 'expense', icon: 'Smartphone', color: '#14b8a6', budgetCap: 75 },
  { id: 'health', label: 'Health & Pharmacy', type: 'expense', icon: 'HeartPulse', color: '#ef4444', budgetCap: 90 },
  { id: 'gym', label: 'Gym & Fitness', type: 'expense', icon: 'Dumbbell', color: '#0284c7', budgetCap: 55 },
  { id: 'insurance', label: 'Insurance', type: 'expense', icon: 'ShieldCheck', color: '#475569', budgetCap: 110 },
  { id: 'travel', label: 'Travel & Holidays', type: 'expense', icon: 'Plane', color: '#0ea5e9', budgetCap: 250 },
  { id: 'pets', label: 'Pets', type: 'expense', icon: 'PawPrint', color: '#d97706', budgetCap: 80 },
  { id: 'gifts', label: 'Gifts & Charity', type: 'expense', icon: 'Gift', color: '#f43f5e', budgetCap: 60 },
  { id: 'home', label: 'Home & Maintenance', type: 'expense', icon: 'Hammer', color: '#78716c', budgetCap: 150 },

  // Income Categories
  { id: 'salary', label: 'Salary', type: 'income', icon: 'Briefcase', color: '#10b981', budgetCap: null },
  { id: 'freelance', label: 'Freelance & Consulting', type: 'income', icon: 'Laptop', color: '#3b82f6', budgetCap: null },
  { id: 'savings', label: 'Savings Deposit', type: 'income', icon: 'PiggyBank', color: '#8b5cf6', budgetCap: null },
  { id: 'interest', label: 'Interest & Dividends', type: 'income', icon: 'TrendingUp', color: '#059669', budgetCap: null },
  { id: 'refund', label: 'Refund & Cashbacks', type: 'income', icon: 'RotateCcw', color: '#06b6d4', budgetCap: null },
];
