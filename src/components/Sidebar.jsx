import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, CreditCard, PlusCircle,
  Tag, Target, BarChart3, Sparkles, BookOpen, RotateCcw
} from 'lucide-react';
import ResetModal from './ResetModal';

const NAV = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard'  },
  { to: '/expenses',  icon: CreditCard,      label: 'Expenses'   },
  { to: '/add',       icon: PlusCircle,      label: 'Add Expense'},
  { to: '/categories',icon: Tag,             label: 'Categories' },
  { to: '/budgets',   icon: Target,          label: 'Budgets'    },
  { to: '/insights',  icon: BarChart3,       label: 'Insights'   },
  { to: '/plan',      icon: Sparkles,        label: 'Saving Plan'},
  { to: '/story',     icon: BookOpen,        label: 'Monthly Story' },
];

export default function Sidebar() {
  const [showReset, setShowReset] = useState(false);

  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-20 lg:w-64 bg-[#ffffff] border-r border-[#e7e4da] flex-col z-40 shadow-[2px_0_12px_rgba(27,67,50,0.02)] pt-[env(safe-area-inset-top,0px)] pb-[env(safe-area-inset-bottom,0px)] pl-[env(safe-area-inset-left,0px)]">
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 lg:px-5 py-5 lg:py-6 border-b border-[#ece8de]">
          <div className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center flex-shrink-0 shadow-sm shadow-[#1b4332]/30">
            <img src="/icon.png" alt="Spendy Logo" className="w-full h-full object-cover" />
          </div>
          <div className="hidden lg:block">
            <span className="text-xl font-bold tracking-tight text-[#143928]">Spendy</span>
            <span className="block text-[10px] uppercase font-semibold text-[#667d70] tracking-wider -mt-0.5">Finance Tracker</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 lg:py-5 px-2.5 lg:px-3 space-y-1.5 overflow-y-auto">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              title={label}
              className={({ isActive }) =>
                `flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl transition-all duration-150 group
                ${isActive
                  ? 'bg-[#eaf3ed] text-[#143928] font-semibold shadow-sm'
                  : 'text-[#63756a] hover:text-[#143928] hover:bg-[#f3f1ea]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    size={20}
                    className={`flex-shrink-0 transition-colors ${
                      isActive ? 'text-[#1b4332] stroke-[2.4]' : 'text-[#7a8c81] group-hover:text-[#1b4332]'
                    }`}
                  />
                  <span className={`hidden lg:block text-sm tracking-tight ${isActive ? 'text-[#143928] font-bold' : ''}`}>
                    {label}
                  </span>
                  {to === '/add' && (
                    <span className="hidden lg:flex ml-auto w-5 h-5 bg-[#1b4332] rounded-full items-center justify-center shadow-sm">
                      <span className="text-white text-xs font-bold leading-none">+</span>
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Reset Data & User Footer */}
        <div className="p-3 lg:p-3.5 border-t border-[#ece8de] space-y-2">
          <button
            onClick={() => setShowReset(true)}
            className="w-full flex items-center justify-center lg:justify-start gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-[#718578] hover:text-[#991b1b] hover:bg-[#fee2e2]/60 transition-colors cursor-pointer"
            title="Reset or clear data"
          >
            <RotateCcw size={16} />
            <span className="hidden lg:block">Reset Data</span>
          </button>

          <div className="hidden lg:flex items-center gap-3 px-2 py-2 rounded-xl bg-[#f8f7f2] border border-[#e7e3d8]">
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shadow-xs">
              <img src="/icon.png" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-[#143928] truncate">My Wallet</p>
              <p className="text-[11px] text-[#718578] truncate">Standard Plan</p>
            </div>
          </div>
        </div>
      </aside>

      <ResetModal isOpen={showReset} onClose={() => setShowReset(false)} />
    </>
  );
}
