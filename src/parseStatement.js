/**
 * FlowCash Bank Statement Parser
 * Supports CSV & plain-text dumps for Barclays, Lloyds, Revolut, Chase, Monzo, and Generic.
 * Rule-based keyword auto-categorization with confidence scoring.
 */

// Categorization rules mapping keywords to category IDs
const KEYWORD_RULES = [
  // Groceries
  {
    category: 'groceries',
    keywords: ['tesco', 'sainsbury', 'asda', 'morrison', 'waitrose', 'aldi', 'lidl', 'marks & spencer', 'm&s simply food', 'co-op', 'whole foods', 'grocery', 'supermarket'],
    tags: ['essentials', 'food']
  },
  // Coffee
  {
    category: 'coffee',
    keywords: ['starbucks', 'costa', 'caffe nero', 'pret a manger', 'pret', 'gail\'s', 'gails', 'blank street', 'artisan coffee', 'espresso'],
    tags: ['coffee', 'habits']
  },
  // Eating Out
  {
    category: 'eating_out',
    keywords: ['deliveroo', 'just eat', 'uber eats', 'nandos', 'wagamama', 'dishoom', 'five guys', 'mcdonald', 'burger king', 'kfc', 'pizza express', 'dominos', 'pub', 'bar', 'restaurant', 'bistro', 'brewery', 'taproom', 'honest burgers', 'flat iron'],
    tags: ['dining', 'social']
  },
  // Transport
  {
    category: 'transport',
    keywords: ['tfl', 'transport for london', 'underground', 'tube', 'trainline', 'national rail', 'uber', 'bolt', 'lime bike', 'shell', 'bp', 'esso', 'texaco', 'petrol', 'parking', 'eurostar', 'heathrow express'],
    tags: ['travel', 'commute']
  },
  // Entertainment & Streaming
  {
    category: 'entertainment',
    keywords: ['netflix', 'spotify', 'disney+', 'disney plus', 'amazon prime', 'prime video', 'apple music', 'youtube premium', 'odeon', 'vue cinema', 'cineworld', 'steam', 'playstation', 'nintendo', 'audible'],
    tags: ['subscription', 'entertainment']
  },
  // Shopping
  {
    category: 'shopping',
    keywords: ['amazon', 'argos', 'currys', 'john lewis', 'ebay', 'etsy', 'apple store', 'boots', 'tk maxx'],
    tags: ['retail']
  },
  // Clothes
  {
    category: 'clothes',
    keywords: ['zara', 'h&m', 'asos', 'uniqlo', 'primark', 'next', 'nike', 'adidas', 'lululemon', 'urban outfitters', 'mango'],
    tags: ['wardrobe']
  },
  // Rent & Housing
  {
    category: 'rent',
    keywords: ['rent', 'mortgage', 'landlord', 'foxtons', 'savills', 'residential lettings', 'estate agent'],
    tags: ['housing', 'fixed']
  },
  // Utilities
  {
    category: 'utilities',
    keywords: ['british gas', 'octopus energy', 'edf energy', 'ovo energy', 'e.on', 'thames water', 'anglian water', 'severn trent', 'council tax', 'energy', 'electric', 'water bill'],
    tags: ['utilities', 'bills']
  },
  // Phone & Internet
  {
    category: 'phone',
    keywords: ['ee mobile', 'ee limited', 'vodafone', 'o2', 'three uk', 'three mobile', 'giffgaff', 'bt broadband', 'sky broadband', 'virgin media', 'hyperoptic'],
    tags: ['telecom', 'bills']
  },
  // Health & Pharmacy
  {
    category: 'health',
    keywords: ['superdrug', 'pharmacy', 'chemist', 'nhs', 'dental', 'dentist', 'optician', 'specsavers', 'vision express', 'hospital'],
    tags: ['health']
  },
  // Gym & Fitness
  {
    category: 'gym',
    keywords: ['puregym', 'pure gym', 'the gym group', 'virgin active', 'david lloyd', 'nuffield health', 'fitness first', 'classpass', 'crossfit', 'gym'],
    tags: ['fitness', 'lifestyle']
  },
  // Insurance
  {
    category: 'insurance',
    keywords: ['bupa', 'aviva', 'axa', 'admiral', 'direct line', 'vitality', 'hiscox', 'churchill', 'insurance premium'],
    tags: ['insurance', 'protection']
  },
  // Pets
  {
    category: 'pets',
    keywords: ['pets at home', 'veterinary', 'vet clinic', 'vet surgery', 'rover.com', 'chewy', 'pet insurance'],
    tags: ['pets']
  },
  // Gifts & Charity
  {
    category: 'gifts',
    keywords: ['charity', 'unicef', 'oxfam', 'cancer research', 'gofundme', 'justgiving', 'florist', 'card factory'],
    tags: ['gifts', 'donations']
  },
  // Home Maintenance
  {
    category: 'home',
    keywords: ['b&q', 'screwfix', 'wickes', 'ikea', 'homebase', 'toolstation', 'plumber', 'electrician'],
    tags: ['home']
  },
  // Income: Salary
  {
    category: 'salary',
    keywords: ['salary', 'payroll', 'wages', 'acme corp', 'direct credit', 'bacs credit', 'employment'],
    tags: ['income', 'payroll']
  },
  // Income: Freelance
  {
    category: 'freelance',
    keywords: ['consulting', 'invoice', 'freelance', 'contract', 'client payment', 'upwork', 'fiverr'],
    tags: ['freelance', 'business']
  },
  // Income: Interest & Dividends
  {
    category: 'interest',
    keywords: ['gross interest', 'credit interest', 'savings interest', 'dividend', 'vanguard', 'trading 212'],
    tags: ['passive-income']
  },
  // Income: Refund
  {
    category: 'refund',
    keywords: ['refund', 'reversal', 'chargeback', 'returned goods', 'credit balance refund'],
    tags: ['refund']
  }
];

