import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CreditCard, Plus, Tag, MoreHorizontal, Target, BarChart3, Sparkles, BookOpen, RotateCcw, X } from 'lucide-react';
import ResetModal from './ResetModal';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const mainNav = [
    { to: '/',           icon: LayoutDashboard, label: 'Home' },
    { to: '/expenses',   icon: CreditCard,      label: 'Expenses' },
    { to: '/add',        icon: Plus,            label: 'Add', isCenter: true },
    { to: '/categories', icon: Tag,             label: 'Categories' },
  ];

  const moreItems = [
    { to: '/budgets',   icon: Target,     label: 'Budgets',       desc: 'Monthly & weekly category caps' },
    { to: '/insights',  icon: BarChart3,  label: 'Insights',      desc: 'Visual charts & savings potential' },
    { to: '/plan',      icon: Sparkles,   label: 'Saving Plan',   desc: '7-day & 30-day adaptive targets' },
    { to: '/story',     icon: BookOpen,   label: 'Monthly Story', desc: 'Narrative summary & report export' },
  ];

  return (
    <>
      <nav className="bottom-nav-safe fixed bottom-0 left-0 right-0 z-40 bg-[#ffffff]/98 backdrop-blur-md border-t border-[#e5e1d5] px-2 sm:px-4 pt-2 flex items-center justify-around shadow-[0_-4px_20px_rgba(27,67,50,0.06)] md:hidden">
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          if (item.isCenter) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="relative -top-4 flex flex-col items-center group"
              >
                <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#133928] via-[#1b4332] to-[#2d6a4f] flex items-center justify-center text-white shadow-lg shadow-[#1b4332]/35 border-4 border-[#f8f7f2] transform transition-transform duration-200 active:scale-95 group-hover:scale-105">
                  <Plus size={26} strokeWidth={2.8} />
                </div>
                <span className="text-[11px] font-bold text-[#1b4332] mt-0.5">
                  Add
                </span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex flex-col items-center py-1 px-3 transition-colors duration-150"
            >
              <Icon
                size={20}
                className={isActive ? 'text-[#1b4332] stroke-[2.4]' : 'text-[#7e8e83]'}
              />
              <span
                className={`text-[10px] mt-1 font-semibold ${
                  isActive ? 'text-[#1b4332]' : 'text-[#7e8e83]'
                }`}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}

        <button
          onClick={() => setShowMore(true)}
          className="flex flex-col items-center py-1 px-3 transition-colors duration-150 cursor-pointer"
        >
          <MoreHorizontal
            size={20}
            className={['/budgets', '/insights', '/plan', '/story'].includes(location.pathname) ? 'text-[#1b4332] stroke-[2.4]' : 'text-[#7e8e83]'}
          />
          <span
            className={`text-[10px] mt-1 font-semibold ${
              ['/budgets', '/insights', '/plan', '/story'].includes(location.pathname) ? 'text-[#1b4332]' : 'text-[#7e8e83]'
            }`}
          >
            More
          </span>
        </button>
      </nav>

      {showMore && (
        <div className="fixed inset-0 z-50 bg-[#000000]/40 backdrop-blur-xs flex flex-col justify-end md:hidden animate-fade-in">
          <div className="bg-[#ffffff] rounded-t-3xl border-t border-[#e4dfd3] sheet-safe p-5 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#f1ede3]">
              <div>
                <h3 className="text-base font-extrabold text-[#14261c]">More Tools & Pages</h3>
                <p className="text-xs text-[#718578]">Quick navigation</p>
              </div>
              <button
                onClick={() => setShowMore(false)}
                className="p-1.5 rounded-lg text-[#7d8f84] hover:text-[#14261c] bg-[#f8f7f2]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2.5">
              {moreItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <button
                    key={item.to}
                    onClick={() => {
                      navigate(item.to);
                      setShowMore(false);
                    }}
                    className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all text-left ${
                      isActive
                        ? 'border-[#1b4332] bg-[#eaf4ee]'
                        : 'border-[#e8e4da] bg-[#f8f7f2] hover:bg-[#f0ece1]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#ffffff] border border-[#e4dfd3] flex items-center justify-center text-[#1b4332] shrink-0 shadow-2xs">
                      <Icon size={18} strokeWidth={2.4} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-[#14261c]">{item.label}</p>
                      <p className="text-xs text-[#718578]">{item.desc}</p>
                    </div>
                  </button>
                );
              })}

              <button
                onClick={() => {
                  setShowMore(false);
                  setShowReset(true);
                }}
                className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl border border-[#fee2e2] bg-[#fffbfb] hover:bg-[#fef2f2] text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-[#fee2e2] text-[#991b1b] flex items-center justify-center shrink-0">
                  <RotateCcw size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#991b1b]">Reset / Clear Data</p>
                  <p className="text-xs text-[#718578]">Start fresh or restore demo sample</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <ResetModal isOpen={showReset} onClose={() => setShowReset(false)} />
    </>
  );
}
