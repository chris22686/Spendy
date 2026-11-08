import { useState, useMemo, useEffect } from 'react';
import { useApp, formatMoney, getMonthExpenses, getCategoryById } from '../store';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Pencil, Trash2, X, AlertTriangle, CheckCircle, TrendingUp, Settings2, Wallet } from 'lucide-react';
import IncomeSourcesModal from '../components/IncomeSourcesModal';

export default function Budgets() {
  const { state, dispatch } = useApp();
  const { expenses, categories, budgets, monthlyIncome, incomeSources } = state;
  const [showForm, setShowForm] = useState(false);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [editBudget, setEditBudget] = useState(null);
  const [income, setIncome] = useState(monthlyIncome.toString());

  const monthExp = useMemo(() => getMonthExpenses(expenses), [expenses]);

  const budgetsWithSpent = useMemo(() =>
    budgets.map(b => {
      const spent = monthExp.filter(e => e.category === b.category).reduce((s, e) => s + e.amount, 0);
      const pct = Math.min((spent / b.limit) * 100, 100);
      const remaining = b.limit - spent;
      const cat = getCategoryById(categories, b.category);
      return { ...b, spent, pct, remaining, cat };
    }).sort((a, b) => b.pct - a.pct)
  , [budgets, monthExp, categories]);

  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent  = budgetsWithSpent.reduce((s, b) => s + b.spent, 0);
  const overBudget  = budgetsWithSpent.filter(b => b.pct >= 100).length;
  const warningBudget = budgetsWithSpent.filter(b => b.pct >= 80 && b.pct < 100).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14261c] tracking-tight">Budgets</h1>
          <p className="text-[#65776c] text-sm mt-0.5 font-medium">{budgets.length} budget limits configured</p>
        </div>
        <button
          onClick={() => { setEditBudget(null); setShowForm(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1b4332] hover:bg-[#245740] active:scale-98 text-white rounded-xl text-sm font-bold shadow-md shadow-[#1b4332]/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} strokeWidth={2.8} />
          <span>Add Budget</span>
        </button>
      </div>

      <div className="rounded-2xl bg-[#ffffff] border border-[#e7e4da] p-5 shadow-[0_2px_12px_rgba(27,67,50,0.03)]">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <Wallet size={18} className="text-[#1b4332]" />
              <p className="text-sm font-bold text-[#14261c]">Monthly Expected Income</p>
            </div>
            <p className="text-xs text-[#6e8074] mt-0.5 font-medium">
              {incomeSources && incomeSources.length > 0
                ? `${incomeSources.length} income sources configured (salary, 15-day pay, transfers)`
                : 'Used to calculate target limits & savings rate'}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => setShowIncomeModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#eaf4ee] hover:bg-[#d9ede0] border border-[#cde2d6] rounded-xl text-xs font-bold text-[#1b4332] transition-colors cursor-pointer"
            >
              <Settings2 size={14} />
              <span>Manage Categories / Sources</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7d8f84] text-sm font-bold">€</span>
                <input
                  type="number"
                  value={monthlyIncome}
                  readOnly
                  onClick={() => setShowIncomeModal(true)}
                  className="w-32 bg-[#f8f7f2] border border-[#e4dfd3] rounded-xl pl-7 pr-3 py-2 text-sm font-bold text-[#14261c] text-right cursor-pointer focus:outline-none"
                  title="Click to manage income categories"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Total Allocated Budget', value: formatMoney(totalBudget), color: '#1b4332', bg: 'bg-[#eaf4ee]', border: 'border-[#cce3d5]' },
          { label: 'Total Spent This Month', value: formatMoney(totalSpent), color: '#991b1b', bg: 'bg-[#fef2f2]', border: 'border-[#fecaca]' },
          { label: 'Remaining Balance', value: formatMoney(Math.max(0, totalBudget - totalSpent)), color: '#15803d', bg: 'bg-[#f0fdf4]', border: 'border-[#bbf7d0]' },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} className={`rounded-2xl bg-[#ffffff] border ${border} p-4 shadow-xs`}>
            <p className="text-xs text-[#6e8074] font-bold uppercase tracking-wider mb-1">{label}</p>
            <p className="text-2xl font-extrabold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {(overBudget > 0 || warningBudget > 0) && (
        <div className="flex gap-3 flex-wrap">
          {overBudget > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#fee2e2] border border-[#fca5a5] text-[#991b1b] text-xs font-bold shadow-2xs">
              <AlertTriangle size={15} />
              <span>{overBudget} budget limit{overBudget > 1 ? 's' : ''} exceeded</span>
            </div>
          )}
          {warningBudget > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ffedd5] border border-[#fed7aa] text-[#9a3412] text-xs font-bold shadow-2xs">
              <AlertTriangle size={15} />
              <span>{warningBudget} budget{warningBudget > 1 ? 's' : ''} near 80% threshold</span>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {budgetsWithSpent.map(b => {
          const isOver    = b.pct >= 100;
          const isWarning = b.pct >= 80 && !isOver;
          const barColor  = isOver ? '#dc2626' : isWarning ? '#ea580c' : '#1b4332';

          return (
            <div key={b.id} className={`rounded-2xl p-5 border transition-all group bg-[#ffffff] ${
              isOver    ? 'border-[#fecaca] shadow-[0_2px_12px_rgba(220,38,38,0.06)]' :
              isWarning ? 'border-[#fed7aa] shadow-[0_2px_12px_rgba(234,88,12,0.06)]' :
              'border-[#e8e4da] hover:border-[#cbd7cf] shadow-[0_2px_12px_rgba(27,67,50,0.03)]'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 shadow-xs"
                    style={{ backgroundColor: (b.cat.color || '#1b4332') + '18', border: `1px solid ${(b.cat.color || '#1b4332')}33` }}
                  >
                    {b.cat.icon}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#14261c]">{b.cat.name}</p>
                    <p className="text-xs text-[#718578] capitalize font-medium">{b.period} limit</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => { setEditBudget(b); setShowForm(true); }}
                    className="p-1.5 rounded-lg text-[#5b6c62] hover:text-[#1b4332] bg-[#f8f7f2] border border-[#e8e4da] hover:bg-[#eaf4ee] cursor-pointer"
                    title="Edit budget limit"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'DELETE_BUDGET', payload: b.id })}
                    className="p-1.5 rounded-lg text-[#991b1b] bg-[#fef2f2] border border-[#fecaca] hover:bg-[#fee2e2] cursor-pointer"
                    title="Delete budget limit"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#55695e] font-medium">
                    {formatMoney(b.spent)} <span className="text-[#88998e]">of</span> {formatMoney(b.limit)}
                  </span>
                  <span className={`font-bold ${isOver ? 'text-[#dc2626]' : isWarning ? 'text-[#ea580c]' : 'text-[#1b4332]'}`}>
                    {b.pct.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2.5 bg-[#f3efe5] rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${b.pct}%`, backgroundColor: barColor }}
                  />
                </div>
                <p className={`text-xs font-bold ${b.remaining >= 0 ? 'text-[#1b4332]' : 'text-[#dc2626]'}`}>
                  {b.remaining >= 0 ? `${formatMoney(b.remaining)} remaining` : `${formatMoney(Math.abs(b.remaining))} over limit`}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {showForm && (
        <BudgetModal
          initial={editBudget}
          categories={categories}
          onSave={(b) => {
            dispatch({ type: 'SET_BUDGET', payload: editBudget ? b : { ...b, id: uuidv4() } });
            setShowForm(false);
          }}
          onClose={() => setShowForm(false)}
        />
      )}

      {showIncomeModal && (
        <IncomeSourcesModal onClose={() => setShowIncomeModal(false)} />
      )}
    </div>
  );
}

function BudgetModal({ initial, categories, onSave, onClose }) {
  const [form, setForm] = useState(initial || { category: categories[0]?.id || '', limit: '', period: 'monthly' });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    document.body.dataset.modalOpen = 'true';
    const keepTop = () => {
      if (window.scrollY !== 0) {
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('scroll', keepTop, { passive: true });
    return () => {
      delete document.body.dataset.modalOpen;
      window.removeEventListener('scroll', keepTop);
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#000000]/50 backdrop-blur-xs z-50 overflow-y-auto px-4 modal-backdrop-safe flex flex-col items-center justify-start sm:justify-center">
      <div
        className="my-auto w-full max-w-md bg-[#ffffff] border border-[#e4dfd3] rounded-3xl p-5 sm:p-6 shadow-2xl modal-card-safe overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h2 className="text-base sm:text-lg font-bold text-[#14261c]">{initial ? 'Edit' : 'New'} Budget</h2>
          <button onClick={onClose} className="text-[#7d8f84] hover:text-[#14261c] p-1 cursor-pointer"><X size={18}/></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#55695e] uppercase tracking-wider mb-1.5 block">Category</label>
            <select
              value={form.category}
              onChange={e => set('category', e.target.value)}
              className="w-full bg-[#f8f7f2] border border-[#e4dfd3] rounded-xl px-4 py-2.5 text-base sm:text-sm text-[#14261c] focus:outline-none focus:border-[#1b4332]"
            >
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-[#55695e] uppercase tracking-wider mb-1.5 block">Budget Limit (€)</label>
            <input
              type="number"
              value={form.limit}
              onChange={e => set('limit', e.target.value)}
              onFocus={() => window.scrollTo(0, 0)}
              placeholder="0.00"
              className="w-full bg-[#f8f7f2] border border-[#e4dfd3] rounded-xl px-4 py-2.5 text-base sm:text-sm text-[#14261c] focus:outline-none focus:border-[#1b4332]"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-[#55695e] uppercase tracking-wider mb-1.5 block">Period</label>
            <div className="flex gap-2">
              {['weekly','monthly'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => set('period', p)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all capitalize cursor-pointer ${
                    form.period === p ? 'bg-[#1b4332] text-white shadow-xs' : 'bg-[#f8f7f2] border border-[#e4dfd3] text-[#55695e]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-[#e4dfd3] text-sm font-semibold text-[#65776c] hover:bg-[#f8f7f2] cursor-pointer">Cancel</button>
          <button onClick={() => onSave({ ...form, limit: parseFloat(form.limit) || 0 })} className="flex-1 px-4 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#245740] text-sm font-bold text-white shadow-md shadow-[#1b4332]/25 cursor-pointer">
            {initial ? 'Save Changes' : 'Create Budget'}
          </button>
        </div>
      </div>
    </div>
  );
}
