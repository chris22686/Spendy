import { useState, useMemo, useEffect } from 'react';
import { useApp, formatMoney } from '../store';
import TransactionCard from '../components/TransactionCard';
import { Search, X, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

function formatGroupDate(dateStr) {
  try {
    if (!dateStr) return 'Unknown Date';
    const safe = dateStr.includes('T') ? dateStr : `${dateStr}T00:00:00`;
    const d = new Date(safe);
    if (!isNaN(d.getTime())) return format(d, 'EEEE, MMMM d, yyyy');
  } catch {}
  return dateStr;
}

export default function Expenses() {
  const { state, dispatch } = useApp();
  const { expenses, categories } = state;
  const navigate = useNavigate();
  const [search, setSearch]   = useState('');
  const [catFilter, setCat]   = useState('all');
  const [sortBy, setSort]     = useState('date');
  const [editExp, setEditExp] = useState(null);

  const filtered = useMemo(() => {
    let list = [...expenses];
    if (search) list = list.filter(e => e.description.toLowerCase().includes(search.toLowerCase()) || e.notes?.toLowerCase().includes(search.toLowerCase()));
    if (catFilter !== 'all') list = list.filter(e => e.category === catFilter);
    if (sortBy === 'date')   list.sort((a, b) => new Date(b.date) - new Date(a.date));
    if (sortBy === 'amount') list.sort((a, b) => b.amount - a.amount);
    if (sortBy === 'name')   list.sort((a, b) => a.description.localeCompare(b.description));
    return list;
  }, [expenses, search, catFilter, sortBy]);

  const grouped = useMemo(() => {
    if (sortBy !== 'date') return null;
    const groups = {};
    filtered.forEach(e => {
      if (!groups[e.date]) groups[e.date] = [];
      groups[e.date].push(e);
    });
    return groups;
  }, [filtered, sortBy]);

  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14261c] tracking-tight">Expenses</h1>
          <p className="text-[#65776c] text-sm mt-0.5 font-medium">{filtered.length} transactions · {formatMoney(totalFiltered)} total</p>
        </div>
        <button
          onClick={() => navigate('/add')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#1b4332] hover:bg-[#245740] active:scale-98 text-white rounded-xl text-sm font-bold shadow-md shadow-[#1b4332]/25 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} strokeWidth={2.8} />
          <span>Add Expense</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
        <div className="relative flex-1 min-w-0">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7d8f84]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search transactions..."
            className="w-full bg-[#ffffff] border border-[#e7e4da] rounded-xl pl-10 pr-9 py-2.5 text-base sm:text-sm text-[#14261c] placeholder-[#94a399] focus:outline-none focus:border-[#1b4332] shadow-2xs"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#809186] hover:text-[#1b4332] cursor-pointer">
              <X size={15} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={catFilter}
            onChange={e => setCat(e.target.value)}
            className="flex-1 sm:flex-initial bg-[#ffffff] border border-[#e7e4da] rounded-xl px-3 sm:px-3.5 py-2.5 text-base sm:text-sm font-medium text-[#14261c] focus:outline-none focus:border-[#1b4332] cursor-pointer shadow-2xs"
          >
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>

          <select
            value={sortBy}
            onChange={e => setSort(e.target.value)}
            className="flex-1 sm:flex-initial bg-[#ffffff] border border-[#e7e4da] rounded-xl px-3 sm:px-3.5 py-2.5 text-base sm:text-sm font-medium text-[#14261c] focus:outline-none focus:border-[#1b4332] cursor-pointer shadow-2xs"
          >
            <option value="date">Sort: Date</option>
            <option value="amount">Sort: Amount</option>
            <option value="name">Sort: Name</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#6e8074] bg-[#ffffff] rounded-2xl border border-[#e7e4da]">
          <span className="text-4xl mb-3">🔍</span>
          <p className="font-bold text-[#14261c]">No expenses found</p>
          <p className="text-xs text-[#809186] mt-1">Try adjusting your filters or search terms</p>
        </div>
      ) : grouped ? (
        <div className="space-y-6">
          {Object.entries(grouped).sort(([a], [b]) => new Date(b) - new Date(a)).map(([date, exps]) => (
            <div key={date}>
              <div className="flex items-center justify-between mb-3 px-1">
                <h3 className="text-xs font-bold text-[#55695e] uppercase tracking-wider">
                  {formatGroupDate(date)}
                </h3>
                <span className="text-xs font-bold text-[#1b4332] bg-[#eaf4ee] px-2.5 py-0.5 rounded-full border border-[#cce3d5]">
                  {formatMoney(exps.reduce((s, e) => s + e.amount, 0))}
                </span>
              </div>
              <div className="space-y-2.5">
                {exps.map(exp => (
                  <TransactionCard
                    key={exp.id}
                    expense={exp}
                    categories={categories}
                    onDelete={(id) => dispatch({ type: 'DELETE_EXPENSE', payload: id })}
                    onClick={setEditExp}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map(exp => (
            <TransactionCard
              key={exp.id}
              expense={exp}
              categories={categories}
              onDelete={(id) => dispatch({ type: 'DELETE_EXPENSE', payload: id })}
              onClick={setEditExp}
            />
          ))}
        </div>
      )}

      {editExp && (
        <ExpenseModal
          expense={editExp}
          categories={categories}
          onSave={(updated) => { dispatch({ type: 'UPDATE_EXPENSE', payload: updated }); setEditExp(null); }}
          onClose={() => setEditExp(null)}
        />
      )}
    </div>
  );
}

function ExpenseModal({ expense, categories, onSave, onClose }) {
  const [form, setForm] = useState({
    ...expense,
    amount: expense.amount !== undefined ? expense.amount.toString() : '',
  });
  const [error, setError] = useState('');
  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setError('');
  };

  useEffect(() => {
    document.body.dataset.modalOpen = 'true';
    return () => {
      delete document.body.dataset.modalOpen;
    };
  }, []);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!form.description?.trim()) {
      setError('Please enter a description');
      return;
    }
    const val = parseFloat(form.amount);
    if (isNaN(val) || val <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }
    if (!form.date) {
      setError('Please choose a valid date');
      return;
    }
    onSave({
      ...form,
      description: form.description.trim(),
      amount: val,
    });
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/50 backdrop-blur-xs z-50 overflow-y-auto px-4 modal-backdrop-safe flex flex-col items-center justify-start sm:justify-center">
      <div
        className="my-auto w-full max-w-md bg-[#ffffff] border border-[#e4dfd3] rounded-3xl p-5 sm:p-6 shadow-2xl modal-card-safe overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <h2 className="text-base sm:text-lg font-bold text-[#14261c]">Edit Expense</h2>
          <button onClick={onClose} className="text-[#7d8f84] hover:text-[#14261c] p-1 cursor-pointer"><X size={18}/></button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#55695e] mb-1.5 block uppercase tracking-wider">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={e => set('description', e.target.value)}
              onFocus={() => window.scrollTo(0, 0)}
              className="w-full bg-[#f8f7f2] border border-[#e4dfd3] rounded-xl px-4 py-2.5 text-base sm:text-sm text-[#14261c] focus:outline-none focus:border-[#1b4332]"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-[#55695e] mb-1.5 block uppercase tracking-wider">Amount (€)</label>
              <input
                type="number"
                step="any"
                min="0"
                value={form.amount}
                onChange={e => set('amount', e.target.value)}
                onFocus={() => window.scrollTo(0, 0)}
                placeholder="0.00"
                className="w-full bg-[#f8f7f2] border border-[#e4dfd3] rounded-xl px-4 py-2.5 text-base sm:text-sm text-[#14261c] focus:outline-none focus:border-[#1b4332]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#55695e] mb-1.5 block uppercase tracking-wider">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={e => set('date', e.target.value)}
                className="w-full bg-[#f8f7f2] border border-[#e4dfd3] rounded-xl px-4 py-2.5 text-base sm:text-sm text-[#14261c] focus:outline-none focus:border-[#1b4332]"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-[#55695e] mb-1.5 block uppercase tracking-wider">Category</label>
            <select
              value={form.category}
              onChange={e => set('category', e.target.value)}
              className="w-full bg-[#f8f7f2] border border-[#e4dfd3] rounded-xl px-4 py-2.5 text-base sm:text-sm text-[#14261c] focus:outline-none focus:border-[#1b4332]"
            >
              {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-[#55695e] mb-1.5 block uppercase tracking-wider">Notes (optional)</label>
            <input
              value={form.notes||''}
              onChange={e => set('notes', e.target.value)}
              onFocus={() => window.scrollTo(0, 0)}
              placeholder="Receipt details..."
              className="w-full bg-[#f8f7f2] border border-[#e4dfd3] rounded-xl px-4 py-2.5 text-base sm:text-sm text-[#14261c] focus:outline-none focus:border-[#1b4332]"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer py-1">
            <div className={`w-11 h-6 rounded-full transition-colors relative ${form.recurring ? 'bg-[#1b4332]' : 'bg-[#d8d3c5]'}`}
              onClick={() => set('recurring', !form.recurring)}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${form.recurring ? 'translate-x-5' : ''}`} />
            </div>
            <span className="text-sm font-semibold text-[#14261c]">Recurring expense</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-[#e4dfd3] text-sm font-semibold text-[#65776c] hover:bg-[#f8f7f2] cursor-pointer">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#245740] text-sm font-bold text-white shadow-md shadow-[#1b4332]/25 cursor-pointer">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}
