import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, formatMoney, getMonthExpenses, getWeekExpenses, getTotalSpent, getCategoryTotals } from '../store';
import StatCard from '../components/StatCard';
import TransactionCard from '../components/TransactionCard';
import ResetModal from '../components/ResetModal';
import IncomeSourcesModal from '../components/IncomeSourcesModal';
import { DollarSign, TrendingDown, Target, CreditCard, ArrowRight, Flame, Zap, Plus, RotateCcw } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { format, eachDayOfInterval, subDays } from 'date-fns';

const CHART_COLORS = ['#1b4332','#2d6a4f','#40916c','#52b788','#d97706','#0ea5e9','#e11d48','#7c3aed'];

export default function Dashboard() {
  const { state, dispatch } = useApp();
  const { expenses, categories, budgets, monthlyIncome } = state;
  const navigate = useNavigate();
  const [showReset, setShowReset] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);

  const monthExp  = useMemo(() => getMonthExpenses(expenses), [expenses]);
  const weekExp   = useMemo(() => getWeekExpenses(expenses), [expenses]);
  const monthTotal = useMemo(() => getTotalSpent(monthExp), [monthExp]);
  const weekTotal  = useMemo(() => getTotalSpent(weekExp), [weekExp]);
  const savings    = monthlyIncome - monthTotal;
  const savingsPct = monthlyIncome > 0 ? ((savings / monthlyIncome) * 100).toFixed(1) : 0;

  const catTotals = useMemo(() => getCategoryTotals(monthExp, categories), [monthExp, categories]);

  const dailyData = useMemo(() => {
    const days = eachDayOfInterval({ start: subDays(new Date(), 29), end: new Date() });
    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const total = expenses
        .filter(e => e.date === dayStr)
        .reduce((s, e) => s + e.amount, 0);
      return { date: format(day, 'MMM d'), total };
    });
  }, [expenses]);

  const weeklyData = useMemo(() => {
    const days = eachDayOfInterval({ start: subDays(new Date(), 6), end: new Date() });
    return days.map(day => {
      const dayStr = format(day, 'yyyy-MM-dd');
      const total = expenses
        .filter(e => e.date === dayStr)
        .reduce((s, e) => s + e.amount, 0);
      return { day: format(day, 'EEE'), total };
    });
  }, [expenses]);

  const alerts = useMemo(() => {
    return budgets.map(b => {
      const spent = monthExp.filter(e => e.category === b.category).reduce((s, e) => s + e.amount, 0);
      const pct = (spent / b.limit) * 100;
      return { ...b, spent, pct };
    }).filter(b => b.pct >= 80).sort((a, b) => b.pct - a.pct);
  }, [budgets, monthExp]);

  const recent = expenses.slice(0, 5);

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-[#ffffff] border border-[#d5ded7] rounded-xl px-4 py-2.5 shadow-lg">
        <p className="text-xs text-[#6e8074] font-medium mb-0.5">{label}</p>
        <p className="text-sm font-extrabold text-[#1b4332]">{formatMoney(payload[0].value)}</p>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14261c] tracking-tight">Dashboard</h1>
            <span className="text-[11px] font-semibold text-[#1b4332] bg-[#eaf4ee] border border-[#cce3d5] px-2.5 py-0.5 rounded-full">
              Live
            </span>
          </div>
          <p className="text-[#65776c] text-sm mt-0.5 font-medium">{format(new Date(), 'MMMM yyyy')} overview</p>
        </div>
        
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setShowReset(true)}
            className="flex items-center gap-1.5 px-3 py-2.5 bg-[#ffffff] hover:bg-[#f8f7f2] border border-[#e7e4da] text-[#65776c] hover:text-[#991b1b] rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
            title="Reset or clear data"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
          
          <button
            onClick={() => navigate('/add')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1b4332] hover:bg-[#245740] active:scale-98 text-white rounded-xl text-sm font-bold shadow-md shadow-[#1b4332]/25 transition-all cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.8} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Top Spending Hero Card + Supporting Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Monthly Spending"
          value={formatMoney(monthTotal)}
          sub="Updated today"
          icon={TrendingDown}
          color="#1b4332"
          trend={-12}
          isHero={true}
        />
        <div onClick={() => setShowIncomeModal(true)} className="cursor-pointer transition-transform active:scale-98">
          <StatCard
            label="Monthly Income"
            value={formatMoney(monthlyIncome)}
            sub="Tap to manage sources"
            icon={DollarSign}
            color="#2d6a4f"
          />
        </div>
        <StatCard
          label="Net Savings"
          value={formatMoney(Math.max(0, savings))}
          sub={`${savingsPct}% of total income`}
          icon={Target}
          color="#40916c"
          trend={8}
        />
        <StatCard
          label="Spent This Week"
          value={formatMoney(weekTotal)}
          sub="Past 7 days"
          icon={CreditCard}
          color="#1b4332"
          trend={-5}
        />
      </div>

      {/* Budget Alerts */}
      {alerts.length > 0 && (
        <div className="rounded-2xl bg-[#fff7ed] border border-[#fed7aa] p-4 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Flame size={16} className="text-[#c2410c]" />
            <span className="text-sm font-bold text-[#9a3412]">Budget Alerts</span>
            <span className="text-xs bg-[#ffedd5] text-[#9a3412] px-2 py-0.5 rounded-full font-semibold ml-auto">
              {alerts.length} categories near cap
            </span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {alerts.map(a => {
              const cat = categories.find(c => c.id === a.category);
              return (
                <div key={a.id} className="flex items-center gap-3 bg-[#ffffff] rounded-xl p-3 border border-[#fed7aa]/60 shadow-xs">
                  <span className="text-2xl">{cat?.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#1b2b22] truncate">{cat?.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex-1 h-2 bg-[#f3ede0] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, a.pct)}%`,
                            backgroundColor: a.pct >= 100 ? '#dc2626' : '#ea580c'
                          }}
                        />
                      </div>
                      <span className={`text-xs font-bold ${a.pct >= 100 ? 'text-[#dc2626]' : 'text-[#ea580c]'}`}>
                        {a.pct.toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-[11px] text-[#718578] font-medium mt-0.5">{formatMoney(a.spent)} of {formatMoney(a.limit)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl bg-[#ffffff] border border-[#e7e4da] p-5 shadow-[0_2px_12px_rgba(27,67,50,0.03)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#14261c]">30-Day Spending Trend</h2>
              <p className="text-xs text-[#6e8074] mt-0.5 font-medium">Daily expense trajectory this past month</p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#1b4332] bg-[#eaf4ee] border border-[#cce3d5] font-semibold px-2.5 py-1 rounded-full">
              <Zap size={12} className="stroke-[2.5]" />
              Live Feed
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={dailyData} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="forestGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2d6a4f" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#2d6a4f" stopOpacity={0.01} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: '#7d8e84', fontSize: 10 }} tickLine={false} axisLine={false} interval={6} />
              <YAxis tick={{ fill: '#7d8e84', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `$${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="total" stroke="#1b4332" strokeWidth={2.5} fill="url(#forestGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl bg-[#ffffff] border border-[#e7e4da] p-5 shadow-[0_2px_12px_rgba(27,67,50,0.03)] flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#14261c] mb-0.5">Category Distribution</h2>
            <p className="text-xs text-[#6e8074] mb-3 font-medium">Top categories this month</p>
          </div>
          <div className="relative">
            <ResponsiveContainer width="100%" height={170}>
              <PieChart>
                <Pie data={catTotals.slice(0, 6)} dataKey="amount" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={42} paddingAngle={3}>
                  {catTotals.slice(0, 6).map((entry, i) => (
                    <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => formatMoney(v)}
                  contentStyle={{ background: '#ffffff', border: '1px solid #d5ded7', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 mt-2">
            {catTotals.slice(0, 4).map((c, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                <span className="text-[#5b6c62] flex-1 truncate font-medium">{c.name}</span>
                <span className="font-bold text-[#14261c]">{formatMoney(c.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly preview in soft cream & forest green bars */}
      <div className="rounded-2xl bg-[#ffffff] border border-[#e7e4da] p-5 shadow-[0_2px_12px_rgba(27,67,50,0.03)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#14261c]">This Week's Spending</h2>
            <p className="text-xs text-[#6e8074] font-medium">Daily distribution over the last 7 days</p>
          </div>
          <span className="text-xs font-bold text-[#1b4332] bg-[#eaf4ee] px-3 py-1 rounded-full border border-[#cce3d5]">
            {formatMoney(weekTotal)} total
          </span>
        </div>
        <div className="grid grid-cols-7 gap-2 sm:gap-3">
          {weeklyData.map((d, i) => {
            const max = Math.max(...weeklyData.map(x => x.total), 1);
            const pct = (d.total / max) * 100;
            const isToday = i === weeklyData.length - 1;
            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <span className={`text-[11px] font-bold ${d.total > 0 ? 'text-[#1b4332]' : 'text-[#a3b3a8]'}`}>
                  {d.total > 0 ? `$${Math.round(d.total)}` : '—'}
                </span>
                <div className="w-full flex flex-col justify-end h-24 bg-[#f3efe5] rounded-xl overflow-hidden p-0.5">
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      isToday
                        ? 'bg-gradient-to-t from-[#1b4332] to-[#2d6a4f] shadow-sm'
                        : 'bg-[#52b788]'
                    }`}
                    style={{ height: `${pct}%`, minHeight: d.total > 0 ? '8px' : '0' }}
                  />
                </div>
                <span className={`text-xs font-bold ${isToday ? 'text-[#1b4332]' : 'text-[#7d8f84]'}`}>
                  {d.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-2xl bg-[#ffffff] border border-[#e7e4da] p-5 shadow-[0_2px_12px_rgba(27,67,50,0.03)]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#14261c]">Recent Transactions</h2>
            <p className="text-xs text-[#6e8074] font-medium">Your latest logged expenses</p>
          </div>
          <button
            onClick={() => navigate('/expenses')}
            className="flex items-center gap-1 text-xs font-bold text-[#1b4332] hover:text-[#2d6a4f] transition-colors"
          >
            <span>View all</span>
            <ArrowRight size={13} />
          </button>
        </div>
        <div className="space-y-2.5">
          {recent.map(exp => (
            <TransactionCard
              key={exp.id}
              expense={exp}
              categories={categories}
              onDelete={(id) => dispatch({ type: 'DELETE_EXPENSE', payload: id })}
            />
          ))}
        </div>
      </div>

      <ResetModal isOpen={showReset} onClose={() => setShowReset(false)} />

      {showIncomeModal && (
        <IncomeSourcesModal onClose={() => setShowIncomeModal(false)} />
      )}
    </div>
  );
}
