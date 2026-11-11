import { createContext, useContext, useReducer, useEffect } from 'react';

// ─── Default Categories ───────────────────────────────────────────────────────
export const DEFAULT_CATEGORIES = [
  { id: 'food',         name: 'Food & Dining',    icon: '🍔', color: '#1b4332', group: 'Essentials' },
  { id: 'transport',    name: 'Transport',         icon: '🚗', color: '#2d6a4f', group: 'Essentials' },
  { id: 'housing',      name: 'Housing',           icon: '🏠', color: '#40916c', group: 'Essentials' },
  { id: 'utilities',    name: 'Utilities',         icon: '⚡', color: '#d97706', group: 'Essentials' },
  { id: 'health',       name: 'Health',            icon: '💊', color: '#059669', group: 'Essentials' },
  { id: 'shopping',     name: 'Shopping',          icon: '🛍️', color: '#c026d3', group: 'Lifestyle' },
  { id: 'entertainment','name': 'Entertainment',   icon: '🎬', color: '#e11d48', group: 'Lifestyle' },
  { id: 'fitness',      name: 'Fitness',           icon: '💪', color: '#0284c7', group: 'Lifestyle' },
  { id: 'education',    name: 'Education',         icon: '📚', color: '#4f46e5', group: 'Lifestyle' },
  { id: 'subscriptions','name': 'Subscriptions',   icon: '📱', color: '#7c3aed', group: 'Subscriptions' },
  { id: 'travel',       name: 'Travel',            icon: '✈️', color: '#0ea5e9', group: 'Lifestyle' },
  { id: 'savings',      name: 'Savings',           icon: '💰', color: '#15803d', group: 'Finance' },
  { id: 'investment',   name: 'Investment',        icon: '📈', color: '#16a34a', group: 'Finance' },
  { id: 'other',        name: 'Other',             icon: '📦', color: '#64748b', group: 'Other' },
];

// ─── Sample Data ──────────────────────────────────────────────────────────────
const today = new Date();
const fmt = (d) => d.toISOString().split('T')[0];
const daysAgo = (n) => { const d = new Date(today); d.setDate(d.getDate() - n); return fmt(d); };

