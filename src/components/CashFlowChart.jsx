import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { Calendar, TrendingUp, DollarSign } from 'lucide-react';

export default function CashFlowChart({ transactions = [] }) {
  const [timeframe, setTimeframe] = useState('monthly'); // 'monthly' | 'quarterly'

  const chartData = useMemo(() => {
    // Collect transactions by month
    const monthMap = {};
    const now = new Date();

    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' });
      monthMap[key] = {
        key,
        label,
        inflow: 0,
        outflow: 0,
        net: 0,
      };
    }

    transactions.forEach(t => {
      const ym = t.date.substring(0, 7);
      if (monthMap[ym]) {
        const amt = Number(t.amount);
        if (amt > 0) {
          monthMap[ym].inflow += amt;
        } else {
          monthMap[ym].outflow += Math.abs(amt);
        }
        monthMap[ym].net += amt;
      }
    });

    const monthlyList = Object.values(monthMap);

    if (timeframe === 'quarterly') {
      // Group by quarters (Q2, Q3, etc.)
      const quarterMap = {};
      monthlyList.forEach(m => {
        const [year, month] = m.key.split('-');
        const qNum = Math.ceil(parseInt(month) / 3);
        const qKey = `Q${qNum} ${year}`;
        if (!quarterMap[qKey]) {
          quarterMap[qKey] = { label: qKey, inflow: 0, outflow: 0, net: 0 };
        }
        quarterMap[qKey].inflow += m.inflow;
        quarterMap[qKey].outflow += m.outflow;
        quarterMap[qKey].net += m.net;
      });
      return Object.values(quarterMap);
    }

    return monthlyList;
  }, [transactions, timeframe]);

  // Total summary for displayed period
  const totalInflow = chartData.reduce((sum, d) => sum + d.inflow, 0);
  const totalOutflow = chartData.reduce((sum, d) => sum + d.outflow, 0);
  const netPosition = totalInflow - totalOutflow;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const inflow = payload.find(p => p.dataKey === 'inflow')?.value || 0;
      const outflow = payload.find(p => p.dataKey === 'outflow')?.value || 0;
      const net = inflow - outflow;

      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-xl border border-slate-700 shadow-xl backdrop-blur-md text-xs min-w-[170px]">
          <div className="font-semibold text-slate-300 pb-1.5 border-b border-slate-800 mb-2">
            {label}
          </div>
          <div className="space-y-1.5 font-mono">
            <div className="flex justify-between items-center text-emerald-400">
              <span className="font-sans text-slate-400">Inflow:</span>
              <span>+£{inflow.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center text-rose-400">
              <span className="font-sans text-slate-400">Outflow:</span>
              <span>-£{outflow.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-center pt-1.5 border-t border-slate-800 font-semibold">
              <span className="font-sans text-slate-300">Net Flow:</span>
              <span className={net >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {net >= 0 ? '+' : ''}£{net.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Cash Flow Dynamics
            </h3>
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              Live
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Periodic comparison of money coming in vs going out
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-medium">
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeframe === 'monthly'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeframe('quarterly')}
              className={`px-3 py-1 rounded-lg transition-all ${
                timeframe === 'quarterly'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Quarterly
            </button>
          </div>
        </div>
      </div>

      <div className="w-full h-64 min-h-[250px] mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(v) => `£${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }} />
            <Bar dataKey="inflow" name="Inflow" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={36} />
            <Bar dataKey="outflow" name="Outflow" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex flex-col">
          <span className="text-slate-400 dark:text-slate-500 text-[11px]">Period Inflow</span>
          <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
            +£{totalInflow.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-400 dark:text-slate-500 text-[11px]">Period Outflow</span>
          <span className="font-mono font-semibold text-rose-500 dark:text-rose-400">
            -£{totalOutflow.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-400 dark:text-slate-500 text-[11px]">Net Surplus</span>
          <span className={`font-mono font-semibold ${netPosition >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {netPosition >= 0 ? '+' : ''}£{netPosition.toLocaleString('en-GB', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </span>
        </div>
      </div>
    </div>
  );
}
