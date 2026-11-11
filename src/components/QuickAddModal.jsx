import { useState, useEffect } from 'react';
import { useApp, formatMoney, DEFAULT_QUICK_PRESETS } from '../store';
import { Zap, Plus, Trash2, X, Check, RotateCcw, Pencil, AlertCircle } from 'lucide-react';

const COMMON_EMOJIS = ['☕', '🥪', '🚌', '🛒', '🥐', '🍕', '⛽', '💊', '🎟️', '🏋️', '🍺', '🍦', '🍔', '🚕', '📚', '🎬', '🛍️', '🧼', '🍰', '🥤'];

export default function QuickAddModal({ isOpen, onClose }) {
  const { state, dispatch } = useApp();
  const { categories = [], quickPresets = DEFAULT_QUICK_PRESETS } = state;

  const [presets, setPresets] = useState(quickPresets);
  const [editingId, setEditingId] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formIcon, setFormIcon] = useState('☕');
  const [formAmount, setFormAmount] = useState('');
  const [formCategory, setFormCategory] = useState(categories[0]?.id || 'food');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setPresets(quickPresets);
      setEditingId(null);
      setError('');
      document.body.dataset.modalOpen = 'true';
    }
    return () => {
      delete document.body.dataset.modalOpen;
    };
  }, [isOpen, quickPresets]);

  if (!isOpen) return null;

  const startEdit = (item) => {
    setEditingId(item.id);
    setFormTitle(item.title);
    setFormIcon(item.icon || '☕');
    setFormAmount(item.amount.toString());
    setFormCategory(item.category || categories[0]?.id || 'food');
    setError('');
  };

  const startAdd = () => {
    if (presets.length >= 8) {
      setError('You can have at most 8 quick presets.');
      return;
    }
    const newId = 'qp-' + Date.now();
    setEditingId(newId);
    setFormTitle('');
    setFormIcon('☕');
    setFormAmount('');
    setFormCategory(categories[0]?.id || 'food');
    setError('');
  };

  const saveEdit = (e) => {
    e?.preventDefault();
    const cleanTitle = formTitle.trim();
    if (!cleanTitle) {
      setError('Please provide a short title (e.g. Coffee)');
      return;
    }
    const parsedAmt = parseFloat(formAmount);
    if (isNaN(parsedAmt) || parsedAmt <= 0) {
      setError('Please provide a valid amount greater than 0');
      return;
    }

    const updatedItem = {
      id: editingId,
      title: cleanTitle,
      icon: formIcon || '☕',
      amount: Math.round(parsedAmt * 100) / 100,
      category: formCategory || categories[0]?.id || 'food',
    };

    const exists = presets.some((p) => p.id === editingId);
    let nextPresets = [];
    if (exists) {
      nextPresets = presets.map((p) => (p.id === editingId ? updatedItem : p));
    } else {
      nextPresets = [...presets, updatedItem];
    }

    setPresets(nextPresets);
    setEditingId(null);
    setError('');
  };

  const deleteItem = (id) => {
    if (presets.length <= 1) {
      setError('You must keep at least 1 quick preset.');
      return;
    }
    const next = presets.filter((p) => p.id !== id);
    setPresets(next);
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const handleResetDefaults = () => {
    setPresets(DEFAULT_QUICK_PRESETS);
    setEditingId(null);
    setError('');
  };

  const handleSaveAll = () => {
    dispatch({
      type: 'SET_QUICK_PRESETS',
      payload: presets,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/60 backdrop-blur-xs z-50 overflow-y-auto px-4 modal-backdrop-safe flex flex-col items-center justify-start sm:justify-center animate-fade-in">
      <div
        className="my-auto w-full max-w-lg bg-[#ffffff] border border-[#e4dfd3] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 modal-card-safe overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-[#f1ede3]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#eaf4ee] text-[#1b4332] flex items-center justify-center shadow-xs">
              <Zap size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#14261c] tracking-tight">
                Customize 1-Tap Quick Add
              </h2>
              <p className="text-xs text-[#718578]">Set your go-to shortcuts for instant logging</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#7d8f84] hover:text-[#14261c] p-1.5 rounded-lg hover:bg-[#f8f7f2] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* Editing Sub-form if an item is being added or edited */}
        {editingId ? (
          <form onSubmit={saveEdit} className="p-4 bg-[#f8f7f2] border border-[#e4dfd3] rounded-2xl space-y-3.5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <p className="text-xs font-extrabold text-[#14261c] uppercase tracking-wider">
                {presets.some((p) => p.id === editingId) ? 'Edit Shortcut' : 'New Shortcut'}
              </p>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="text-xs font-bold text-[#718578] hover:text-[#14261c]"
              >
                Cancel
              </button>
            </div>

            {/* Title & Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="text-[11px] font-bold text-[#55695e] uppercase tracking-wider block mb-1">
                  Shortcut Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Coffee, Lunch..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-white border border-[#dcd7cb] rounded-xl px-3 py-2 text-sm font-bold text-[#14261c] focus:outline-none focus:border-[#1b4332]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#55695e] uppercase tracking-wider block mb-1">
                  Preset Amount (€)
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  className="w-full bg-white border border-[#dcd7cb] rounded-xl px-3 py-2 text-sm font-bold text-[#14261c] focus:outline-none focus:border-[#1b4332]"
                />
              </div>
            </div>

            {/* Category Dropdown */}
            <div>
              <label className="text-[11px] font-bold text-[#55695e] uppercase tracking-wider block mb-1">
                Assigned Category
              </label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                className="w-full bg-white border border-[#dcd7cb] rounded-xl px-3 py-2 text-xs font-bold text-[#14261c] focus:outline-none focus:border-[#1b4332]"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.icon} {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Emoji Selection */}
            <div>
              <label className="text-[11px] font-bold text-[#55695e] uppercase tracking-wider block mb-1.5">
                Choose Emoji Icon
              </label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {COMMON_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormIcon(emoji)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-base transition-transform active:scale-90 ${
                      formIcon === emoji
                        ? 'bg-[#1b4332] text-white ring-2 ring-[#1b4332]/40'
                        : 'bg-white border border-[#dcd7cb] hover:bg-[#eae6db]'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="submit"
                className="px-4 py-2 bg-[#1b4332] hover:bg-[#245740] active:scale-98 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check size={14} strokeWidth={3} />
                <span>Save Shortcut</span>
              </button>
            </div>
          </form>
        ) : null}

        {/* Existing Presets List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#55695e]">
            <span className="font-bold uppercase tracking-wider">Active Shortcuts ({presets.length}/8)</span>
            {!editingId && presets.length < 8 && (
              <button
                type="button"
                onClick={startAdd}
                className="flex items-center gap-1 text-[#1b4332] hover:text-[#2d6a4f] font-bold cursor-pointer"
              >
                <Plus size={14} strokeWidth={3} />
                <span>Add Preset</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {presets.map((item) => {
              const cat = categories.find((c) => c.id === item.category) || { name: 'Expense', icon: '📦' };
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-2xl border border-[#e4dfd3] bg-[#f8f7f2] hover:border-[#cbd7cf] transition-all group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#dcd7cb] flex items-center justify-center text-lg shadow-2xs shrink-0">
                      {item.icon || '☕'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-extrabold text-[#14261c] truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-[#6e8074]">
                        <span className="font-bold text-[#1b4332]">{formatMoney(item.amount)}</span> · {cat.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button
                      type="button"
                      onClick={() => startEdit(item)}
                      className="p-1.5 text-[#718578] hover:text-[#1b4332] hover:bg-white rounded-lg transition-colors cursor-pointer"
                      title="Edit preset"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteItem(item.id)}
                      className="p-1.5 text-[#718578] hover:text-[#991b1b] hover:bg-white rounded-lg transition-colors cursor-pointer"
                      title="Delete preset"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-3 border-t border-[#f1ede3] flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#718578] hover:text-[#14261c] cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#e4dfd3] text-xs font-semibold text-[#65776c] hover:bg-[#f8f7f2] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              className="px-5 py-2.5 bg-[#1b4332] hover:bg-[#245740] active:scale-98 text-white rounded-xl text-xs font-extrabold shadow-md shadow-[#1b4332]/25 transition-all cursor-pointer"
            >
              Save Shortcuts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
