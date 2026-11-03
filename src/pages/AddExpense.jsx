import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store';
import { v4 as uuidv4 } from 'uuid';
import { CheckCircle, RefreshCw, Calendar, Tag, FileText, ChevronLeft, Plus } from 'lucide-react';
import { format } from 'date-fns';

export default function AddExpense() {
  const { state, dispatch } = useApp();
  const { categories } = state;
  const navigate = useNavigate();

  const today = format(new Date(), 'yyyy-MM-dd');
  const [form, setForm] = useState({
    description: '',
    amount: '',
    category: 'food',
    date: today,
    notes: '',
    recurring: false,
  });
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.amount || isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0) e.amount = 'Enter a valid amount';
    if (!form.date) e.date = 'Date is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    dispatch({
      type: 'ADD_EXPENSE',
      payload: { ...form, id: uuidv4(), amount: parseFloat(form.amount) }
    });

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setForm({ description: '', amount: '', category: 'food', date: today, notes: '', recurring: false });
    }, 1800);
  };

  const selectedCat = categories.find(c => c.id === form.category);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 rounded-xl text-[#5b6c62] hover:text-[#1b4332] bg-[#ffffff] border border-[#e7e4da] hover:bg-[#f3f0e6] transition-colors shadow-xs"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-[#14261c] tracking-tight">Add Expense</h1>
          <p className="text-[#65776c] text-xs sm:text-sm mt-0.5 font-medium">Record a new payment or purchase</p>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-3 bg-[#eaf4ee] border border-[#a3d4b6] rounded-2xl px-5 py-4 text-[#1b4332] shadow-sm animate-fade-in">
          <CheckCircle size={22} className="text-[#2d6a4f] shrink-0" />
          <div>
            <p className="font-bold text-sm text-[#143928]">Expense successfully logged!</p>
            <p className="text-xs text-[#406e57] mt-0.5">Your balances and analytics have been updated.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-3xl bg-gradient-to-br from-[#133928] via-[#1b4332] to-[#2d6a4f] border border-[#2d6a4f]/50 p-6 sm:p-8 text-center text-white shadow-xl shadow-[#1b4332]/20 relative overflow-hidden">
          <p className="text-xs font-bold text-[#a0cfb2] uppercase tracking-wider mb-2">Total Amount Spent</p>
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <span className="text-3xl sm:text-4xl font-light text-[#86bfa0]">€</span>
            <input
              type="number"
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              autoFocus
              className="text-4xl sm:text-5xl font-extrabold text-white bg-transparent border-none outline-none w-56 text-center placeholder-white/30 focus:ring-0"
            />
          </div>
          {errors.amount && <p className="text-[#fca5a5] text-xs mt-2 font-semibold">{errors.amount}</p>}
        </div>

        <div className="bg-[#ffffff] border border-[#e7e4da] p-5 rounded-2xl shadow-xs space-y-4">
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-[#55695e] uppercase tracking-wider mb-2">
              <FileText size={14} className="text-[#1b4332]" />
              Description
            </label>
            <input
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="e.g. Organic Groceries, Coffee, Uber ride..."
              className={`w-full bg-[#f8f7f2] border ${errors.description ? 'border-[#dc2626]' : 'border-[#e4dfd3]'} rounded-xl px-4 py-3 text-sm text-[#14261c] placeholder-[#94a399] focus:outline-none focus:border-[#1b4332] focus:bg-[#ffffff] transition-all`}
            />
            {errors.description && <p className="text-[#dc2626] text-xs mt-1.5 font-medium">{errors.description}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="flex items-center gap-2 text-xs font-bold text-[#55695e] uppercase tracking-wider">
                <Tag size={14} className="text-[#1b4332]" />
                Category
              </label>
              <button
                type="button"
                onClick={() => navigate('/categories')}
                className="text-xs font-bold text-[#1b4332] hover:text-[#2d6a4f] bg-[#eaf4ee] hover:bg-[#d8edd0] border border-[#cce3d5] px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Plus size={13} strokeWidth={2.8} />
                <span>Add / Manage</span>
              </button>
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
              {categories.map(cat => {
                const isSelected = form.category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => set('category', cat.id)}
                    className={`flex flex-col items-center gap-1.5 p-2.5 sm:p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#1b4332] bg-[#eaf4ee] text-[#1b4332] shadow-xs'
                        : 'border-[#e9e5db] bg-[#fdfcf9] hover:border-[#ccd7cf] hover:bg-[#f6f4ed]'
                    }`}
                  >
                    <span className="text-xl sm:text-2xl">{cat.icon}</span>
                    <span className={`text-[10px] font-bold leading-tight truncate w-full ${isSelected ? 'text-[#1b4332]' : 'text-[#6e8074]'}`}>
                      {cat.name.split(' ')[0]}
                    </span>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => navigate('/categories')}
                className="flex flex-col items-center justify-center gap-1 p-2.5 sm:p-3 rounded-xl border border-dashed border-[#1b4332]/40 bg-[#eaf4ee]/50 hover:bg-[#eaf4ee] text-[#1b4332] transition-colors cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#1b4332] text-white flex items-center justify-center">
                  <Plus size={16} strokeWidth={2.8} />
                </div>
                <span className="text-[10px] font-bold leading-tight text-[#1b4332]">
                  New
                </span>
              </button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-[#55695e] uppercase tracking-wider mb-2">
                <Calendar size={14} className="text-[#1b4332]" />
                Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={e => set('date', e.target.value)}
                className="w-full bg-[#f8f7f2] border border-[#e4dfd3] rounded-xl px-4 py-3 text-sm text-[#14261c] focus:outline-none focus:border-[#1b4332] focus:bg-[#ffffff]"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs font-bold text-[#55695e] uppercase tracking-wider mb-2">
                <FileText size={14} className="text-[#1b4332]" />
                Notes (Optional)
              </label>
              <input
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                placeholder="Details, receipt notes..."
                className="w-full bg-[#f8f7f2] border border-[#e4dfd3] rounded-xl px-4 py-3 text-sm text-[#14261c] placeholder-[#94a399] focus:outline-none focus:border-[#1b4332] focus:bg-[#ffffff]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#f8f7f2] border border-[#e8e4da] mt-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#eaf4ee] border border-[#cce3d5] flex items-center justify-center text-[#1b4332]">
                <RefreshCw size={16} className="stroke-[2.5]" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-[#14261c]">Recurring Expense</p>
                <p className="text-[11px] text-[#6e8074]">Subscription or regular monthly payment</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => set('recurring', !form.recurring)}
              className={`relative w-12 h-6.5 rounded-full transition-all duration-200 focus:outline-none cursor-pointer ${
                form.recurring ? 'bg-[#1b4332]' : 'bg-[#d8d3c5]'
              }`}
            >
              <div
                className={`absolute top-0.75 left-0.75 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                  form.recurring ? 'translate-x-5.5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {form.description && form.amount && (
          <div className="rounded-2xl bg-[#ffffff] border border-[#e8e4da] p-4 shadow-xs">
            <p className="text-[11px] font-bold text-[#718578] uppercase tracking-wider mb-2.5">Live Preview</p>
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: (selectedCat?.color || '#1b4332') + '22', border: `1px solid ${(selectedCat?.color || '#1b4332')}44` }}
              >
                {selectedCat?.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[#14261c] truncate">{form.description}</p>
                <p className="text-xs text-[#6e8074]">{selectedCat?.name} · {form.date}</p>
              </div>
              <span className="text-base font-extrabold text-[#991b1b]">
                -${parseFloat(form.amount || 0).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3.5 bg-[#1b4332] hover:bg-[#245740] active:scale-98 text-white font-extrabold rounded-2xl transition-all shadow-lg shadow-[#1b4332]/25 text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus size={18} strokeWidth={2.8} />
          <span>Save Expense</span>
        </button>
      </form>
    </div>
  );
}
