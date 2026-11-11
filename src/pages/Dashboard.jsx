import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp, formatMoney, getMonthExpenses, getWeekExpenses, getTotalSpent, getCategoryTotals } from '../store';
import StatCard from '../components/StatCard';
import TransactionCard from '../components/TransactionCard';
import ResetModal from '../components/ResetModal';
import IncomeSourcesModal from '../components/IncomeSourcesModal';
import AdjustBalanceModal from '../components/AdjustBalanceModal';
import NotificationModal from '../components/NotificationModal';
import QuickAddModal from '../components/QuickAddModal';
import { v4 as uuidv4 } from 'uuid';
import { DollarSign, TrendingDown, Target, CreditCard, ArrowRight, Flame, Zap, Plus, RotateCcw, Wallet, Bell, Pencil, CheckCircle, X } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { format, eachDayOfInterval, subDays } from 'date-fns';

const CHART_COLORS = ['#1b4332','#2d6a4f','#40916c','#52b788','#d97706','#0ea5e9','#e11d48','#7c3aed'];

export default function Dashboard({ onOpenPaydayPrompt }) {
  const { state, dispatch } = useApp();
  const { expenses, categories, budgets, monthlyIncome, userName, paydaySettings, currentBalance = 0, quickPresets = [] } = state;
  const navigate = useNavigate();
  const [showReset, setShowReset] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [quickToast, setQuickToast] = useState(null);
  const [lastAddedId, setLastAddedId] = useState(null);

  useEffect(() => {
    if (!quickToast) return;
    const timer = setTimeout(() => {
      setQuickToast(null);
    }, 3800);
    return () => clearTimeout(timer);
  }, [quickToast]);

  const handleQuickAdd = (preset) => {
    const newId = uuidv4();
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const cat = categories.find(c => c.id === preset.category) || { name: 'Expense', icon: preset.icon || '💸' };

    dispatch({
      type: 'ADD_EXPENSE',
      payload: {
        id: newId,
        amount: Number(preset.amount) || 0,
        category: preset.category,
        description: preset.title,
        date: todayStr,
        notes: 'Logged via 1-Tap Quick Add',
        recurring: false,
      },
    });

    setLastAddedId(newId);
    setQuickToast({
      id: newId,
      title: preset.title,
      icon: preset.icon || cat.icon || '💸',
      amount: Number(preset.amount) || 0,
      categoryName: cat.name,
    });
  };

  const handleUndoQuickAdd = () => {
    if (lastAddedId) {
      dispatch({ type: 'DELETE_EXPENSE', payload: lastAddedId });
      setQuickToast(null);
      setLastAddedId(null);
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14261c] tracking-tight">
              {userName ? `Hi, ${userName}` : 'Dashboard'}
            </h1>
            <span className="text-[11px] font-semibold text-[#1b4332] bg-[#eaf4ee] border border-[#cce3d5] px-2.5 py-0.5 rounded-full">
              Live
            </span>
          </div>
          <p className="text-[#65776c] text-xs sm:text-sm mt-0.5 font-medium">{format(new Date(), 'MMMM yyyy')} overview</p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap w-full sm:w-auto">
          {paydaySettings?.isVariable && (
            <button
              onClick={onOpenPaydayPrompt}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 bg-[#eaf4ee] hover:bg-[#d8edd0] border border-[#cce3d5] text-[#1b4332] rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
              title="Record paycheck"
            >
              <span>🎉</span>
              <span className="truncate">Payday Check-In</span>
            </button>
          )}

          <button
            onClick={() => setShowNotifModal(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 bg-[#ffffff] hover:bg-[#f8f7f2] border border-[#e7e4da] text-[#65776c] hover:text-[#1b4332] rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
            title="Notification Reminders"
          >
            <Bell size={14} />
            <span>Alerts</span>
          </button>

          <button
            onClick={() => setShowReset(true)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 sm:py-2.5 bg-[#ffffff] hover:bg-[#f8f7f2] border border-[#e7e4da] text-[#65776c] hover:text-[#991b1b] rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
            title="Reset or clear data"
          >
            <RotateCcw size={14} />
            <span>Reset</span>
          </button>
          
          <button
            onClick={() => navigate('/add')}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#1b4332] hover:bg-[#245740] active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-[#1b4332]/25 transition-all cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.8} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Top Balance Hero Card + Supporting Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div onClick={() => setShowBalanceModal(true)} data-testid="current-balance-card" className="cursor-pointer transition-transform active:scale-98">
          <StatCard
            label="Current Balance"
            value={formatMoney(currentBalance)}
            sub="Tap to adjust funds"
            icon={Wallet}
            color="#1b4332"
            isHero={true}
          />
        </div>
        <StatCard
          label="Total Monthly Spending"
          value={formatMoney(monthTotal)}
          sub="Updated today"
          icon={TrendingDown}
          color="#2d6a4f"
          trend={-12}
        />
        <div onClick={() => setShowIncomeModal(true)} className="cursor-pointer transition-transform active:scale-98">
          <StatCard
            label="Monthly Income"
            value={formatMoney(monthlyIncome)}
            sub="Tap to manage sources"
            icon={DollarSign}
            color="#40916c"
          />
        </div>
        <StatCard
          label="Spent This Week"
          value={formatMoney(weekTotal)}
          sub="Past 7 days"
          icon={CreditCard}
          color="#52b788"
          trend={-5}
        />
      </div>

      {/* Floating 1-Tap Confirmation Toast */}
      {quickToast && (
        <aside
          role="status"
          aria-live="polite"
          aria-label="Quick expense logged"
          className="fixed top-4 left-3 right-3 sm:left-auto sm:right-6 sm:w-[380px] z-[999] bg-[#ffffff] border-2 border-[#1b4332] rounded-2xl p-4 shadow-2xl shadow-[#1b4332]/25 transition-all duration-300 animate-fade-in"
          style={{ top: 'calc(env(safe-area-inset-top, 0px) + 16px)' }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eaf4ee] border border-[#a3d4b6] flex items-center justify-center text-xl shrink-0 shadow-xs">
              {quickToast.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-black text-[#1b4332] uppercase tracking-wider">
                <CheckCircle size={14} className="text-[#2d6a4f]" />
                <span>1-Tap Expense Added!</span>
              </div>
              <p className="text-sm font-extrabold text-[#14261c] truncate mt-0.5">
                {quickToast.title}
              </p>
              <p className="text-xs text-[#52685b] mt-0.5">
                <span className="font-bold text-[#991b1b]">-{formatMoney(quickToast.amount)}</span> · {quickToast.categoryName}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setQuickToast(null)}
              className="p-1 text-[#8fa296] hover:text-[#1b4332] rounded-lg transition-colors cursor-pointer -mr-1 -mt-1"
              title="Dismiss notification"
            >
              <X size={16} />
            </button>
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-[#f0ece1] flex items-center justify-between gap-2">
            <span className="text-[11px] text-[#718578] font-medium">Balance updated</span>
            <button
              type="button"
              onClick={handleUndoQuickAdd}
              className="px-3 py-1 rounded-lg bg-[#fee2e2] hover:bg-[#fed7d7] text-[#991b1b] text-xs font-extrabold transition-colors cursor-pointer active:scale-95"
            >
              Undo
            </button>
          </div>
        </aside>
      )}

      {/* 1-Tap Quick Add Shortcuts */}
      <div className="rounded-3xl bg-[#ffffff] border border-[#e7e4da] p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-[#eaf4ee] text-[#1b4332] flex items-center justify-center shadow-2xs">
              <Zap size={15} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-[#14261c] tracking-tight">1-Tap Quick Add</h2>
              <p className="text-[11px] text-[#6e8074]">Tap any shortcut to log an expense instantly</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowQuickAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f8f7f2] hover:bg-[#eae6db] border border-[#e4dfd3] text-xs font-bold text-[#55695e] hover:text-[#1b4332] transition-all cursor-pointer"
            title="Customize quick shortcuts"
          >
            <Pencil size={12} />
            <span>Customize</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {(quickPresets || []).map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handleQuickAdd(preset)}
              className="flex items-center gap-2.5 p-3 rounded-2xl border border-[#e4dfd3] bg-[#f8f7f2] hover:bg-[#eaf4ee] hover:border-[#b8ddc6] active:scale-95 transition-all text-left group cursor-pointer shadow-2xs"
            >
              <span className="text-2xl shrink-0 group-hover:scale-110 transition-transform">
                {preset.icon || '☕'}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-extrabold text-[#14261c] truncate">
                  {preset.title}
                </p>
                <p className="text-xs font-black text-[#1b4332] truncate">
                  {formatMoney(preset.amount)}
                </p>
              </div>
            </button>
          ))}
        </div>
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
              <YAxis tick={{ fill: '#7d8e84', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `€${v}`} />
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
        <div className="grid grid-cols-7 gap-1 sm:gap-2 md:gap-3">
          {weeklyData.map((d, i) => {
            const max = Math.max(...weeklyData.map(x => x.total), 1);
            const pct = (d.total / max) * 100;
            const isToday = i === weeklyData.length - 1;
            return (
              <div key={i} className="flex flex-col items-center gap-1.5 sm:gap-2">
                <span className={`text-[9px] sm:text-[11px] font-bold truncate max-w-full ${d.total > 0 ? 'text-[#1b4332]' : 'text-[#a3b3a8]'}`}>
                  {d.total > 0 ? `€${Math.round(d.total)}` : '—'}
                </span>
                <div className="w-full flex flex-col justify-end h-20 sm:h-24 bg-[#f3efe5] rounded-xl overflow-hidden p-0.5">
                  <div
                    className={`w-full rounded-lg transition-all duration-500 ${
                      isToday
                        ? 'bg-gradient-to-t from-[#1b4332] to-[#2d6a4f] shadow-sm'
                        : 'bg-[#52b788]'
                    }`}
                    style={{ height: `${pct}%`, minHeight: d.total > 0 ? '8px' : '0' }}
                  />
                </div>
                <span className={`text-[10px] sm:text-xs font-bold ${isToday ? 'text-[#1b4332]' : 'text-[#7d8f84]'}`}>
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

      <AdjustBalanceModal isOpen={showBalanceModal} onClose={() => setShowBalanceModal(false)} />
      <NotificationModal isOpen={showNotifModal} onClose={() => setShowNotifModal(false)} />
      <QuickAddModal isOpen={showQuickAddModal} onClose={() => setShowQuickAddModal(false)} />
    </div>
  );
}
