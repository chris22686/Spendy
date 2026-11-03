import { useState } from 'react';
import { useApp } from '../store';
import { v4 as uuidv4 } from 'uuid';
import { Plus, Pencil, Trash2, X, Check, Tag, FolderPlus, Layers, AlertCircle } from 'lucide-react';

const AVAILABLE_ICONS = ['🍔','🚗','🏠','⚡','💊','🛍️','🎬','💪','📚','📱','✈️','💰','📈','📦','🎵','🍕','☕','🛒','🎮','🏥','🚌','💡','🎁','🌮','🍷','🎯','🏋️','📷','🎤','🧴'];
const COLORS = ['#1b4332','#2d6a4f','#40916c','#52b788','#d97706','#b45309','#0284c7','#2563eb','#7c3aed','#c026d3','#e11d48','#dc2626','#475569','#0d9488','#15803d','#65a30d'];

export default function Categories() {
  const { state, dispatch } = useApp();
  const { categories, categoryGroups = ['Essentials', 'Lifestyle', 'Subscriptions', 'Finance', 'Other'] } = state;
  const [showForm, setShowForm] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editCat, setEditCat] = useState(null);

  // Group categories under their respective categoryGroups, plus any leftover groups
  const grouped = {};
  categoryGroups.forEach(g => {
    grouped[g] = [];
  });
  categories.forEach(c => {
    const grp = c.group || 'Other';
    if (!grouped[grp]) grouped[grp] = [];
    grouped[grp].push(c);
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
            Customize your spending categories and organize them into custom groups
          </p>
        </div>
        
        <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
          <button
            onClick={() => setShowGroupModal(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 bg-[#eaf4ee] hover:bg-[#d9ede0] border border-[#cde2d6] text-[#1b4332] rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-98"
          >
            <Layers size={16} strokeWidth={2.4} />
            <span>Manage Groups</span>
          </button>

          <button
            onClick={() => { setEditCat(null); setShowForm(true); }}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 bg-[#1b4332] hover:bg-[#245740] active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-extrabold shadow-md shadow-[#1b4332]/25 transition-all cursor-pointer"
          >
            <Plus size={16} strokeWidth={2.8} />
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {Object.entries(grouped).map(([group, cats]) => (
        <div key={group} className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1b4332]" />
              <h2 className="text-xs sm:text-sm font-extrabold text-[#14261c] uppercase tracking-wider">{group}</h2>
              <span className="text-[11px] font-bold text-[#65776c] bg-[#f1efe8] px-2 py-0.5 rounded-full">
                {cats.length}
              </span>
            </div>
          </div>

          {cats.length === 0 ? (
            <div className="p-4 rounded-2xl border border-dashed border-[#dcd7cb] bg-[#faf9f5] text-center text-xs text-[#899c90] font-medium">
              No categories in this group. Tap "+ Add Category" to assign one here.
            </div>
          ) : (
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
          )}
        </div>
      ))}

      {showForm && (
        <CategoryModal
          initial={editCat}
          groups={categoryGroups}
          onSave={(cat) => {
            if (editCat) dispatch({ type: 'UPDATE_CATEGORY', payload: cat });
            else dispatch({ type: 'ADD_CATEGORY', payload: { ...cat, id: uuidv4() } });
            setShowForm(false);
          }}
          onClose={() => setShowForm(false)}
        />
      )}

      {showGroupModal && (
        <GroupsModal
          groups={categoryGroups}
          categories={categories}
          onClose={() => setShowGroupModal(false)}
        />
      )}
    </div>
  );
}

function CategoryModal({ initial, groups, onSave, onClose }) {
  const [form, setForm] = useState(
    initial || { name: '', icon: '📦', color: '#1b4332', group: groups[0] || 'Other' }
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
              {groups.map(g => (
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

function GroupsModal({ groups, categories, onClose }) {
  const { dispatch } = useApp();
  const [newGroupName, setNewGroupName] = useState('');
  const [editingGroup, setEditingGroup] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [error, setError] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    const clean = newGroupName.trim();
    if (!clean) {
      setError('Please enter a group name');
      return;
    }
    if (groups.some(g => g.toLowerCase() === clean.toLowerCase())) {
      setError('A group with this name already exists');
      return;
    }
    dispatch({ type: 'ADD_GROUP', payload: clean });
    setNewGroupName('');
    setError('');
  };

  const handleStartEdit = (g) => {
    setEditingGroup(g);
    setEditedName(g);
    setError('');
  };

  const handleSaveEdit = (oldName) => {
    const clean = editedName.trim();
    if (!clean) {
      setError('Group name cannot be empty');
      return;
    }
    if (clean !== oldName && groups.some(g => g.toLowerCase() === clean.toLowerCase())) {
      setError('A group with this name already exists');
      return;
    }
    dispatch({ type: 'UPDATE_GROUP', payload: { oldName, newName: clean } });
    setEditingGroup(null);
    setError('');
  };

  const handleDelete = (groupName) => {
    if (groups.length <= 1) {
      setError('You must keep at least one category group');
      return;
    }
    const count = categories.filter(c => c.group === groupName).length;
    if (count > 0) {
      const confirmDelete = window.confirm(
        `Group "${groupName}" has ${count} category(ies). Deleting it will move them to your other groups. Continue?`
      );
      if (!confirmDelete) return;
    }
    dispatch({ type: 'DELETE_GROUP', payload: groupName });
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-[#ffffff] border border-[#e4dfd3] rounded-3xl w-full max-w-md shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-[#eeebe2] flex items-center justify-between bg-[#fbfaf6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1b4332]/10 border border-[#1b4332]/20 flex items-center justify-center text-[#1b4332]">
              <Layers size={20} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[#14261c] leading-tight">Category Groups</h2>
              <p className="text-xs text-[#6e8074] font-medium">Add, rename, or delete groups</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f0eee6] hover:bg-[#e4dfd3] flex items-center justify-center text-[#55695e] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mx-5 mt-4 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle size={15} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Add Group Form */}
        <form onSubmit={handleAdd} className="p-5 pb-3">
          <label className="text-xs font-bold text-[#55695e] uppercase tracking-wider mb-1.5 block">
            Add New Group
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. Work, Kids, Personal..."
              value={newGroupName}
              onChange={(e) => { setNewGroupName(e.target.value); setError(''); }}
              className="flex-1 bg-[#f8f7f2] border border-[#dcd7cb] rounded-xl px-3.5 py-2.5 text-sm font-semibold text-[#14261c] focus:outline-none focus:border-[#1b4332]"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-[#1b4332] hover:bg-[#245740] active:scale-98 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus size={15} strokeWidth={2.8} />
              <span>Add</span>
            </button>
          </div>
        </form>

        {/* Groups List */}
        <div className="px-5 py-2 overflow-y-auto space-y-2 flex-1">
          <p className="text-[11px] font-bold text-[#65776c] uppercase tracking-wider mb-1">
            Current Groups ({groups.length})
          </p>

          {groups.map((group) => {
            const catCount = categories.filter(c => c.group === group).length;
            const isEditing = editingGroup === group;

            return (
              <div
                key={group}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#f8f7f2] border border-[#e4dfd3]"
              >
                {isEditing ? (
                  <div className="flex items-center gap-2 flex-1 mr-2">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="flex-1 bg-[#ffffff] border border-[#1b4332] rounded-lg px-2.5 py-1.5 text-xs font-bold text-[#14261c] focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(group)}
                      className="px-2.5 py-1.5 bg-[#1b4332] hover:bg-[#245740] text-white rounded-lg text-xs font-bold"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingGroup(null)}
                      className="px-2 py-1.5 bg-[#e4dfd3] hover:bg-[#d8d3c5] text-[#55695e] rounded-lg text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#1b4332]" />
                      <span className="text-sm font-bold text-[#14261c] truncate">{group}</span>
                      <span className="text-[11px] font-semibold text-[#6e8074] bg-[#ffffff] border border-[#e4dfd3] px-2 py-0.5 rounded-full">
                        {catCount} {catCount === 1 ? 'category' : 'categories'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleStartEdit(group)}
                        className="w-7 h-7 rounded-lg bg-[#ffffff] hover:bg-[#eaf4ee] border border-[#e4dfd3] flex items-center justify-center text-[#55695e] hover:text-[#1b4332] transition-colors cursor-pointer"
                        title="Rename group"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => handleDelete(group)}
                        className="w-7 h-7 rounded-lg bg-[#fef2f2] hover:bg-[#fee2e2] border border-[#fecaca] flex items-center justify-center text-[#dc2626] transition-colors cursor-pointer"
                        title="Delete group"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#eeebe2] bg-[#fbfaf6] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#1b4332] hover:bg-[#245740] active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-[#1b4332]/25 transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
