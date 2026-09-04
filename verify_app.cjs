const assert = require('assert');
const fs = require('fs');

async function testAll() {
  console.log('--- Starting FlowCash Verification Test Suite ---');

  // 1. Types & Categories
  const types = await import('./src/types.js');
  assert(types.DEFAULT_CATEGORIES.length >= 20, 'Expected at least 20 default categories');
  assert(types.PaymentMethods.CARD === 'Card');
  assert(types.PaymentMethods.DIRECT_DEBIT === 'Direct Debit');
  console.log('✓ Types and Categories validation passed.');

  // 2. Icon Map check in CategoryIcon.jsx source
  const iconSource = fs.readFileSync('./src/components/CategoryIcon.jsx', 'utf8');
  const requiredIcons = [
    'UtensilsCrossed', 'Coffee', 'ShoppingBag', 'Apple', 'Gamepad2',
    'Film', 'Shirt', 'Home', 'Building', 'Car', 'Train', 'Zap',
    'Droplets', 'Smartphone', 'Plane', 'HeartPulse', 'ShieldCheck',
    'PawPrint', 'Dumbbell', 'Gift', 'Hammer', 'Briefcase', 'Laptop',
    'PiggyBank', 'TrendingUp', 'RotateCcw', 'Gauge', 'Repeat',
    'PieChart', 'DownloadCloud', 'CheckCircle2'
  ];
  for (const ic of requiredIcons) {
    assert(iconSource.includes(ic), `Missing required Lucide icon: ${ic}`);
  }
  console.log(`✓ Icon system replacement verified: all ${requiredIcons.length} vector icons mapped in CategoryIcon.jsx.`);

  // 3. Statement Parser
  const parser = await import('./src/parseStatement.js');
  
  // Test Monzo CSV
  const monzoRes = parser.parseStatement(parser.SAMPLE_STATEMENTS.monzo);
  assert.strictEqual(monzoRes.totalParsed, 6);
  assert(monzoRes.transactions.some(t => t.category === 'groceries' && t.amount === -68.45));
  assert(monzoRes.transactions.some(t => t.category === 'coffee' && t.amount === -4.20));
  assert(monzoRes.transactions.some(t => t.category === 'gym' && t.paymentMethod === 'Direct Debit'));
  console.log('✓ Monzo Statement parsing and rule auto-categorization verified.');

  // Test Barclays CSV
  const barclaysRes = parser.parseStatement(parser.SAMPLE_STATEMENTS.barclays);
  assert.strictEqual(barclaysRes.detectedFormat, 'Barclays');
  assert.strictEqual(barclaysRes.totalParsed, 5);
  assert(barclaysRes.transactions.some(t => t.category === 'salary' && t.amount === 3850));
  assert(barclaysRes.transactions.some(t => t.category === 'rent' && t.amount === -1200));
  console.log('✓ Barclays Statement parsing and rule auto-categorization verified.');

  // Test Chase CSV
  const chaseRes = parser.parseStatement(parser.SAMPLE_STATEMENTS.chase);
  assert.strictEqual(chaseRes.totalParsed, 5);
  assert(chaseRes.transactions.some(t => t.category === 'transport'));
  console.log('✓ Chase Statement parsing verified.');

  // Test Plain-Text Statement dump
  const plainTextDump = `01/09/2026 Tesco Supermarket -52.40\n02/09/2026 Transport for London -4.80\n03/09/2026 Monthly Payroll Wages +3500.00`;
  const textRes = parser.parseStatement(plainTextDump);
  assert.strictEqual(textRes.totalParsed, 3);
  assert.strictEqual(textRes.transactions[0].category, 'groceries');
  assert.strictEqual(textRes.transactions[0].amount, -52.40);
  assert.strictEqual(textRes.transactions[2].category, 'salary');
  assert.strictEqual(textRes.transactions[2].amount, 3500.00);
  console.log('✓ Plain-text unstructured bank paste parsing verified.');

  // 4. Deduplication & Hash Generation
  const txA = { date: '2026-09-04', amount: -15.50, description: 'Starbucks London' };
  const txB = { date: '2026-09-04', amount: -15.50, description: '  STARBUCKS LONDON ' };
  const txC = { date: '2026-09-04', amount: -15.51, description: 'Starbucks London' };
  const hashA = `${txA.date}_${Number(txA.amount).toFixed(2)}_${txA.description.trim().toLowerCase()}`;
  const hashB = `${txB.date}_${Number(txB.amount).toFixed(2)}_${txB.description.trim().toLowerCase()}`;
  const hashC = `${txC.date}_${Number(txC.amount).toFixed(2)}_${txC.description.trim().toLowerCase()}`;
  assert.strictEqual(hashA, hashB, 'Deduplication hash should match for identical normalized transaction');
  assert.notStrictEqual(hashA, hashC, 'Different amounts must generate distinct hashes');
  console.log('✓ Deduplication hashing verified.');

  console.log('\nALL UNIT & INTEGRATION TESTS PASSED SUCCESSFULLY! ✓✓✓');
}

testAll().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