export const SAMPLE_EXPENSES = [
  { id: '1',  amount: 12.50,  category: 'food',          description: 'Lunch at café',          date: daysAgo(0),  notes: '',                      recurring: false },
  { id: '2',  amount: 45.00,  category: 'transport',     description: 'Monthly bus pass',        date: daysAgo(0),  notes: 'Public transit',         recurring: true  },
  { id: '3',  amount: 9.99,   category: 'subscriptions', description: 'Netflix',                 date: daysAgo(1),  notes: 'Streaming service',      recurring: true  },
  { id: '4',  amount: 62.30,  category: 'shopping',      description: 'Clothes at H&M',         date: daysAgo(1),  notes: '',                       recurring: false },
  { id: '5',  amount: 24.00,  category: 'food',          description: 'Grocery run',            date: daysAgo(2),  notes: 'Weekly groceries',        recurring: false },
  { id: '6',  amount: 15.00,  category: 'fitness',       description: 'Gym session',            date: daysAgo(2),  notes: '',                       recurring: false },
  { id: '7',  amount: 200.00, category: 'housing',       description: 'Electricity bill',       date: daysAgo(3),  notes: 'Monthly utility',         recurring: true  },
  { id: '8',  amount: 8.99,   category: 'subscriptions', description: 'Spotify Premium',        date: daysAgo(3),  notes: 'Music streaming',         recurring: true  },
  { id: '9',  amount: 35.00,  category: 'entertainment', description: 'Movie night',            date: daysAgo(4),  notes: 'With friends',            recurring: false },
  { id: '10', amount: 18.75,  category: 'food',          description: 'Pizza delivery',         date: daysAgo(5),  notes: '',                       recurring: false },
  { id: '11', amount: 50.00,  category: 'health',        description: 'Pharmacy',               date: daysAgo(6),  notes: 'Monthly prescriptions',   recurring: true  },
  { id: '12', amount: 120.00, category: 'shopping',      description: 'Amazon order',           date: daysAgo(7),  notes: 'Electronics accessories', recurring: false },
  { id: '13', amount: 14.99,  category: 'subscriptions', description: 'YouTube Premium',        date: daysAgo(8),  notes: '',                       recurring: true  },
  { id: '14', amount: 55.00,  category: 'food',          description: 'Restaurant dinner',      date: daysAgo(9),  notes: 'Birthday dinner',         recurring: false },
  { id: '15', amount: 30.00,  category: 'transport',     description: 'Uber rides',             date: daysAgo(10), notes: '',                       recurring: false },
  { id: '16', amount: 500.00, category: 'housing',       description: 'Rent portion',           date: daysAgo(11), notes: 'Monthly contribution',    recurring: true  },
  { id: '17', amount: 22.00,  category: 'education',     description: 'Online course',          date: daysAgo(12), notes: 'Udemy course',            recurring: false },
  { id: '18', amount: 40.00,  category: 'fitness',       description: 'Gym monthly membership', date: daysAgo(13), notes: '',                       recurring: true  },
  { id: '19', amount: 11.50,  category: 'food',          description: 'Coffee shop',            date: daysAgo(14), notes: '',                       recurring: false },
  { id: '20', amount: 75.00,  category: 'travel',        description: 'Weekend trip fuel',      date: daysAgo(15), notes: '',                       recurring: false },
  { id: '21', amount: 33.00,  category: 'entertainment', description: 'Concert tickets',        date: daysAgo(16), notes: '',                       recurring: false },
  { id: '22', amount: 28.00,  category: 'food',          description: 'Meal prep ingredients',  date: daysAgo(17), notes: '',                       recurring: false },
  { id: '23', amount: 9.99,   category: 'subscriptions', description: 'iCloud Storage',         date: daysAgo(18), notes: '',                       recurring: true  },
  { id: '24', amount: 90.00,  category: 'shopping',      description: 'Shoes',                  date: daysAgo(19), notes: '',                       recurring: false },
  { id: '25', amount: 16.00,  category: 'food',          description: 'Lunch takeaway',         date: daysAgo(20), notes: '',                       recurring: false },
  { id: '26', amount: 45.00,  category: 'utilities',     description: 'Internet bill',          date: daysAgo(21), notes: '',                       recurring: true  },
  { id: '27', amount: 19.99,  category: 'subscriptions', description: 'Adobe Creative Cloud',   date: daysAgo(22), notes: '',                       recurring: true  },
  { id: '28', amount: 60.00,  category: 'health',        description: 'Doctor visit copay',     date: daysAgo(23), notes: '',                       recurring: false },
  { id: '29', amount: 13.00,  category: 'food',          description: 'Breakfast pastries',     date: daysAgo(24), notes: '',                       recurring: false },
  { id: '30', amount: 200.00, category: 'savings',       description: 'Emergency fund deposit', date: daysAgo(25), notes: 'Monthly savings goal',    recurring: true  },
];

export const SAMPLE_BUDGETS = [
  { id: 'b1', category: 'food',          limit: 400,  period: 'monthly' },
  { id: 'b2', category: 'transport',     limit: 150,  period: 'monthly' },
  { id: 'b3', category: 'shopping',      limit: 200,  period: 'monthly' },
  { id: 'b4', category: 'entertainment', limit: 100,  period: 'monthly' },
  { id: 'b5', category: 'subscriptions', limit: 60,   period: 'monthly' },
  { id: 'b6', category: 'health',        limit: 150,  period: 'monthly' },
  { id: 'b7', category: 'fitness',       limit: 80,   period: 'monthly' },
  { id: 'b8', category: 'utilities',     limit: 120,  period: 'monthly' },
];

