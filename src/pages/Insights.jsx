import { useState, useMemo } from 'react';
import { useApp, formatMoney, getMonthExpenses, getCategoryTotals, getTotalSpent } from '../store';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { format, subMonths, eachDayOfInterval, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';
import { TrendingDown, TrendingUp, Lightbulb } from 'lucide-react';

const CHART_COLORS = ['#1b4332','#2d6a4f','#40916c','#52b788','#d97706','#0284c7','#e11d48','#7c3aed','#0d9488','#eab308'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#ffffff] border border-[#d5ded7] rounded-xl px-4 py-2.5 shadow-lg">
      <p className="text-xs text-[#6e8074] font-medium mb-0.5">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-extrabold" style={{ color: p.color || '#1b4332' }}>
          {formatMoney(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function Insights() {
  const { state } = useApp();
  const { expenses, categories, monthlyIncome } = state;
  const [period, setPeriod] = useState('month');

  const now = new Date();

  const monthlyBreakdown = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(now, 5 - i);
      const monthExp = getMonthExpenses(expenses, date);
      const totals = {};
      monthExp.forEach(e => { totals[e.category] = (totals[e.category] || 0) + e.amount; });
      return {
        month: format(date, 'MMM'),
        total: monthExp.reduce((s, e) => s + e.amount, 0),
        ...totals,
      };
    });
  }, [expenses]);

  const monthExp  = useMemo(() => getMonthExpenses(expenses), [expenses]);
  const catTotals = useMemo(() => getCategoryTotals(monthExp, categories), [monthExp, categories]);
  const totalSpent = useMemo(() => getTotalSpent(monthExp), [monthExp]);
  const savings   = Math.max(0, monthlyIncome - totalSpent);

  const dailyData = useMemo(() => {
    const start = startOfMonth(now);
    const end   = endOfMonth(now);
    const days  = eachDayOfInterval({ start, end });
    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const total  = expenses.filter(e => e.date === dayStr).reduce((s, e) => s + e.amount, 0);
      return { day: format(day, 'd'), total };
    });
  }, [expenses]);

  // Savings potential calculation
  const savingsPotential = useMemo(() => {
    const suggestions = [];

    const foodTotal = monthExp.filter(e => e.category === 'food').reduce((s, e) => s + e.amount, 0);
    if (foodTotal > 300) suggestions.push({ category: '🍔 Food & Dining', current: foodTotal, target: 300, saving: foodTotal - 300 });

    const entTotal  = monthExp.filter(e => e.category === 'entertainment').reduce((s, e) => s + e.amount, 0);
    if (entTotal > 80) suggestions.push({ category: '🎬 Entertainment', current: entTotal, target: 80, saving: entTotal - 80 });

    const subTotal  = monthExp.filter(e => e.category === 'subscriptions').reduce((s, e) => s + e.amount, 0);
    if (subTotal > 50) suggestions.push({ category: '📱 Subscriptions', current: subTotal, target: 50, saving: subTotal - 50 });

    const shopTotal = monthExp.filter(e => e.category === 'shopping').reduce((s, e) => s + e.amount, 0);
    if (shopTotal > 150) suggestions.push({ category: '🛍️ Shopping', current: shopTotal, target: 150, saving: shopTotal - 150 });

    return suggestions;
  }, [monthExp]);

  const totalPotentialSaving = savingsPotential.reduce((s, p) => s + p.saving, 0);
  const topCats = catTotals.slice(0, 6);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14261c] tracking-tight">Insights & Analytics</h1>
          <p className="text-[#65776c] text-sm mt-0.5 font-medium">Deep dive into your financial habits and trends</p>
        </div>
        <div className="flex gap-1.5 bg-[#ffffff] border border-[#e7e4da] rounded-xl p-1 shadow-2xs self-start sm:self-auto">
          {['month', 'week'].map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all capitalize cursor-pointer ${
                period === p ? 'bg-[#1b4332] text-white shadow-xs' : 'text-[#6e8074] hover:text-[#1b4332]'
              }`}
            >
              {p === 'month' ? 'Monthly View' : 'Weekly View'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {[
          { label: 'Total Spent',    value: formatMoney(totalSpent), color: '#991b1b', bg: 'bg-[#fef2f2]', icon: TrendingDown },
          { label: 'Net Saved',      value: formatMoney(savings), color: '#1b4332', bg: 'bg-[#eaf4ee]', icon: TrendingUp },
          { label: 'Active Categories', value: catTotals.length, color: '#2d6a4f', bg: 'bg-[#f0f7f3]', icon: null },
          { label: 'Transactions',   value: monthExp.length, color: '#15803d', bg: 'bg-[#edf7f0]', icon: null },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-2xl bg-[#ffffff] border border-[#e7e4da] p-3 sm:p-4 shadow-xs">
            <p className="text-[10px] sm:text-xs text-[#6e8074] mb-1 font-bold uppercase tracking-wider">{label}</p>
            <p className="text-lg sm:text-2xl font-extrabold truncate" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-[#eaf4ee] border border-[#cce3d5] p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#1b4332] flex items-center justify-center text-white shadow-sm">
            <Lightbulb size={20} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#143928]">Estimated Savings Potential</h2>
            <p className="text-xs text-[#406e57] font-medium">
              You could save an estimated <strong className="text-[#143928] font-bold text-sm">{formatMoney(totalPotentialSaving)}/month</strong> by optimizing variable categories
            </p>
          </div>
        </div>

        {savingsPotential.length === 0 ? (
          <p className="text-xs text-[#406e57] font-medium py-2">Your spending is currently optimal! Keep up the great work.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
            {savingsPotential.map((s, i) => (
              <div key={i} className="rounded-2xl bg-[#ffffff] border border-[#d2e7d8] p-4 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#14261c] truncate">{s.category}</span>
                  <span className="text-[11px] text-[#1b4332] font-bold bg-[#eaf4ee] px-2 py-0.5 rounded-full border border-[#cce3d5]">
                    Save {formatMoney(s.saving)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#65776c] font-medium">
                  <span>Current: <strong className="text-[#991b1b]">{formatMoney(s.current)}</strong></span>
                  <span>Target: <strong className="text-[#1b4332]">{formatMoney(s.target)}</strong></span>
                </div>
                <div className="mt-2.5 h-2 bg-[#f3efe5] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2d6a4f] rounded-full"
                    style={{ width: `${Math.min((s.target / s.current) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="lg:col-span-2 rounded-2xl bg-[#ffffff] border border-[#e7e4da] p-5 shadow-[0_2px_12px_rgba(27,67,50,0.03)] flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#14261c] mb-0.5">Category Breakdown</h2>
            <p className="text-xs text-[#6e8074] mb-4 font-medium">Distribution for current cycle</p>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <PieChart>
              <Pie data={catTotals} dataKey="amount" nameKey="name" cx="50%" cy="50%" outerRadius={85} innerRadius={48} paddingAngle={2}>
                {catTotals.map((entry, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatMoney(v)} contentStyle={{ background: '#ffffff', border: '1px solid #d5ded7', borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {catTotals.slice(0, 5).map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="text-[#55695e] flex-1 truncate font-medium">{c.icon} {c.name}</span>
                <span className="font-bold text-[#14261c]">{formatMoney(c.amount)}</span>
                <span className="text-[#809186] font-semibold text-[11px] w-9 text-right">{totalSpent > 0 ? ((c.amount / totalSpent) * 100).toFixed(0) : 0}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 rounded-2xl bg-[#ffffff] border border-[#e7e4da] p-5 shadow-[0_2px_12px_rgba(27,67,50,0.03)] flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#14261c] mb-0.5">Top Spending Categories</h2>
            <p className="text-xs text-[#6e8074] mb-4 font-medium">Largest outflows ranked</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topCats} layout="vertical" margin={{ left: 10, right: 20, top: 0, bottom: 0 }}>
              <XAxis type="number" tick={{ fill: '#7d8e84', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `€${v}`} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#55695e', fontSize: 11, fontWeight: 600 }} tickLine={false} axisLine={false} width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
                {topCats.map((entry, i) => (
                  <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl bg-[#ffffff] border border-[#e7e4da] p-5 shadow-[0_2px_12px_rgba(27,67,50,0.03)]">
        <h2 className="text-sm font-bold text-[#14261c] mb-0.5">Daily Spending Rhythm — {format(now, 'MMMM yyyy')}</h2>
        <p className="text-xs text-[#6e8074] mb-4 font-medium">Day-by-day fluctuation</p>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={dailyData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="insightsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#2d6a4f" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e4da" />
            <XAxis dataKey="day" tick={{ fill: '#7d8e84', fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: '#7d8e84', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `€${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="total" stroke="#1b4332" strokeWidth={2.5} fill="url(#insightsGrad)" dot={{ fill: '#1b4332', r: 3 }} activeDot={{ r: 5 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-2xl bg-[#ffffff] border border-[#e7e4da] p-5 shadow-[0_2px_12px_rgba(27,67,50,0.03)]">
        <h2 className="text-sm font-bold text-[#14261c] mb-0.5">6-Month Trend</h2>
        <p className="text-xs text-[#6e8074] mb-4 font-medium">Historical monthly expenses comparison</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyBreakdown} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e7e4da" />
            <XAxis dataKey="month" tick={{ fill: '#7d8e84', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: '#7d8e84', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `€${v}`} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" fill="#2d6a4f" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
