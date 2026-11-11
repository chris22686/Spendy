import { useState, useEffect } from 'react';
import { useApp } from '../store';
import { ArrowRight, User, Check, Sparkles, Wallet } from 'lucide-react';

// Paycheck day helpers: a month has at most 31 days
const MIN_PAY_DAY = 1;
const MAX_PAY_DAY = 31;

// Keep only digits while typing and never allow a value above 31
function sanitizePayDayInput(raw) {
  const digits = String(raw).replace(/\D/g, '').slice(0, 2);
  if (digits === '') return '';
  const n = parseInt(digits, 10);
  if (n > MAX_PAY_DAY) return String(MAX_PAY_DAY);
  return digits;
}

function isValidPayDay(value) {
  const n = Number(value);
  return Number.isInteger(n) && n >= MIN_PAY_DAY && n <= MAX_PAY_DAY;
}

export default function OnboardingModal({ onComplete }) {
  const { dispatch } = useApp();

  // Wizard steps:
  // 1 = Name
  // 2 = Current Balance (The amount you have right now)
  // 3 = Pay Frequency & Dates
  // 4 = Typical Paycheck / Salary & Variance
  const [step, setStep] = useState(1);

  // Step 1: Name
  const [userName, setUserName] = useState('');

  // Step 2: Current money you have right now
  const [currentAmount, setCurrentAmount] = useState('');

  // Step 3: Pay Schedule
  // Options: 'twice_month' (Every 15 days), 'monthly_1' (Once a month), 'weekly' (Every week)
  const [paySchedule, setPaySchedule] = useState('twice_month');
  const [payDay1, setPayDay1] = useState('1');
  const [payDay2, setPayDay2] = useState('15');

  // Step 4: Income amount & variability
  const [baseAmount, setBaseAmount] = useState('');
  const [isVariable, setIsVariable] = useState(true);
  const [error, setError] = useState('');

  // Prevent background scroll while modal is active
  useEffect(() => {
    document.body.dataset.modalOpen = 'true';
    return () => {
      delete document.body.dataset.modalOpen;
    };
  }, []);

  const handleNextFromStep1 = (e) => {
    e?.preventDefault();
    if (!userName.trim()) {
      setError('Please enter your name or nickname');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleNextFromStep2 = (e) => {
    e?.preventDefault();
    if (currentAmount.trim() !== '') {
      const parsed = parseFloat(currentAmount);
      if (isNaN(parsed) || parsed < 0) {
        setError('Please enter a valid amount or leave blank for €0.00');
        return;
      }
    }
    setError('');
    setStep(3);
  };

  const handleNextFromStep3 = () => {
    if (paySchedule === 'twice_month' || paySchedule === 'monthly_1') {
      if (!isValidPayDay(payDay1) || (paySchedule === 'twice_month' && !isValidPayDay(payDay2))) {
        setError(`Paycheck days must be between ${MIN_PAY_DAY} and ${MAX_PAY_DAY}`);
        return;
      }
      if (paySchedule === 'twice_month' && Number(payDay1) === Number(payDay2)) {
        setError('Please choose two different paycheck days');
        return;
      }
    }
    setError('');
    setStep(4);
  };

  const handleFinish = (e) => {
    e?.preventDefault();
    let parsedAmount = 0;
    if (!isVariable) {
      parsedAmount = parseFloat(baseAmount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        setError('Please enter your paycheck amount or enable variable pay');
        return;
      }
    }

    // Determine starting/current balance
    const parsedCurrent = parseFloat(currentAmount);
    const initialBalance = (!isNaN(parsedCurrent) && parsedCurrent >= 0) ? parsedCurrent : 0;

    // Generate income sources based on selection
    let generatedSources = [];
    let calculatedMonthly = parsedAmount;

    if (paySchedule === 'twice_month') {
      calculatedMonthly = Math.round(parsedAmount * 2);
      generatedSources = [
        {
          id: 'inc-pay-1',
          name: `Salary (Day ${payDay1} Paycheck)`,
          amount: parsedAmount,
          frequency: 'bi-weekly',
          icon: '💼',
          color: '#1b4332',
        },
        {
          id: 'inc-pay-2',
          name: `Salary (Day ${payDay2} Paycheck)`,
          amount: parsedAmount,
          frequency: 'bi-weekly',
          icon: '🏦',
          color: '#2d6a4f',
        },
      ];
    } else if (paySchedule === 'weekly') {
      calculatedMonthly = Math.round((parsedAmount * 52) / 12);
      generatedSources = [
        {
          id: 'inc-pay-weekly',
          name: 'Weekly Salary / Earnings',
          amount: parsedAmount,
          frequency: 'weekly',
          icon: '💼',
          color: '#1b4332',
        },
      ];
    } else {
      calculatedMonthly = parsedAmount;
      generatedSources = [
        {
          id: 'inc-pay-monthly',
          name: `Monthly Salary (Day ${payDay1})`,
          amount: parsedAmount,
          frequency: 'monthly',
          icon: '💼',
          color: '#1b4332',
        },
      ];
    }

    const paydaySettings = {
      schedule: paySchedule,
      payDays: (paySchedule === 'twice_month' ? [payDay1, payDay2] : [payDay1])
        .map(d => Math.min(MAX_PAY_DAY, Math.max(MIN_PAY_DAY, parseInt(d, 10) || MIN_PAY_DAY))),
      isVariable: Boolean(isVariable),
      lastPromptDate: '',
    };

    dispatch({
      type: 'COMPLETE_ONBOARDING',
      payload: {
        userName: userName.trim(),
        currentBalance: initialBalance,
        initialBalance: initialBalance,
        monthlyIncome: calculatedMonthly,
        incomeSources: generatedSources,
        paydaySettings,
      },
    });

    if (onComplete) onComplete();
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/65 backdrop-blur-sm z-[90] overflow-y-auto px-4 modal-backdrop-safe flex flex-col items-center justify-start sm:justify-center">
      <div
        className="my-auto w-full max-w-lg bg-[#ffffff] border border-[#e4dfd3] rounded-3xl shadow-2xl overflow-hidden flex flex-col modal-card-safe animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Progress & Banner */}
        <div className="shrink-0 bg-gradient-to-r from-[#133928] via-[#1b4332] to-[#2d6a4f] p-4 sm:p-6 text-white text-center relative">
          <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-2xl bg-white/15 flex items-center justify-center mb-2 sm:mb-3 text-xl sm:text-2xl shadow-inner">
            {step === 1 ? '👋' : step === 2 ? '💳' : step === 3 ? '🗓️' : '💰'}
          </div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight">
            {step === 1 && 'Welcome to Spendy!'}
            {step === 2 && 'How much money do you have now?'}
            {step === 3 && 'How often do you get paid?'}
            {step === 4 && 'Salary & Variable Pay'}
          </h2>
          <p className="text-xs text-white/80 mt-1 font-medium max-w-sm mx-auto">
            {step === 1 && "Let's personalize your budgeting experience in 4 quick steps."}
            {step === 2 && 'Enter your current funds across cash & bank accounts.'}
            {step === 3 && 'Set your pay schedule so Spendy can notify you on payday.'}
            {step === 4 && (isVariable ? 'Confirm variable paycheck tracking and payday reminders.' : 'Enter your fixed paycheck amount.')}
          </p>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-2 mt-3 sm:mt-4">
            {[1, 2, 3, 4].map((s) => (
              <span
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  step === s ? 'w-8 bg-white' : 'w-2 bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* ── STEP 1: Name ── */}
          {step === 1 && (
            <form onSubmit={handleNextFromStep1} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#55695e] uppercase tracking-wider mb-2 block">
                  What should we call you?
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7d8f84]" size={18} />
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => {
                      setUserName(e.target.value);
                      setError('');
                    }}
                    onFocus={() => window.scrollTo(0, 0)}
                    placeholder="e.g. Alex, Chris, Stefan..."
                    className="w-full bg-[#f8f7f2] border border-[#dcd7cb] rounded-2xl pl-11 pr-4 py-3 text-base font-bold text-[#14261c] focus:outline-none focus:border-[#1b4332] transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#1b4332] hover:bg-[#245740] active:scale-98 text-white rounded-2xl text-sm font-extrabold shadow-md shadow-[#1b4332]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 2: Current Balance / Money You Have Now ── */}
          {step === 2 && (
            <form onSubmit={handleNextFromStep2} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#55695e] uppercase tracking-wider mb-2 block">
                  Current Available Balance
                </label>
                <div className="rounded-3xl bg-gradient-to-br from-[#133928] via-[#1b4332] to-[#2d6a4f] border border-[#2d6a4f]/50 p-5 sm:p-6 text-center text-white shadow-xl shadow-[#1b4332]/20 relative overflow-hidden">
                  <p className="text-[11px] font-bold text-[#a0cfb2] uppercase tracking-wider mb-2">
                    Total Money You Have Right Now
                  </p>
                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                    <span className="text-3xl sm:text-4xl font-light text-[#86bfa0]">€</span>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      value={currentAmount}
                      onChange={(e) => {
                        setCurrentAmount(e.target.value);
                        setError('');
                      }}
                      onFocus={() => window.scrollTo(0, 0)}
                      placeholder="0.00"
                      className="text-4xl sm:text-5xl font-extrabold text-white bg-transparent border-none outline-none w-56 text-center placeholder-white/30 focus:ring-0"
                    />
                  </div>
                  <p className="text-[11px] text-[#a0cfb2]/85 mt-2 font-medium">
                    Cash in wallet, checking & savings accounts
                  </p>
                </div>
                <p className="text-xs text-[#6e8074] leading-relaxed pt-2">
                  This is your starting balance. Every time you log an expense, Spendy will automatically subtract it from this balance.
                </p>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-2xl border border-[#e4dfd3] text-xs font-bold text-[#65776c] hover:bg-[#f8f7f2] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#1b4332] hover:bg-[#245740] active:scale-98 text-white rounded-2xl text-sm font-extrabold shadow-md shadow-[#1b4332]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Next Step</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* ── STEP 3: Pay Schedule ── */}
          {step === 3 && (
            <div className="space-y-3.5 sm:space-y-4">
              <label className="text-xs font-bold text-[#55695e] uppercase tracking-wider block">
                Select your payday schedule:
              </label>

              <div className="space-y-2.5">
                {[
                  {
                    id: 'twice_month',
                    title: 'Every 15 Days (Twice a Month)',
                    desc: 'e.g. 1st and 15th of every month',
                    icon: '🌓',
                  },
                  {
                    id: 'monthly_1',
                    title: 'Monthly (Once a Month)',
                    desc: 'e.g. End of month or 1st of each month',
                    icon: '🌕',
                  },
                  {
                    id: 'weekly',
                    title: 'Weekly (Every 7 Days)',
                    desc: 'Receive payments every week',
                    icon: '⚡',
                  },
                ].map((opt) => (
                  <div
                    key={opt.id}
                    onClick={() => setPaySchedule(opt.id)}
                    className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                      paySchedule === opt.id
                        ? 'border-[#1b4332] bg-[#eaf4ee]'
                        : 'border-[#e4dfd3] bg-[#f8f7f2] hover:bg-[#ece8df]'
                    }`}
                  >
                    <span className="text-xl sm:text-2xl">{opt.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-[#14261c]">{opt.title}</p>
                      <p className="text-[11px] sm:text-xs text-[#6e8074]">{opt.desc}</p>
                    </div>
                    {paySchedule === opt.id && (
                      <div className="w-5 h-5 rounded-full bg-[#1b4332] flex items-center justify-center text-white shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Day selection */}
              {paySchedule === 'twice_month' && (
                <div className="p-3 bg-[#f8f7f2] rounded-2xl border border-[#e4dfd3] flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-[#14261c]">Paycheck days:</span>
                  <div className="flex items-center gap-2">
                    <span>Day</span>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={payDay1}
                      inputMode="numeric"
                      onChange={(e) => { setPayDay1(sanitizePayDayInput(e.target.value)); setError(''); }}
                      onFocus={() => window.scrollTo(0, 0)}
                      className="w-12 bg-white border border-[#dcd7cb] rounded-lg px-2 py-1.5 text-center font-bold text-[#14261c] text-base sm:text-xs"
                    />
                    <span>& Day</span>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={payDay2}
                      inputMode="numeric"
                      onChange={(e) => { setPayDay2(sanitizePayDayInput(e.target.value)); setError(''); }}
                      onFocus={() => window.scrollTo(0, 0)}
                      className="w-12 bg-white border border-[#dcd7cb] rounded-lg px-2 py-1.5 text-center font-bold text-[#14261c] text-base sm:text-xs"
                    />
                  </div>
                </div>
              )}

              {paySchedule === 'monthly_1' && (
                <div className="p-3 bg-[#f8f7f2] rounded-2xl border border-[#e4dfd3] flex items-center justify-between gap-2 text-xs">
                  <span className="font-bold text-[#14261c]">Day of month you get paid:</span>
                  <div className="flex items-center gap-2">
                    <span>Day</span>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={payDay1}
                      inputMode="numeric"
                      onChange={(e) => { setPayDay1(sanitizePayDayInput(e.target.value)); setError(''); }}
                      onFocus={() => window.scrollTo(0, 0)}
                      className="w-14 bg-white border border-[#dcd7cb] rounded-lg px-2 py-1.5 text-center font-bold text-[#14261c] text-base sm:text-xs"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-3 rounded-2xl border border-[#e4dfd3] text-xs font-bold text-[#65776c] hover:bg-[#f8f7f2] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextFromStep3}
                  className="flex-1 py-3 bg-[#1b4332] hover:bg-[#245740] active:scale-98 text-white rounded-2xl text-sm font-extrabold shadow-md shadow-[#1b4332]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Next Step</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 4: Paycheck Amount / Variable Check ── */}
          {step === 4 && (
            <form onSubmit={handleFinish} className="space-y-4">
              {/* Variable Paycheck Toggle */}
              <div
                onClick={() => {
                  setIsVariable(!isVariable);
                  setError('');
                }}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isVariable
                    ? 'border-[#1b4332] bg-[#eaf4ee]'
                    : 'border-[#e4dfd3] bg-[#f8f7f2] hover:bg-[#ece8df]'
                }`}
              >
                <div className="pt-0.5">
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                      isVariable ? 'bg-[#1b4332] text-white' : 'border border-[#dcd7cb] bg-white'
                    }`}
                  >
                    {isVariable && <Check size={14} strokeWidth={3} />}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#14261c]">
                    My paycheck amount changes / varies each time
                  </p>
                  <p className="text-[11px] text-[#6e8074] mt-0.5">
                    Spendy will prompt you on your payday date to enter the exact amount you were paid!
                  </p>
                </div>
              </div>

              {/* Only ask for paycheck amount if pay does NOT vary */}
              {isVariable ? (
                <div className="p-3.5 sm:p-4 bg-[#f8f7f2] border border-[#e4dfd3] rounded-2xl text-xs space-y-1">
                  <p className="font-bold text-[#14261c] flex items-center gap-1.5">
                    <span>✨</span>
                    <span>No estimated amount needed</span>
                  </p>
                  <p className="text-[11px] leading-relaxed text-[#6e8074]">
                    Because your paycheck varies each time, you don't need to enter an estimate now. On your paycheck dates ${paySchedule === 'twice_month' ? `(Day ${payDay1} & Day ${payDay2})` : paySchedule === 'weekly' ? '(every week)' : `(Day ${payDay1})`}, Spendy will prompt you to enter the exact amount you received.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5 animate-in fade-in duration-200">
                  <label className="text-xs font-bold text-[#55695e] uppercase tracking-wider block">
                    {paySchedule === 'twice_month'
                      ? 'Fixed Amount per 15-day Paycheck (€)'
                      : paySchedule === 'weekly'
                      ? 'Fixed Weekly Paycheck (€)'
                      : 'Fixed Monthly Salary (€)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7d8f84] text-base font-bold">€</span>
                    <input
                      type="number"
                      step="any"
                      placeholder="0.00"
                      value={baseAmount}
                      inputMode="decimal"
                      onChange={(e) => {
                        setBaseAmount(e.target.value);
                        setError('');
                      }}
                      onFocus={() => window.scrollTo(0, 0)}
                      className="w-full bg-[#f8f7f2] border border-[#dcd7cb] rounded-2xl pl-9 pr-4 py-3 text-base font-bold text-[#14261c] focus:outline-none focus:border-[#1b4332]"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-3 rounded-2xl border border-[#e4dfd3] text-xs font-bold text-[#65776c] hover:bg-[#f8f7f2] cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#1b4332] hover:bg-[#245740] active:scale-98 text-white rounded-2xl text-sm font-extrabold shadow-md shadow-[#1b4332]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles size={16} />
                  <span>Start Budgeting</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
