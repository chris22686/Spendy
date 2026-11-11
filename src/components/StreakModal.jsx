import { useEffect } from 'react';
import { useApp } from '../store';
import { Flame, X, Trophy, Calendar, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';

export default function StreakModal({ isOpen, onClose, streakInfo = {}, longestStreak = 0, onAddExpenseClick }) {
  const { state } = useApp();
  const { expenses = [] } = state;

  useEffect(() => {
    if (isOpen) {
      document.body.dataset.modalOpen = 'true';
    }
    return () => {
      delete document.body.dataset.modalOpen;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const { currentStreak = 0, loggedToday = false, isPendingToday = false } = streakInfo;

  // Calculate unique days with expenses this month
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const daysThisMonth = new Set(
    expenses
      .filter((e) => {
        try {
          const d = parseISO(e.date);
          return isWithinInterval(d, { start: monthStart, end: monthEnd });
        } catch {
          return false;
        }
      })
      .map((e) => e.date.split('T')[0])
  ).size;

  const record = Math.max(longestStreak, currentStreak);

  return (
    <div className="fixed inset-0 bg-[#000000]/60 backdrop-blur-xs z-50 overflow-y-auto px-4 modal-backdrop-safe flex flex-col items-center justify-start sm:justify-center animate-fade-in">
      <div
        className="my-auto w-full max-w-md bg-[#ffffff] border border-[#e4dfd3] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 modal-card-safe overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-[#f1ede3]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#fef3c7] to-[#fed7aa] text-[#b45309] flex items-center justify-center text-xl shadow-xs">
              🔥
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#14261c] tracking-tight">
                Daily Tracking Streak
              </h2>
              <p className="text-xs text-[#718578]">Build a stress-free money habit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            data-testid="close-streak-modal-btn"
            className="text-[#7d8f84] hover:text-[#14261c] p-1.5 rounded-lg hover:bg-[#f8f7f2] cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Hero Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1b4332] via-[#245740] to-[#2d6a4f] text-white text-center space-y-2 shadow-lg shadow-[#1b4332]/20">
          <div className="text-4xl animate-bounce">
            {currentStreak > 0 ? '🔥' : '✨'}
          </div>
          <p className="text-3xl font-black tracking-tight">
            {currentStreak > 0 ? `${currentStreak} Day${currentStreak > 1 ? 's' : ''}` : 'Ready for Day 1!'}
          </p>
          <p className="text-xs text-white/85 max-w-xs mx-auto leading-relaxed font-medium">
            {loggedToday
              ? "Awesome job! You've logged your spending today. Your streak is safe and active!"
              : isPendingToday
              ? `Keep the flame burning! Log today's spending to extend your streak to ${currentStreak + 1} days.`
              : 'Log today to start your daily streak and build financial control.'}
          </p>

          <div className="pt-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-xs ${
                loggedToday
                  ? 'bg-[#eaf4ee] text-[#1b4332]'
                  : 'bg-[#fef3c7] text-[#92400e]'
              }`}
            >
              {loggedToday ? (
                <>
                  <CheckCircle2 size={13} className="text-[#15803d]" />
                  <span>Completed Today</span>
                </>
              ) : (
                <>
                  <Sparkles size={13} />
                  <span>Pending Today</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-3 bg-[#f8f7f2] border border-[#e4dfd3] rounded-2xl">
            <p className="text-[10px] font-bold text-[#6e8074] uppercase tracking-wider mb-0.5">Current</p>
            <p className="text-lg font-black text-[#14261c]">{currentStreak}d</p>
          </div>
          <div className="p-3 bg-[#f8f7f2] border border-[#e4dfd3] rounded-2xl">
            <p className="text-[10px] font-bold text-[#6e8074] uppercase tracking-wider mb-0.5">Best</p>
            <p className="text-lg font-black text-[#b45309]">{record}d</p>
          </div>
          <div className="p-3 bg-[#f8f7f2] border border-[#e4dfd3] rounded-2xl">
            <p className="text-[10px] font-bold text-[#6e8074] uppercase tracking-wider mb-0.5">This Month</p>
            <p className="text-lg font-black text-[#1b4332]">{daysThisMonth}d</p>
          </div>
        </div>

        {/* Philosophy Card */}
        <div className="p-3.5 bg-[#f0f7f3] border border-[#cde2d6] rounded-2xl text-xs space-y-1.5 text-[#1b4332]">
          <p className="font-extrabold flex items-center gap-1.5">
            <span>🛡️</span>
            <span>Gentle & Stress-Free Habit</span>
          </p>
          <p className="text-[11px] leading-relaxed text-[#406853]">
            Missed a day? No worries, life happens! There are no penalties or guilt. Use the 1-Tap Quick Add buttons on your home screen to log coffee or lunch in 1 second.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          {!loggedToday ? (
            <button
              onClick={() => {
                onClose();
                if (onAddExpenseClick) onAddExpenseClick();
              }}
              className="w-full py-3 bg-[#1b4332] hover:bg-[#245740] active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-extrabold shadow-md shadow-[#1b4332]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>+ Log an Expense Today</span>
              <ArrowRight size={15} />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-3 bg-[#1b4332] hover:bg-[#245740] active:scale-98 text-white rounded-2xl text-xs sm:text-sm font-extrabold shadow-md shadow-[#1b4332]/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Keep It Up! ✨</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
