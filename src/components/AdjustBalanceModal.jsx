import { useState, useEffect } from 'react';
import { useApp, formatMoney } from '../store';
import { Wallet, X, Check, ArrowRight } from 'lucide-react';

export default function AdjustBalanceModal({ isOpen, onClose }) {
  const { state, dispatch } = useApp();
  const currentBalance = state.currentBalance !== undefined ? state.currentBalance : 0;

  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAmount(currentBalance.toString());
      setError('');
      document.body.dataset.modalOpen = 'true';
    }
    return () => {
      delete document.body.dataset.modalOpen;
    };
  }, [isOpen, currentBalance]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (isNaN(val) || val < 0) {
      setError('Please enter a valid positive balance or 0');
      return;
    }

    dispatch({
      type: 'SET_BALANCE',
      payload: val,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/60 backdrop-blur-xs z-[85] overflow-y-auto px-4 modal-backdrop-safe flex flex-col items-center justify-start sm:justify-center animate-fade-in">
      <div
        className="my-auto w-full max-w-md bg-[#ffffff] border border-[#e4dfd3] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 modal-card-safe overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#eaf4ee] text-[#1b4332] flex items-center justify-center">
              <Wallet size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#14261c]">Adjust Current Balance</h2>
              <p className="text-xs text-[#718578]">Update available funds across cash & bank</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#718578] hover:text-[#14261c] hover:bg-[#f8f7f2] transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="rounded-2xl bg-gradient-to-br from-[#133928] via-[#1b4332] to-[#2d6a4f] p-5 text-center text-white shadow-lg">
            <p className="text-[11px] font-bold text-[#a0cfb2] uppercase tracking-wider mb-1.5">
              Current Available Money
            </p>
            <div className="flex items-center justify-center gap-1">
              <span className="text-2xl sm:text-3xl font-light text-[#86bfa0]">€</span>
              <input
                type="number"
                step="any"
                min="0"
                autoFocus
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                placeholder="0.00"
                className="text-3xl sm:text-4xl font-extrabold text-white bg-transparent border-none outline-none w-48 text-center placeholder-white/30 focus:ring-0"
              />
            </div>
            <p className="text-[10px] text-[#a0cfb2]/80 mt-1 font-medium">
              Previously: {formatMoney(currentBalance)}
            </p>
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-[#e4dfd3] hover:bg-[#f8f7f2] rounded-xl text-xs font-bold text-[#55695e] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#1b4332] hover:bg-[#245740] active:scale-98 text-white rounded-xl text-xs font-extrabold shadow-md shadow-[#1b4332]/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Check size={15} strokeWidth={2.8} />
              <span>Save Balance</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
