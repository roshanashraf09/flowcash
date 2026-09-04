import React, { useState, useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import CategoryIcon from './CategoryIcon';

export default function CategoryDonutChart({ transactions = [], categories = [] }) {
  const [filterMonth, setFilterMonth] = useState('current'); // 'current' | 'all'
  const [activeCategory, setActiveCategory] = useState(null);

  const categoryLookup = useMemo(() => {
    const map = {};
    categories.forEach(c => {
      map[c.id] = c;
    });
    return map;
  }, [categories]);

  const { chartData, totalExpenses } = useMemo(() => {
    const now = new Date();
    const curYm = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const catTotals = {};
    let total = 0;

    transactions.forEach(t => {
      // Only consider expenses (amount < 0)
      if (t.amount >= 0) return;
      if (filterMonth === 'current' && !t.date.startsWith(curYm)) return;

      const catId = t.category || 'shopping';
      const amt = Math.abs(Number(t.amount));
      catTotals[catId] = (catTotals[catId] || 0) + amt;
      total += amt;
    });

    const data = Object.entries(catTotals).map(([catId, value]) => {
      const catMeta = categoryLookup[catId] || {
        label: catId,
        color: '#94a3b8',
        icon: 'ShoppingBag',
      };
      const percentage = total > 0 ? (value / total) * 100 : 0;
      return {
        id: catId,
        name: catMeta.label,
        value,
        color: catMeta.color || '#10b981',
        icon: catMeta.icon || 'ShoppingBag',
        percentage,
      };
    });

    data.sort((a, b) => b.value - a.value);

    return { chartData: data, totalExpenses: total };
  }, [transactions, filterMonth, categoryLookup]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-xl border border-slate-700 shadow-xl backdrop-blur-md text-xs min-w-[150px]">
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            <span className="font-semibold text-slate-200">{data.name}</span>
          </div>
          <div className="font-mono text-sm font-bold text-white mb-0.5">
            £{data.value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-[11px] text-slate-400">
            {data.percentage.toFixed(1)}% of total spending
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Expense Breakdown
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Spending distribution by category
          </p>
        </div>

        <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
          <button
            onClick={() => setFilterMonth('current')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              filterMonth === 'current'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setFilterMonth('all')}
            className={`px-2.5 py-1 rounded-md transition-all ${
              filterMonth === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-slate-400 text-xs">
          <p>No expense data recorded for this period.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center flex-1">
          {/* Donut Chart with Center Total */}
          <div className="relative w-full h-52 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  onMouseEnter={(_, idx) => setActiveCategory(chartData[idx])}
                  onMouseLeave={() => setActiveCategory(null)}
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={`cell-${entry.id}`}
                      fill={entry.color}
                      stroke="transparent"
                      className="cursor-pointer transition-opacity hover:opacity-80"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Centered label inside donut hole */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 dark:text-slate-500">
                {activeCategory ? activeCategory.name : 'Total Spent'}
              </span>
              <span className="font-mono text-sm font-bold text-slate-900 dark:text-white truncate max-w-[120px]">
                £{(activeCategory ? activeCategory.value : totalExpenses).toLocaleString('en-GB', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })}
              </span>
              {activeCategory && (
                <span className="text-[10px] font-medium text-emerald-500">
                  {activeCategory.percentage.toFixed(1)}%
                </span>
              )}
            </div>
          </div>

          {/* Top Category Legend List */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {chartData.slice(0, 6).map((item) => (
              <div
                key={item.id}
                onMouseEnter={() => setActiveCategory(item)}
                onMouseLeave={() => setActiveCategory(null)}
                className={`flex items-center justify-between p-1.5 rounded-xl transition-all cursor-pointer ${
                  activeCategory?.id === item.id
                    ? 'bg-slate-100 dark:bg-slate-800'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <CategoryIcon name={item.icon} color={item.color} size="xs" />
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-mono font-semibold text-slate-900 dark:text-slate-100">
                    £{item.value.toFixed(2)}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 w-10 text-right">
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
