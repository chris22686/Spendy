import { useState } from 'react';
import { useApp } from '../store';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Pencil, Trash2, X, Check, Tag } from 'lucide-react';

const AVAILABLE_ICONS = ['🍔','🚗','🏠','⚡','💊','🛍️','🎬','💪','📚','📱','✈️','💰','📈','📦','🎵','🍕','☕','🛒','🎮','🏥','🚌','💡','🎁','🌮','🍷','🎯','🏋️','📷','🎤','🧴'];
const COLORS = ['#1b4332','#2d6a4f','#40916c','#52b788','#d97706','#b45309','#0284c7','#2563eb','#7c3aed','#c026d3','#e11d48','#dc2626','#475569','#0d9488','#15803d','#65a30d'];
const GROUPS = ['Essentials','Lifestyle','Subscriptions','Finance','Other'];

export default function Categories() {
  const { state, dispatch } = useApp();
  const { categories } = state;
  const [showForm, setShowForm] = useState(false);
  const [editCat, setEditCat] = useState(null);

  const grouped = {};
  categories.forEach(c => {
    if (!grouped[c.group]) grouped[c.group] = [];
    grouped[c.group].push(c);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#ffffff] p-5 rounded-3xl border border-[#e7e4da] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Tag size={20} className="text-[#1b4332]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14261c] tracking-tight">Manage Categories</h1>
          </div>
          <p className="text-[#65776c] text-xs sm:text-sm mt-1 font-medium">
            Tap any category to edit, or use the delete button to remove it
          </p>
        </div>
        
        <button
          onClick={() => { setEditCat(null); setShowForm(true); }}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-[#1b4332] hover:bg-[#245740] active:scale-98 text-white rounded-2xl text-sm font-extrabold shadow-md shadow-[#1b4332]/25 transition-all cursor-pointer w-full sm:w-auto"
        >
          <Plus size={18} strokeWidth={2.8} />
          <span>Add New Category</span>
        </button>
      </div>

      {Object.entries(grouped).map(([group, cats]) => (
        <div key={group} className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1b4332]" />
            <h2 className="text-xs font-bold text-[#55695e] uppercase tracking-wider">{group}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cats.map(cat => (
              <div
                key={cat.id}
                onClick={() => { setEditCat(cat); setShowForm(true); }}
                className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#ffffff] border border-[#e8e4da] hover:border-[#cbd7cf] hover:shadow-[0_4px_16px_rgba(27,67,50,0.05)] transition-all cursor-pointer group"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-xs"
                  style={{ backgroundColor: (cat.color || '#1b4332') + '18', border: `1px solid ${(cat.color || '#1b4332')}33` }}
                >
                  {cat.icon}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#14261c] truncate">{cat.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-xs text-[#718578] font-medium">{cat.group}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => { setEditCat(cat); setShowForm(true); }}
                    className="p-2 rounded-xl text-[#5b6c62] hover:text-[#1b4332] bg-[#f8f7f2] border border-[#e8e4da] hover:bg-[#eaf4ee] transition-all cursor-pointer"
                    title="Edit category"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => dispatch({ type: 'DELETE_CATEGORY', payload: cat.id })}
                    className="p-2 rounded-xl text-[#991b1b] bg-[#fef2f2] border border-[#fecaca] hover:bg-[#fee2e2] transition-all cursor-pointer"
                    title="Delete category"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {showForm && (
        <CategoryModal
          initial={editCat}
          onSave={(cat) => {
            if (editCat) dispatch({ type: 'UPDATE_CATEGORY', payload: cat });
            else dispatch({ type: 'ADD_CATEGORY', payload: { ...cat, id: uuidv4() } });
            setShowForm(false);
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

function CategoryModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(
    initial || { name: '', icon: '📦', color: '#1b4332', group: 'Other' }
  );
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim()) { setErrors({ name: 'Name is required' }); return; }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#ffffff] border border-[#e4dfd3] rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#14261c]">{initial ? 'Edit Category' : 'Create New Category'}</h2>
          <button onClick={onClose} className="text-[#7d8f84] hover:text-[#14261c] p-1"><X size={18}/></button>
        </div>

        <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#f8f7f2] border border-[#e7e4da] mb-5">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-xs"
            style={{ backgroundColor: form.color + '22', border: `1px solid ${form.color}44` }}
          >
            {form.icon}
          </div>
          <div>
            <p className="font-extrabold text-[#14261c]">{form.name || 'Category Name'}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: form.color }} />
              <span className="text-xs text-[#718578] font-semibold">{form.group}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#55695e] uppercase tracking-wider mb-1.5 block">Category Name</label>
            <input
              value={form.name}
              onChange={e => { set('name', e.target.value); setErrors({}); }}
              placeholder="e.g. Coffee, Groceries, Fitness..."
              className={`w-full bg-[#f8f7f2] border ${errors.name ? 'border-[#dc2626]' : 'border-[#e4dfd3]'} rounded-xl px-4 py-2.5 text-sm text-[#14261c] focus:outline-none focus:border-[#1b4332]`}
            />
            {errors.name && <p className="text-[#dc2626] text-xs mt-1 font-medium">{errors.name}</p>}
          </div>

          <div>
            <label className="text-xs font-bold text-[#55695e] uppercase tracking-wider mb-1.5 block">Group</label>
            <div className="flex flex-wrap gap-2">
              {GROUPS.map(g => (
                <button
                  key={g}
                  type="button"
                  onClick={() => set('group', g)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    form.group === g
                      ? 'bg-[#1b4332] text-white shadow-xs'
                      : 'bg-[#f8f7f2] border border-[#e4dfd3] text-[#55695e] hover:bg-[#eae6db]'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#55695e] uppercase tracking-wider mb-1.5 block">Choose Icon</label>
            <div className="grid grid-cols-10 gap-1.5 max-h-32 overflow-y-auto p-1.5 bg-[#f8f7f2] rounded-xl border border-[#e4dfd3]">
              {AVAILABLE_ICONS.map(icon => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => set('icon', icon)}
                  className={`w-8 h-8 rounded-lg text-lg flex items-center justify-center transition-all cursor-pointer ${
                    form.icon === icon
                      ? 'bg-[#1b4332] text-white shadow-xs scale-105'
                      : 'hover:bg-[#eae6db]'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[#55695e] uppercase tracking-wider mb-1.5 block">Choose Color</label>
            <div className="flex flex-wrap gap-2.5">
              {COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => set('color', color)}
                  className="w-7 h-7 rounded-full transition-transform hover:scale-115 flex items-center justify-center shadow-xs cursor-pointer"
                  style={{ backgroundColor: color }}
                >
                  {form.color === color && <Check size={14} className="text-white stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 px-4 py-2.5 rounded-xl border border-[#e4dfd3] text-sm font-semibold text-[#65776c] hover:bg-[#f8f7f2]">Cancel</button>
          <button onClick={handleSave} className="flex-1 px-4 py-2.5 rounded-xl bg-[#1b4332] hover:bg-[#245740] text-sm font-bold text-white shadow-md shadow-[#1b4332]/25">
            {initial ? 'Save Changes' : 'Create Category'}
          </button>
        </div>
      </div>
    </div>
  );
}