export const DEFAULT_GROUPS = ['Essentials', 'Lifestyle', 'Subscriptions', 'Finance', 'Other'];

export const DEFAULT_NOTIFICATION_SETTINGS = {
  notifyOnPayday: true,
  notifyDaily: true,
  dailyReminderTime: '20:00',
};

export const DEFAULT_QUICK_PRESETS = [
  { id: 'qp-coffee', title: 'Coffee', icon: '☕', amount: 2.50, category: 'food' },
  { id: 'qp-lunch', title: 'Lunch', icon: '🥪', amount: 10.00, category: 'food' },
  { id: 'qp-gas', title: 'Gas', icon: '⛽', amount: 30.00, category: 'transport' },
];

// ─── Demo data detection ──────────────────────────────────────────────────────
// Sample records use fixed ids ('1'-'30', 'b1'-'b8'); real ones use uuids.
// Only untouched samples match, so anything the user edited is kept.
const SAMPLE_EXPENSE_MAP = new Map(SAMPLE_EXPENSES.map(e => [e.id, e]));
const SAMPLE_BUDGET_MAP = new Map(SAMPLE_BUDGETS.map(b => [b.id, b]));

function isSampleExpense(e) {
  const s = e && SAMPLE_EXPENSE_MAP.get(e.id);
  return !!s && s.description === e.description && Number(s.amount) === Number(e.amount) && s.category === e.category;
}

function isSampleBudget(b) {
  const s = b && SAMPLE_BUDGET_MAP.get(b.id);
  return !!s && s.category === b.category && Number(s.limit) === Number(b.limit);
}

function stripSampleData(state) {
  return {
    ...state,
    expenses: (state.expenses || []).filter(e => !isSampleExpense(e)),
    budgets: (state.budgets || []).filter(b => !isSampleBudget(b)),
  };
}

// ─── Default Income Sources ────────────────────────────────────────────────────
export const DEFAULT_INCOME_SOURCES = [
  { id: 'inc-1', name: 'Primary Salary (1st Paycheck)', amount: 1500, frequency: 'bi-weekly', icon: '💼', color: '#1b4332' },
  { id: 'inc-2', name: 'Second Salary (15th Paycheck)', amount: 1500, frequency: 'bi-weekly', icon: '🏦', color: '#2d6a4f' },
];

export const FREQUENCY_LABELS = {
  monthly: 'Monthly',
  'bi-weekly': 'Every 15 Days / Bi-Weekly',
  weekly: 'Weekly',
  one_time: 'One-Time / Transfer',
};

