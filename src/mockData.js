import { DEFAULT_CATEGORIES } from './types';

export const INITIAL_CATEGORIES = DEFAULT_CATEGORIES;

export const INITIAL_RECURRING_RULES = [
  {
    id: 'rec-1',
    title: 'Apartment Rent',
    amount: -1200.00,
    category: 'rent',
    frequency: 'monthly',
    nextDueDate: '2026-09-01',
    autoLog: true,
  },
  {
    id: 'rec-2',
    title: 'PureGym Membership',
    amount: -44.99,
    category: 'gym',
    frequency: 'monthly',
    nextDueDate: '2026-09-10',
    autoLog: true,
  },
  {
    id: 'rec-3',
    title: 'Spotify Family Plan',
    amount: -17.99,
    category: 'entertainment',
    frequency: 'monthly',
    nextDueDate: '2026-09-12',
    autoLog: true,
  },
  {
    id: 'rec-4',
    title: 'British Gas Energy',
    amount: -145.00,
    category: 'utilities',
    frequency: 'monthly',
    nextDueDate: '2026-09-15',
    autoLog: true,
  },
  {
    id: 'rec-5',
    title: 'EE Fibre & Mobile',
    amount: -62.50,
    category: 'phone',
    frequency: 'monthly',
    nextDueDate: '2026-09-18',
    autoLog: true,
  },
  {
    id: 'rec-6',
    title: 'Bupa Health Shield',
    amount: -85.00,
    category: 'insurance',
    frequency: 'monthly',
    nextDueDate: '2026-09-22',
    autoLog: true,
  },
  {
    id: 'rec-7',
    title: 'Tech Consulting Retainer',
    amount: 1250.00,
    category: 'freelance',
    frequency: 'monthly',
    nextDueDate: '2026-09-20',
    autoLog: false,
  }
];

