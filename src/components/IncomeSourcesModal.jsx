import { useState, useEffect } from 'react';
import { useApp, formatMoney, FREQUENCY_LABELS, calculateMonthlyIncomeFromSources } from '../store';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Pencil, Trash2, X, Wallet, Sparkles } from 'lucide-react';

const INCOME_ICONS = ['💼', '🏦', '💸', '💰', '💵', '🤝', '📈', '🎁', '🧑‍💻', '🏠', '⚡', '📦'];
const INCOME_COLORS = ['#1b4332', '#2d6a4f', '#40916c', '#52b788', '#059669', '#0d9488', '#0284c7', '#4f46e5', '#7c3aed', '#c026d3', '#d97706'];

export default function IncomeSourcesModal({ onClose }) {
  const { state, dispatch } = useApp();
  const sources = state.incomeSources || [];

  const [editingSource, setEditingSource] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('bi-weekly');
  const [icon, setIcon] = useState('💼');
  const [color, setColor] = useState('#1b4332');
  const [error, setError] = useState('');

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

  const openNewForm = () => {
    setEditingSource(null);
    setName('');
    setAmount('');
    setFrequency('bi-weekly');
    setIcon('💼');
    setColor('#1b4332');
    setError('');
    setShowForm(true);
  };

  const openEditForm = (s) => {
    setEditingSource(s);
    setName(s.name);
    setAmount(s.amount.toString());
    setFrequency(s.frequency || 'monthly');
    setIcon(s.icon || '💼');
    setColor(s.color || '#1b4332');
    setError('');
    setShowForm(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!name.trim()) {
      setError('Please enter a name or source label');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const payload = {
      id: editingSource ? editingSource.id : uuidv4(),
      name: name.trim(),
      amount: parsedAmount,
      frequency,
      icon,
      color,
    };

    if (editingSource) {
      dispatch({ type: 'UPDATE_INCOME_SOURCE', payload });
    } else {
      dispatch({ type: 'ADD_INCOME_SOURCE', payload });
    }

    setShowForm(false);
    setEditingSource(null);
    setName('');
    setAmount('');
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_INCOME_SOURCE', payload: id });
  };

  const totalCalculated = Math.round(calculateMonthlyIncomeFromSources(sources));

  return (
    <div className="fixed inset-0 bg-[#000000]/55 backdrop-blur-xs z-50 overflow-y-auto px-4 modal-backdrop-safe flex flex-col items-center justify-start sm:justify-center">
      <div
        className="my-auto w-full max-w-xl bg-[#ffffff] border border-[#e4dfd3] rounded-3xl shadow-2xl overflow-hidden flex flex-col modal-card-safe animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 p-4 sm:p-5 border-b border-[#eeebe2] flex items-center justify-between bg-[#fbfaf6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1b4332]/10 border border-[#1b4332]/20 flex items-center justify-center text-[#1b4332]">
              <Wallet size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-[#14261c] leading-tight">Expected Income Categories</h2>
              <p className="text-xs text-[#6e8074] font-medium">Split your salary, 15-day paychecks, transfers & freelance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f0eee6] hover:bg-[#e4dfd3] flex items-center justify-center text-[#55695e] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Total Monthly Banner */}
        <div className="shrink-0 px-4 sm:px-5 py-3 bg-[#eaf4ee] border-b border-[#cde2d6] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#1b4332]" />
            <span className="text-xs font-bold text-[#1b4332] uppercase tracking-wider">Calculated Monthly Total:</span>
          </div>
          <span className="text-lg sm:text-xl font-extrabold text-[#1b4332]">{formatMoney(totalCalculated)}</span>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          {showForm ? (
            <form onSubmit={handleSave} className="bg-[#f8f7f2] border border-[#e4dfd3] rounded-2xl p-4 sm:p-4.5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-[#14261c]">
                  {editingSource ? 'Edit Income Category' : 'Add New Income Source'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-xs font-bold text-[#6e8074] hover:text-[#14261c] cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {error && (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-[#55695e] uppercase tracking-wider mb-1 block">
                  Category / Source Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15th Paycheck, Side Gig, Mom sent money"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => window.scrollTo(0, 0)}
                  className="w-full bg-[#ffffff] border border-[#dcd7cb] rounded-xl px-3.5 py-2.5 text-base sm:text-sm font-semibold text-[#14261c] focus:outline-none focus:border-[#1b4332]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#55695e] uppercase tracking-wider mb-1 block">
                    Amount (€)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7d8f84] text-sm font-bold">€</span>
                    <input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      onFocus={() => window.scrollTo(0, 0)}
                      className="w-full bg-[#ffffff] border border-[#dcd7cb] rounded-xl pl-7 pr-3 py-2 text-base sm:text-sm font-bold text-[#14261c] focus:outline-none focus:border-[#1b4332]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#55695e] uppercase tracking-wider mb-1 block">
                    Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full bg-[#ffffff] border border-[#dcd7cb] rounded-xl px-3 py-2 text-base sm:text-sm font-semibold text-[#14261c] focus:outline-none focus:border-[#1b4332]"
                  >
                    <option value="bi-weekly">Every 15 Days (Bi-Weekly × 2)</option>
                    <option value="monthly">Monthly (Once a month)</option>
                    <option value="weekly">Weekly (Weekly × 52 ÷ 12)</option>
                    <option value="one_time">One-Time / Transfer</option>
                  </select>
                </div>
              </div>

              {/* Icon Selector */}
              <div>
                <label className="text-xs font-bold text-[#55695e] uppercase tracking-wider mb-1 block">
                  Icon
                </label>
                <div className="flex gap-2 flex-wrap bg-[#ffffff] p-2 rounded-xl border border-[#dcd7cb]">
                  {INCOME_ICONS.map((ic) => (
                    <button
                      key={ic}
                      type="button"
                      onClick={() => setIcon(ic)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform cursor-pointer ${
                        icon === ic ? 'bg-[#1b4332] text-white scale-110 shadow-xs' : 'hover:bg-[#f1efe8]'
                      }`}
                    >
                      {ic}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Selector */}
              <div>
                <label className="text-xs font-bold text-[#55695e] uppercase tracking-wider mb-1 block">
                  Color Accent
                </label>
                <div className="flex gap-2 flex-wrap">
                  {INCOME_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer ${
                        color === c ? 'ring-2 ring-offset-2 ring-[#1b4332] scale-110' : 'opacity-80 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#65776c] hover:bg-[#ece8df] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#1b4332] hover:bg-[#245740] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  {editingSource ? 'Save Changes' : 'Add Source'}
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={openNewForm}
              className="w-full py-3 border-2 border-dashed border-[#1b4332]/30 hover:border-[#1b4332] rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-[#1b4332] bg-[#f8f7f2] hover:bg-[#eef5f0] transition-colors cursor-pointer"
            >
              <Plus size={16} strokeWidth={2.8} />
              <span>Add Income Source / Category</span>
            </button>
          )}

          {/* List of Income Sources */}
          <div className="space-y-2.5">
            {sources.length === 0 ? (
              <div className="text-center py-8 text-[#7d8f84] text-xs">
                No income categories configured. Add your salary or money transfers above.
              </div>
            ) : (
              sources.map((s) => {
                let monthlyEquivalent = Number(s.amount) || 0;
                if (s.frequency === 'bi-weekly') monthlyEquivalent = (Number(s.amount) || 0) * 2;
                else if (s.frequency === 'weekly') monthlyEquivalent = ((Number(s.amount) || 0) * 52) / 12;

                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-[#ffffff] border border-[#e8e4da] hover:border-[#cbd7cf] shadow-2xs transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ backgroundColor: `${s.color || '#1b4332'}18`, border: `1px solid ${s.color || '#1b4332'}33` }}
                      >
                        {s.icon || '💼'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#14261c] truncate">{s.name}</p>
                        <p className="text-xs text-[#6e8074] font-medium">
                          {FREQUENCY_LABELS[s.frequency] || s.frequency} • <span className="font-semibold text-[#1b4332]">{formatMoney(s.amount)}</span>
                          {s.frequency !== 'monthly' && s.frequency !== 'one_time' && (
                            <span className="text-[#899c90]"> (≈ {formatMoney(Math.round(monthlyEquivalent))}/mo)</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => openEditForm(s)}
                        className="w-8 h-8 rounded-xl bg-[#f8f7f2] hover:bg-[#e4dfd3] flex items-center justify-center text-[#55695e] transition-colors cursor-pointer"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="w-8 h-8 rounded-xl bg-[#fee2e2]/60 hover:bg-[#fee2e2] flex items-center justify-center text-[#dc2626] transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 p-4 border-t border-[#eeebe2] bg-[#fbfaf6] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#1b4332] hover:bg-[#245740] active:scale-98 text-white rounded-xl text-sm font-bold shadow-md shadow-[#1b4332]/25 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