export function calculateMonthlyIncomeFromSources(sources) {
  if (!Array.isArray(sources) || sources.length === 0) return 0;
  return sources.reduce((sum, s) => {
    const val = Number(s.amount) || 0;
    switch (s.frequency) {
      case 'weekly':
        return sum + (val * 52) / 12;
      case 'bi-weekly':
        return sum + (val * 2);
      case 'one_time':
      case 'monthly':
      default:
        return sum + val;
    }
  }, 0);
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'ADD_EXPENSE': {
      const newExp = action.payload;
      const now = Date.now();
      // Guard against rapid multi-click duplicates (same details within 3 seconds)
      const isDuplicate = state.expenses.some(e =>
        e.description === newExp.description &&
        Number(e.amount) === Number(newExp.amount) &&
        e.category === newExp.category &&
        e.date === newExp.date &&
        e._createdAt && (now - e._createdAt < 3000)
      );
      if (isDuplicate) {
        return state;
      }
      const prevBal = state.currentBalance !== undefined ? Number(state.currentBalance) : 2500;
      const updatedBalance = Math.round((prevBal - Number(newExp.amount || 0)) * 100) / 100;
      return {
        ...state,
        currentBalance: updatedBalance,
        expenses: [{ ...newExp, _createdAt: now }, ...state.expenses],
      };
    }
    case 'UPDATE_EXPENSE': {
      const oldExp = state.expenses.find(e => e.id === action.payload.id);
      const diff = (oldExp ? Number(oldExp.amount || 0) : 0) - Number(action.payload.amount || 0);
      const prevBal = state.currentBalance !== undefined ? Number(state.currentBalance) : 2500;
      return {
        ...state,
        currentBalance: Math.round((prevBal + diff) * 100) / 100,
        expenses: state.expenses.map(e => e.id === action.payload.id ? action.payload : e),
      };
    }
    case 'DELETE_EXPENSE': {
      const exp = state.expenses.find(e => e.id === action.payload);
      const refund = exp ? Number(exp.amount || 0) : 0;
      const prevBal = state.currentBalance !== undefined ? Number(state.currentBalance) : 2500;
      return {
        ...state,
        currentBalance: Math.round((prevBal + refund) * 100) / 100,
        expenses: state.expenses.filter(e => e.id !== action.payload),
      };
    }
    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.payload] };
    case 'UPDATE_CATEGORY':
      return { ...state, categories: state.categories.map(c => c.id === action.payload.id ? action.payload : c) };
    case 'DELETE_CATEGORY':
      return { ...state, categories: state.categories.filter(c => c.id !== action.payload) };
    case 'ADD_GROUP': {
      const g = action.payload?.trim();
      const current = state.categoryGroups || DEFAULT_GROUPS;
      if (!g || current.includes(g)) return state;
      return { ...state, categoryGroups: [...current, g] };
    }
    case 'UPDATE_GROUP': {
      const { oldName, newName } = action.payload;
      const cleanNew = newName?.trim();
      if (!cleanNew || cleanNew === oldName) return state;
      const currentGroups = state.categoryGroups || DEFAULT_GROUPS;
      const updatedGroups = currentGroups.map(g => g === oldName ? cleanNew : g);
      const updatedCategories = state.categories.map(c => c.group === oldName ? { ...c, group: cleanNew } : c);
      return { ...state, categoryGroups: updatedGroups, categories: updatedCategories };
    }
    case 'DELETE_GROUP': {
      const groupToDelete = action.payload;
      const currentGroups = state.categoryGroups || DEFAULT_GROUPS;
      const updatedGroups = currentGroups.filter(g => g !== groupToDelete);
      const fallbackGroup = updatedGroups[0] || 'Other';
      const updatedCategories = state.categories.map(c => c.group === groupToDelete ? { ...c, group: fallbackGroup } : c);
      return { ...state, categoryGroups: updatedGroups, categories: updatedCategories };
    }
    case 'SET_BALANCE': {
      const amt = Math.round((Number(action.payload) || 0) * 100) / 100;
      return {
        ...state,
        currentBalance: amt,
        initialBalance: amt,
      };
    }
    case 'DEPOSIT_PAYCHECK': {
      const amt = Math.round((Number(action.payload) || 0) * 100) / 100;
      const prevBal = state.currentBalance !== undefined ? Number(state.currentBalance) : 0;
      return {
        ...state,
        currentBalance: Math.round((prevBal + amt) * 100) / 100,
      };
    }
    case 'SET_BUDGET': {
      const exists = state.budgets.find(b => b.id === action.payload.id);
      if (exists) return { ...state, budgets: state.budgets.map(b => b.id === action.payload.id ? action.payload : b) };
      return { ...state, budgets: [...state.budgets, action.payload] };
    }
    case 'DELETE_BUDGET':
      return { ...state, budgets: state.budgets.filter(b => b.id !== action.payload) };
    case 'SET_INCOME': {
      const amt = Number(action.payload) || 0;
      return { ...state, monthlyIncome: amt };
    }
    case 'SET_INCOME_SOURCES': {
      const sources = action.payload || [];
      const computed = calculateMonthlyIncomeFromSources(sources);
      return { ...state, incomeSources: sources, monthlyIncome: Math.round(computed) };
    }
    case 'ADD_INCOME_SOURCE': {
      const nextSources = [...(state.incomeSources || []), action.payload];
      const computed = calculateMonthlyIncomeFromSources(nextSources);
      return { ...state, incomeSources: nextSources, monthlyIncome: Math.round(computed) };
    }
    case 'UPDATE_INCOME_SOURCE': {
      const nextSources = (state.incomeSources || []).map(s => s.id === action.payload.id ? action.payload : s);
      const computed = calculateMonthlyIncomeFromSources(nextSources);
      return { ...state, incomeSources: nextSources, monthlyIncome: Math.round(computed) };
    }
    case 'DELETE_INCOME_SOURCE': {
      const nextSources = (state.incomeSources || []).filter(s => s.id !== action.payload);
      const computed = calculateMonthlyIncomeFromSources(nextSources);
      return { ...state, incomeSources: nextSources, monthlyIncome: Math.round(computed) };
    }
    case 'RESET_DEMO_DATA':
      return {
        ...state,
        demoData: true,
        expenses: SAMPLE_EXPENSES,
        categories: DEFAULT_CATEGORIES,
        categoryGroups: DEFAULT_GROUPS,
        budgets: SAMPLE_BUDGETS,
        incomeSources: DEFAULT_INCOME_SOURCES,
        monthlyIncome: Math.round(calculateMonthlyIncomeFromSources(DEFAULT_INCOME_SOURCES)),
        currentBalance: 2450,
        initialBalance: 2450,
        quickPresets: DEFAULT_QUICK_PRESETS,
      };
    case 'CLEAR_ALL_DATA':
      return {
        demoData: false,
        sampleCleanupDone: true,
        expenses: [],
        categories: DEFAULT_CATEGORIES,
        categoryGroups: DEFAULT_GROUPS,
        budgets: [],
        incomeSources: [],
        monthlyIncome: 0,
        currentBalance: 0,
        initialBalance: 0,
        userName: '',
        onboardingComplete: false,
        paydaySettings: null,
        notificationSettings: DEFAULT_NOTIFICATION_SETTINGS,
        quickPresets: DEFAULT_QUICK_PRESETS,
      };
    case 'SET_QUICK_PRESETS':
      return {
        ...state,
        quickPresets: Array.isArray(action.payload) ? action.payload : DEFAULT_QUICK_PRESETS,
      };
    case 'COMPLETE_ONBOARDING': {
      const bal = action.payload.currentBalance !== undefined
        ? Math.round((Number(action.payload.currentBalance) || 0) * 100) / 100
        : (action.payload.initialBalance !== undefined
            ? Math.round((Number(action.payload.initialBalance) || 0) * 100) / 100
            : (state.currentBalance !== undefined ? state.currentBalance : 0));
      return {
        ...stripSampleData(state),
        demoData: false,
        sampleCleanupDone: true,
        userName: action.payload.userName || '',
        onboardingComplete: true,
        currentBalance: bal,
        initialBalance: bal,
        paydaySettings: action.payload.paydaySettings || null,
        monthlyIncome: action.payload.monthlyIncome !== undefined ? action.payload.monthlyIncome : state.monthlyIncome,
        incomeSources: action.payload.incomeSources || state.incomeSources,
        notificationSettings: action.payload.notificationSettings || state.notificationSettings || DEFAULT_NOTIFICATION_SETTINGS,
      };
    }
    case 'UPDATE_NOTIFICATION_SETTINGS':
      return {
        ...state,
        notificationSettings: {
          ...(state.notificationSettings || DEFAULT_NOTIFICATION_SETTINGS),
          ...action.payload,
        },
      };
    case 'UPDATE_PAYDAY_SETTINGS':
      return {
        ...state,
        paydaySettings: { ...(state.paydaySettings || {}), ...action.payload },
      };
    case 'RECORD_PAYCHECK_PROMPT_DISMISSED':
      return {
        ...state,
        paydaySettings: {
          ...(state.paydaySettings || {}),
          lastPromptDate: action.payload,
        },
      };
    default:
      return state;
  }
}