/**
 * Predict category and tags based on description text
 */
export const predictCategory = (description, amount) => {
  const desc = (description || '').toLowerCase();
  
  // If positive amount and description implies work / payroll
  if (amount > 0) {
    if (desc.includes('salary') || desc.includes('payroll') || desc.includes('wages')) {
      return { category: 'salary', confidence: 0.95, tags: ['payroll'] };
    }
    if (desc.includes('interest') || desc.includes('dividend')) {
      return { category: 'interest', confidence: 0.9, tags: ['interest'] };
    }
    if (desc.includes('refund') || desc.includes('reversal')) {
      return { category: 'refund', confidence: 0.9, tags: ['refund'] };
    }
    if (desc.includes('consulting') || desc.includes('invoice')) {
      return { category: 'freelance', confidence: 0.85, tags: ['freelance'] };
    }
  }

  for (const rule of KEYWORD_RULES) {
    for (const kw of rule.keywords) {
      if (desc.includes(kw)) {
        return {
          category: rule.category,
          confidence: 0.9,
          matchedKeyword: kw,
          tags: [...rule.tags]
        };
      }
    }
  }

  // Fallback defaults
  if (amount > 0) {
    return { category: 'savings', confidence: 0.4, tags: ['income'] };
  }
  return { category: 'shopping', confidence: 0.3, tags: ['general'] };
};

/**
 * Predict payment method from description or bank text
 */
export const predictPaymentMethod = (rawType, description) => {
  const text = `${rawType || ''} ${description || ''}`.toLowerCase();
  if (text.includes('direct debit') || text.includes('dd') || text.includes('d/d')) {
    return 'Direct Debit';
  }
  if (text.includes('standing order') || text.includes('transfer') || text.includes('faster payment') || text.includes('fps') || text.includes('bgc') || text.includes('bacs')) {
    return 'Transfer';
  }
  if (text.includes('atm') || text.includes('cash') || text.includes('withdrawal')) {
    return 'Cash';
  }
  return 'Card';
};

/**
 * Normalize dates to YYYY-MM-DD
 */
