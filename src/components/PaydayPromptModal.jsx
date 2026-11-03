import { useState } from 'react';
import { useApp, formatMoney } from '../store';
import { DollarSign, Check, X, Calendar, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

export default function PaydayPromptModal({ onClose }) {
  const { state, dispatch } = useApp();
  const { incomeSources = [], paydaySettings, userName } = state;

  const [exactAmount, setExactAmount] = useState('');
  const [selectedSourceId, setSelectedSourceId] = useState(incomeSources[0]?.id || '');
  const [error, setError] = useState('');

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const handleConfirm = (e) => {
    e.preventDefault();
    const val = parseFloat(exactAmount);
    if (isNaN(val) || val <= 0) {
      setError('Please enter the exact amount received');
      return;
    }

    // Update the chosen income source
    if (selectedSourceId) {
      const src = incomeSources.find((s) => s.id === selectedSourceId);
      if (src) {
        dispatch({
          type: 'UPDATE_INCOME_SOURCE',
          payload: { ...src, amount: val },
        });
      }
    }

    // Dismiss prompt for today
    dispatch({
      type: 'RECORD_PAYCHECK_PROMPT_DISMISSED',
      payload: todayStr,
    });

    onClose();
  };

  const handleSkip = () => {
    dispatch({
      type: 'RECORD_PAYCHECK_PROMPT_DISMISSED',
      payload: todayStr,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/55 backdrop-blur-xs z-[85] flex items-center justify-center p-4">
      <div className="bg-[#ffffff] border border-[#e4dfd3] rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Banner */}
        <div className="bg-gradient-to-br from-[#133928] via-[#1b4332] to-[#2d6a4f] p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-xl shadow-xs">
              🎉
            </div>
            <div>
              <h2 className="text-base font-extrabold leading-tight">Payday Check-In!</h2>
              <p className="text-xs text-white/80">
                {userName ? `Hey ${userName}, it's pay time!` : "It's payday time!"}
              </p>
            </div>
          </div>
          <button
            onClick={handleSkip}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleConfirm} className="p-5 space-y-4">
          <div className="p-3 bg-[#eaf4ee] rounded-2xl border border-[#cde2d6] text-xs text-[#1b4332]">
            <p className="font-bold flex items-center gap-1.5 mb-0.5">
              <Sparkles size={14} />
              <span>Variable Income Tracker</span>
            </p>
            <p className="text-[11px] leading-relaxed">
              Because your paycheck amount changes, enter the exact amount you were paid today so your budget reflects reality.
            </p>
          </div>

          {error && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {incomeSources.length > 1 && (
            <div>
              <label className="text-xs font-bold text-[#55695e] uppercase tracking-wider mb-1.5 block">
                Which paycheck was deposited?
              </label>
              <select
                value={selectedSourceId}
                onChange={(e) => setSelectedSourceId(e.target.value)}
                className="w-full bg-[#f8f7f2] border border-[#dcd7cb] rounded-xl px-3 py-2.5 text-sm font-semibold text-[#14261c] focus:outline-none focus:border-[#1b4332]"
              >
                {incomeSources.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.icon || '💼'} {s.name} ({formatMoney(s.amount)})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-[#55695e] uppercase tracking-wider mb-1.5 block">
              Exact Amount Deposited (€)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7d8f84] text-base font-bold">€</span>
              <input
                type="number"
                step="any"
                placeholder="0.00"
                value={exactAmount}
                onChange={(e) => {
                  setExactAmount(e.target.value);
                  setError('');
                }}
                autoFocus
                className="w-full bg-[#f8f7f2] border border-[#dcd7cb] rounded-xl pl-9 pr-4 py-2.5 text-base font-bold text-[#14261c] focus:outline-none focus:border-[#1b4332]"
              />
            </div>
          </div>

          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 py-2.5 rounded-xl border border-[#e4dfd3] text-xs font-bold text-[#65776c] hover:bg-[#f8f7f2]"
            >
              Skip for Now
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-[#1b4332] hover:bg-[#245740] active:scale-98 text-white rounded-xl text-xs font-bold shadow-md shadow-[#1b4332]/25 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Check size={15} strokeWidth={2.8} />
              <span>Confirm Paycheck</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