export const STORAGE_KEY = 'spendy_app_data';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed.expenses)) {
        parsed.expenses = [];
      }
      if (!Array.isArray(parsed.categories) || parsed.categories.length === 0) {
        parsed.categories = DEFAULT_CATEGORIES;
      }
      if (!parsed.categoryGroups || !Array.isArray(parsed.categoryGroups) || parsed.categoryGroups.length === 0) {
        parsed.categoryGroups = DEFAULT_GROUPS;
      }
      if (!Array.isArray(parsed.budgets)) {
        parsed.budgets = [];
      }
      if (!parsed.incomeSources || !Array.isArray(parsed.incomeSources) || parsed.incomeSources.length === 0) {
        if (parsed.monthlyIncome && parsed.monthlyIncome > 0) {
          parsed.incomeSources = [
            { id: 'inc-legacy', name: 'Primary Salary / Income', amount: parsed.monthlyIncome, frequency: 'monthly', icon: '💼', color: '#1b4332' }
          ];
        } else {
          // No income configured (e.g. after "Clear All Data") – keep it empty, never inject fake income
          parsed.incomeSources = [];
          parsed.monthlyIncome = 0;
        }
      }
      if (parsed.currentBalance === undefined) {
        parsed.currentBalance = parsed.initialBalance !== undefined ? parsed.initialBalance : 0;
      }
      if (parsed.initialBalance === undefined) {
        parsed.initialBalance = parsed.currentBalance;
      }
      if (!parsed.notificationSettings) {
        parsed.notificationSettings = DEFAULT_NOTIFICATION_SETTINGS;
      }
      if (!Array.isArray(parsed.quickPresets) || parsed.quickPresets.length === 0) {
        parsed.quickPresets = DEFAULT_QUICK_PRESETS;
      } else if (
        parsed.quickPresets.length === 4 &&
        parsed.quickPresets.some(p => p.id === 'qp-transit') &&
        parsed.quickPresets.some(p => p.id === 'qp-groceries')
      ) {
        parsed.quickPresets = DEFAULT_QUICK_PRESETS;
      }
      if (parsed.onboardingComplete && !parsed.demoData && !parsed.sampleCleanupDone) {
        return { ...stripSampleData(parsed), sampleCleanupDone: true };
      }
      return parsed;
    }
  } catch {}
  return null;
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