export const normalizeDate = (rawDate) => {
  if (!rawDate) return new Date().toISOString().split('T')[0];
  const cleaned = rawDate.trim().replace(/"/g, '');

  // Format: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    return cleaned;
  }

  // Format: DD/MM/YYYY or DD-MM-YYYY
  const ddmmyyyy = cleaned.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})$/);
  if (ddmmyyyy) {
    const day = ddmmyyyy[1].padStart(2, '0');
    const month = ddmmyyyy[2].padStart(2, '0');
    const year = ddmmyyyy[3];
    return `${year}-${month}-${day}`;
  }

  // Format: DD Mon YYYY (e.g. 04 Sep 2026)
  const parsed = new Date(cleaned);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString().split('T')[0];
  }

  return new Date().toISOString().split('T')[0];
};

/**
 * Robust CSV line splitter that respects quoted values
 */
export const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result.map(s => s.replace(/^["']|["']$/g, '').trim());
};

/**
 * Parse monetary values (strips currency symbols £, $, €, and handles debit/credit)
 */
export const parseAmount = (val, isDebit = false, isCredit = false) => {
  if (val === undefined || val === null || val === '') return 0;
  const str = String(val).replace(/[^0-9.\-+]/g, '');
  let num = parseFloat(str);
  if (isNaN(num)) return 0;

  if (isDebit) return -Math.abs(num);
  if (isCredit) return Math.abs(num);
  return num;
};

/**
 * Main parser entry point
 * Accepts CSV string or raw text dump
 */
export const parseStatement = (rawContent) => {
  if (!rawContent || typeof rawContent !== 'string') {
    throw new Error('Please provide bank statement content as CSV or text.');
  }

  const lines = rawContent.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) {
    throw new Error('Statement file is empty.');
  }

  // Try CSV detection
  const firstLine = lines[0].toLowerCase();
  const isCSV = lines.some(l => l.includes(','));

  let detectedFormat = 'Generic / Unknown';
  const transactions = [];

  if (isCSV) {
    const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase());
    const headerStr = headers.join(' ');

    // Bank detection
    if (headerStr.includes('sub account') && headerStr.includes('memo')) {
      detectedFormat = 'Barclays';
    } else if (headerStr.includes('debit amount') && headerStr.includes('credit amount') && headerStr.includes('sort code')) {
      detectedFormat = 'Lloyds';
    } else if (headerStr.includes('started date') && headerStr.includes('state')) {
      detectedFormat = 'Revolut';
    } else if (headerStr.includes('chase') || (headerStr.includes('category') && headerStr.includes('type') && headerStr.includes('posting date'))) {
      detectedFormat = 'Chase';
    } else if (headerStr.includes('emoji') || headerStr.includes('money out') || headerStr.includes('money in')) {
      detectedFormat = 'Monzo';
    } else {
      detectedFormat = 'Standard CSV';
    }

    // Dynamic column index resolution
    const dateIdx = headers.findIndex(h => h.includes('date') || h.includes('time'));
    const descIdx = headers.findIndex(h => h.includes('description') || h.includes('name') || h.includes('memo') || h.includes('payee') || h.includes('narrative'));
    const amountIdx = headers.findIndex(h => h === 'amount' || (h.includes('amount') && !h.includes('local')));
    const debitIdx = headers.findIndex(h => h.includes('debit') || h.includes('money out') || h.includes('outflow'));
    const creditIdx = headers.findIndex(h => h.includes('credit') || h.includes('money in') || h.includes('inflow'));
    const typeIdx = headers.findIndex(h => h.includes('type'));

    for (let i = 1; i < lines.length; i++) {
      const cols = parseCSVLine(lines[i]);
      if (cols.length < 2) continue;

      let rawDate = dateIdx >= 0 ? cols[dateIdx] : cols[0];
      let rawDesc = descIdx >= 0 ? cols[descIdx] : (cols[1] || 'Transaction');
      let amount = 0;

      if (debitIdx >= 0 && creditIdx >= 0) {
        const debitVal = cols[debitIdx];
        const creditVal = cols[creditIdx];
        if (debitVal && parseFloat(debitVal) !== 0) {
          amount = -Math.abs(parseAmount(debitVal));
        } else if (creditVal && parseFloat(creditVal) !== 0) {
          amount = Math.abs(parseAmount(creditVal));
        }
      } else if (amountIdx >= 0) {
        amount = parseAmount(cols[amountIdx]);
      } else {
        // Find column with numbers
        for (const col of cols) {
          const parsed = parseAmount(col);
          if (parsed !== 0) {
            amount = parsed;
            break;
          }
        }
      }

      if (amount === 0 && !rawDesc) continue;

      const date = normalizeDate(rawDate);
      const prediction = predictCategory(rawDesc, amount);
      const paymentMethod = predictPaymentMethod(typeIdx >= 0 ? cols[typeIdx] : '', rawDesc);

      transactions.push({
        id: `imp-${Date.now()}-${i}-${Math.random().toString(36).substring(2, 5)}`,
        date,
        amount,
        description: rawDesc.replace(/\s+/g, ' ').trim(),
        category: prediction.category,
        confidence: prediction.confidence,
        paymentMethod,
        isRecurring: false,
        tags: prediction.tags,
        selected: true, // Selected by default for import confirmation
      });
    }
  } else {
    // Plain-text line by line parsing
    detectedFormat = 'Plain Text Dump';
    const lineRegex = /^(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{4}-\d{2}-\d{2})\s+(.+?)\s+([+\-£$€]?\s*[\d,]+\.\d{2})/i;

    lines.forEach((line, idx) => {
      const match = line.match(lineRegex);
      if (match) {
        const date = normalizeDate(match[1]);
        const description = match[2].trim();
        const amount = parseAmount(match[3]);
        const prediction = predictCategory(description, amount);
        const paymentMethod = predictPaymentMethod('', description);

        transactions.push({
          id: `imp-${Date.now()}-${idx}`,
          date,
          amount,
          description,
          category: prediction.category,
          confidence: prediction.confidence,
          paymentMethod,
          isRecurring: false,
          tags: prediction.tags,
          selected: true,
        });
      }
    });
  }

  return {
    detectedFormat,
    totalParsed: transactions.length,
    transactions,
  };
};