export const INITIAL_TRANSACTIONS = [
  // September 2026
  {
    id: 'tx-101',
    date: '2026-09-01',
    amount: 3850.00,
    category: 'salary',
    description: 'Acme Corp Monthly Net Salary',
    paymentMethod: 'Transfer',
    isRecurring: true,
    tags: ['payroll', 'primary-income']
  },
  {
    id: 'tx-102',
    date: '2026-09-01',
    amount: -1200.00,
    category: 'rent',
    description: 'Residential Rent Payment',
    paymentMethod: 'Direct Debit',
    isRecurring: true,
    tags: ['fixed', 'housing']
  },
  {
    id: 'tx-103',
    date: '2026-09-02',
    amount: -84.20,
    category: 'groceries',
    description: 'Tesco Superstore Weekly Shop',
    paymentMethod: 'Card',
    isRecurring: false,
    tags: ['essentials', 'food']
  },
  {
    id: 'tx-104',
    date: '2026-09-02',
    amount: -4.80,
    category: 'coffee',
    description: 'Starbucks Flat White & Croissant',
    paymentMethod: 'Card',
    isRecurring: false,
    tags: ['morning', 'habits']
  },
  {
    id: 'tx-105',
    date: '2026-09-03',
    amount: -28.50,
    category: 'transport',
    description: 'TfL London Underground Travelcard',
    paymentMethod: 'Card',
    isRecurring: false,
    tags: ['commute']
  },
  {
    id: 'tx-106',
    date: '2026-09-03',
    amount: -42.00,
    category: 'eating_out',
    description: 'Honest Burgers Dinner with Sam',
    paymentMethod: 'Card',
    isRecurring: false,
    tags: ['social', 'dining']
  },
  {
    id: 'tx-107',
    date: '2026-09-04',
    amount: 350.00,
    category: 'freelance',
    description: 'Design Sprint UX Consultation',
    paymentMethod: 'Transfer',
    isRecurring: false,
    tags: ['client', 'side-gig']
  },
  {
    id: 'tx-108',
    date: '2026-09-04',
    amount: -19.99,
    category: 'shopping',
    description: 'Amazon UK Book & Desk Organizer',
    paymentMethod: 'Card',
    isRecurring: false,
    tags: ['workspace']
  },

  // August 2026
  {
    id: 'tx-081',
    date: '2026-08-01',
    amount: 3850.00,
    category: 'salary',
    description: 'Acme Corp Monthly Net Salary',
    paymentMethod: 'Transfer',
    isRecurring: true,
    tags: ['payroll']
  },
  {
    id: 'tx-082',
    date: '2026-08-01',
    amount: -1200.00,
    category: 'rent',
    description: 'Residential Rent Payment',
    paymentMethod: 'Direct Debit',
    isRecurring: true,
    tags: ['fixed']
  },
  {
    id: 'tx-083',
    date: '2026-08-05',
    amount: -112.40,
    category: 'groceries',
    description: 'Sainsburys Weekly Groceries',
    paymentMethod: 'Card',
    isRecurring: false,
    tags: ['essentials']
  },
  {
    id: 'tx-084',
    date: '2026-08-08',
    amount: -65.00,
    category: 'eating_out',
    description: 'Dishoom Covent Garden',
    paymentMethod: 'Card',
    isRecurring: false,
    tags: ['social']
  },
  {
    id: 'tx-085',
    date: '2026-08-10',
    amount: -44.99,
    category: 'gym',
    description: 'PureGym Monthly Membership',
    paymentMethod: 'Direct Debit',
    isRecurring: true,
    tags: ['fitness']
  },
  {
    id: 'tx-086',
    date: '2026-08-12',
    amount: -17.99,
    category: 'entertainment',
    description: 'Spotify Family Subscription',
    paymentMethod: 'Card',
    isRecurring: true,
    tags: ['entertainment']
  },
  {
    id: 'tx-087',
    date: '2026-08-15',
    amount: -138.50,
    category: 'utilities',
    description: 'British Gas Energy Bill',
    paymentMethod: 'Direct Debit',
    isRecurring: true,
    tags: ['bills']
  },
  {
    id: 'tx-088',
    date: '2026-08-18',
    amount: -62.50,
    category: 'phone',
    description: 'EE Mobile & Broadband',
    paymentMethod: 'Direct Debit',
    isRecurring: true,
    tags: ['bills']
  },
  {
    id: 'tx-089',
    date: '2026-08-20',
    amount: 1250.00,
    category: 'freelance',
    description: 'Fintech UI Consultation Retainer',
    paymentMethod: 'Transfer',
    isRecurring: true,
    tags: ['freelance']
  },
  {
    id: 'tx-090',
    date: '2026-08-22',
    amount: -85.00,
    category: 'insurance',
    description: 'Bupa Health Shield Premium',
    paymentMethod: 'Direct Debit',
    isRecurring: true,
    tags: ['insurance']
  },
  {
    id: 'tx-091',
    date: '2026-08-25',
    amount: -92.30,
    category: 'groceries',
    description: 'Waitrose Weekend Pantry Restock',
    paymentMethod: 'Card',
    isRecurring: false,
    tags: ['food']
  },
  {
    id: 'tx-092',
    date: '2026-08-27',
    amount: 45.00,
    category: 'interest',
    description: 'High Yield Savings Monthly Interest',
    paymentMethod: 'Transfer',
    isRecurring: true,
    tags: ['passive-income']
  },
  {
    id: 'tx-093',
    date: '2026-08-29',
    amount: -74.99,
    category: 'clothes',
    description: 'Uniqlo Autumn Knitwear & Oxford Shirt',
    paymentMethod: 'Card',
    isRecurring: false,
    tags: ['wardrobe']
  },

  // July 2026
  {
    id: 'tx-071',
    date: '2026-07-01',
    amount: 3850.00,
    category: 'salary',
    description: 'Acme Corp Monthly Net Salary',
    paymentMethod: 'Transfer',
    isRecurring: true,
    tags: ['payroll']
  },
  {
    id: 'tx-072',
    date: '2026-07-01',
    amount: -1200.00,
    category: 'rent',
    description: 'Residential Rent Payment',
    paymentMethod: 'Direct Debit',
    isRecurring: true,
    tags: ['housing']
  },
  {
    id: 'tx-073',
    date: '2026-07-14',
    amount: -210.00,
    category: 'travel',
    description: 'Eurostar Weekend Trip Paris',
    paymentMethod: 'Card',
    isRecurring: false,
    tags: ['holiday']
  },
  {
    id: 'tx-074',
    date: '2026-07-18',
    amount: 35.50,
    category: 'refund',
    description: 'Amazon Returned Goods Refund',
    paymentMethod: 'Card',
    isRecurring: false,
    tags: ['refund']
  },
  {
    id: 'tx-075',
    date: '2026-07-28',
    amount: -320.00,
    category: 'groceries',
    description: 'Monthly Household Groceries',
    paymentMethod: 'Card',
    isRecurring: false,
    tags: ['essentials']
  }
];