const initialState = loadState() || {
  expenses: [],
  categories: DEFAULT_CATEGORIES,
  categoryGroups: DEFAULT_GROUPS,
  budgets: [],
  incomeSources: [],
  monthlyIncome: 0,
  currentBalance: 0,
  initialBalance: 0,
  demoData: false,
  sampleCleanupDone: true,
  userName: '',
  onboardingComplete: false,
  paydaySettings: null,
  notificationSettings: DEFAULT_NOTIFICATION_SETTINGS,
  quickPresets: DEFAULT_QUICK_PRESETS,
};

// ─── Context ──────────────────────────────────────────────────────────────────
const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function formatMoney(amount) {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
}

export function getCategoryById(categories, id) {
  return categories.find(c => c.id === id) || { name: 'Unknown', icon: '📦', color: '#94a3b8' };
}

export function getMonthExpenses(expenses, date = new Date()) {
  return expenses.filter(e => {
    const d = new Date(e.date);
    return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
  });
}

export function getWeekExpenses(expenses) {
  const start = new Date();
  start.setDate(start.getDate() - 7);
  return expenses.filter(e => new Date(e.date) >= start);
}

export function getTotalSpent(expenses) {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

export function getCategoryTotals(expenses, categories) {
  const totals = {};
  expenses.forEach(e => {
    totals[e.category] = (totals[e.category] || 0) + e.amount;
  });
  return Object.entries(totals)
    .map(([id, amount]) => ({ ...getCategoryById(categories, id), amount }))
    .sort((a, b) => b.amount - a.amount);
}