/**
 * Sample statement generators for quick demo testing
 */
export const SAMPLE_STATEMENTS = {
  monzo: `Date,Time,Type,Name,Category,Amount,Currency,Description
02/09/2026,08:30:00,Card Payment,Starbucks Coffee,Eating out,-4.20,GBP,Starbucks St Pancras
02/09/2026,18:15:00,Card Payment,Tesco Superstore,Groceries,-68.45,GBP,Tesco Express Metro
03/09/2026,09:12:00,Card Payment,TfL Travel Charge,Transport,-3.40,GBP,Transport for London
03/09/2026,20:00:00,Card Payment,Nandos Restaurant,Eating out,-26.80,GBP,Nandos Kings Cross
04/09/2026,10:00:00,Direct Debit,PureGym Limited,Gym,-44.99,GBP,PureGym Direct Debit
04/09/2026,14:20:00,Card Payment,Uniqlo Oxford Street,Shopping,-59.90,GBP,Uniqlo UK`,

  barclays: `Date,Account Number,Sub Account,Number,Memo,Amount
01/09/2026,12345678,01,001,ACME CORP SALARY PAYROLL,3850.00
01/09/2026,12345678,01,002,RESIDENTIAL LETTINGS RENT,-1200.00
02/09/2026,12345678,01,003,BRITISH GAS ENERGY DIRECT DEBIT,-135.50
03/09/2026,12345678,01,004,SAINSBURYS S/MKTS GROCERIES,-88.20
04/09/2026,12345678,01,005,EE MOBILE BROADBAND DIRECT DEBIT,-55.00`,

  chase: `Date,Description,Category,Type,Amount
02/09/2026,UBER TRIP LONDON,Transport,Sale,-18.40
03/09/2026,AMAZON UK MARKETPLACE,Shopping,Sale,-34.99
03/09/2026,PRET A MANGER LONDON,Food & Drink,Sale,-6.80
04/09/2026,FREELANCE DESIGN SPRINT INVOICE,Income,Deposit,450.00
04/09/2026,SPOTIFY FAMILY SUBSCRIPTION,Entertainment,Sale,-17.99`
};
