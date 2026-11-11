import { useEffect } from 'react';
import { Sparkles, Check, Flame } from 'lucide-react';

export default function StreakCelebrationModal({ streak = 1, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    // Auto dismiss after 3.8 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 3800);

    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/55 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      data-testid="streak-celebration-modal"
    >
      <div
        className="w-full max-w-sm bg-white rounded-3xl p-6 text-center border border-[#e4dfd3] shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Confetti Background Glow */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-200/50 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-emerald-200/50 rounded-full blur-2xl pointer-events-none" />

        {/* Big Animated Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#fef3c7] via-[#fed7aa] to-[#fde68a] border border-[#fbd38d] flex items-center justify-center text-4xl shadow-md shadow-amber-500/20 animate-bounce">
          {streak > 1 ? '🔥' : '✨'}
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#fef3c7] text-[#92400e] text-[11px] font-black uppercase tracking-wider">
            <Sparkles size={12} />
            <span>Habit Level Up!</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#14261c] tracking-tight">
            {streak > 1 ? `${streak}-Day Streak!` : 'Day 1 Streak Started!'}
          </h3>
          <p className="text-xs text-[#5f7366] max-w-xs mx-auto leading-relaxed font-medium">
            {streak > 1
              ? `You're on fire! You have logged your expenses for ${streak} consecutive days.`
              : "Great job logging today's spending! Consistent tracking makes staying on budget effortless."}
          </p>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            data-testid="awesome-keep-going-btn"
            className="w-full py-3 bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] hover:from-[#245740] hover:to-[#388563] active:scale-95 text-white rounded-2xl text-xs sm:text-sm font-extrabold shadow-md shadow-[#1b4332]/25 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Awesome! Keep Going</span>
            <Sparkles size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
