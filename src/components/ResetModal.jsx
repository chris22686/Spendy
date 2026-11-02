import { useState } from 'react';
import { useApp } from '../store';
import { RotateCcw, Trash2, X, CheckCircle } from 'lucide-react';

export default function ResetModal({ isOpen, onClose }) {
  const { dispatch } = useApp();
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleResetDemo = () => {
    dispatch({ type: 'RESET_DEMO_DATA' });
    setSuccessMsg('Reset to default demo data (30 sample expenses)');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  const handleClearAll = () => {
    dispatch({ type: 'CLEAR_ALL_DATA' });
    setSuccessMsg('All expenses cleared! You have a fresh clean start.');
    setTimeout(() => {
      setSuccessMsg('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#ffffff] border border-[#e4dfd3] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#fee2e2] text-[#991b1b] flex items-center justify-center">
              <RotateCcw size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#14261c]">Data Management</h2>
              <p className="text-xs text-[#718578]">Reset or clear your app records</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#7d8f84] hover:text-[#14261c] p-1.5 rounded-lg hover:bg-[#f8f7f2] cursor-pointer">
            <X size={18} />
          </button>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 p-3 bg-[#eaf4ee] border border-[#cce3d5] rounded-xl text-xs font-bold text-[#1b4332]">
            <CheckCircle size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleClearAll}
            className="w-full flex items-start gap-3.5 p-4 rounded-2xl border border-[#fee2e2] bg-[#fffbfb] hover:bg-[#fef2f2] transition-colors text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#fee2e2] text-[#b91c1c] flex items-center justify-center shrink-0 mt-0.5">
              <Trash2 size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#991b1b]">Clear All Data (Start Fresh)</p>
              <p className="text-xs text-[#7f8e83] mt-0.5">
                Wipes all 30 sample expenses to zero. Perfect when you're ready to start tracking your own real finances.
              </p>
            </div>
          </button>

          <button
            onClick={handleResetDemo}
            className="w-full flex items-start gap-3.5 p-4 rounded-2xl border border-[#e8e4da] bg-[#f8f7f2] hover:bg-[#f0ede4] transition-colors text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#eaf4ee] text-[#1b4332] flex items-center justify-center shrink-0 mt-0.5">
              <RotateCcw size={18} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-[#14261c]">Reload Sample Demo Data</p>
              <p className="text-xs text-[#7f8e83] mt-0.5">
                Restores the 30 realistic sample transactions, initial category caps, and standard metrics.
              </p>
            </div>
          </button>
        </div>

        <div className="pt-2 border-t border-[#f1ede3] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#e4dfd3] text-sm font-semibold text-[#65776c] hover:bg-[#f8f7f2] cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
