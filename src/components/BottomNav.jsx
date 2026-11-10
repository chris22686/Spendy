import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CreditCard, Plus, Tag, MoreHorizontal, Target, BarChart3, Sparkles, BookOpen, RotateCcw, X } from 'lucide-react';
import ResetModal from './ResetModal';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    if (showMore) {
      document.body.dataset.modalOpen = 'true';
      return () => {
        delete document.body.dataset.modalOpen;
      };
    }
  }, [showMore]);

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
      <nav className="bottom-nav-safe fixed bottom-0 left-0 right-0 z-40 bg-[#ffffff]/98 backdrop-blur-md border-t border-[#e5e1d5] px-1 sm:px-4 pt-1.5 sm:pt-2 flex items-center justify-around shadow-[0_-4px_20px_rgba(27,67,50,0.06)] md:hidden">
        {mainNav.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;

          if (item.isCenter) {
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="relative -top-3.5 sm:-top-4 flex flex-col items-center group"
              >
                <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-gradient-to-tr from-[#133928] via-[#1b4332] to-[#2d6a4f] flex items-center justify-center text-white shadow-lg shadow-[#1b4332]/35 border-4 border-[#f8f7f2] transform transition-transform duration-200 active:scale-95 group-hover:scale-105">
                  <Plus size={24} strokeWidth={2.8} />
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-[#1b4332] mt-0.5">
                  Add
                </span>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="flex flex-col items-center py-1 px-1.5 sm:px-3 transition-colors duration-150 min-w-[52px]"
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
          className="flex flex-col items-center py-1 px-1.5 sm:px-3 transition-colors duration-150 cursor-pointer min-w-[52px]"
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
        <div
          className="fixed inset-0 z-50 bg-[#000000]/40 backdrop-blur-xs flex flex-col justify-end md:hidden animate-fade-in"
          onClick={() => setShowMore(false)}
        >
          <div
            className="bg-[#ffffff] rounded-t-3xl border-t border-[#e4dfd3] sheet-safe p-4 sm:p-5 space-y-4 shadow-2xl max-h-[calc(85dvh-env(safe-area-inset-top,0px))] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#f1ede3]">
              <div>
                <h3 className="text-base font-extrabold text-[#14261c]">More Tools & Pages</h3>
                <p className="text-xs text-[#718578]">Quick navigation</p>
              </div>
              <button
                onClick={() => setShowMore(false)}
                className="p-1.5 rounded-lg text-[#7d8f84] hover:text-[#14261c] bg-[#f8f7f2] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <button
                    key={item.to}
                    onClick={() => {
                      setShowMore(false);
                      navigate(item.to);
                    }}
                    className={`flex items-center gap-3.5 p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      isActive
                        ? 'border-[#1b4332] bg-[#eaf4ee]'
                        : 'border-[#e8e4da] bg-[#ffffff] hover:bg-[#f8f7f2]'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-[#1b4332] text-white shadow-xs'
                          : 'bg-[#f0f7f2] text-[#1b4332]'
                      }`}
                    >
                      <Icon size={18} strokeWidth={isActive ? 2.4 : 2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-bold truncate ${
                          isActive ? 'text-[#14261c]' : 'text-[#2b3a31]'
                        }`}
                      >
                        {item.label}
                      </p>
                      <p className="text-xs text-[#73877b] truncate mt-0.5">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Reset Data Shortcut */}
            <div className="pt-2 border-t border-[#f1ede3]">
              <button
                onClick={() => {
                  setShowMore(false);
                  setShowReset(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-[#fee2e2] bg-[#fffbfb] text-[#991b1b] text-xs font-bold hover:bg-[#fee2e2]/50 transition-colors cursor-pointer"
              >
                <RotateCcw size={15} />
                <span>Reset or Clear Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <ResetModal isOpen={showReset} onClose={() => setShowReset(false)} />
    </>
  );
}
