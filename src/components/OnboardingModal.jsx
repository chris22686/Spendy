import { useState } from 'react';
import { useApp } from '../store';
import { Sparkles, ArrowRight, User, DollarSign, Calendar, Check, HelpCircle } from 'lucide-react';

export default function OnboardingModal({ onComplete }) {
  const { dispatch } = useApp();

  // Wizard steps: 1 = Name, 2 = Pay Frequency, 3 = Amount & Variance
  const [step, setStep] = useState(1);

  // Step 1: Name
  const [userName, setUserName] = useState('');

  // Step 2: Pay Schedule
  // Options: 'monthly_1' (Once a month), 'twice_month' (Every 15 days / 1st & 15th), 'weekly' (Every week), 'biweekly' (Every 2 weeks)
  const [paySchedule, setPaySchedule] = useState('twice_month');
  const [payDay1, setPayDay1] = useState('1');
  const [payDay2, setPayDay2] = useState('15');

  // Step 3: Income amount & variability
  const [baseAmount, setBaseAmount] = useState('');
  const [isVariable, setIsVariable] = useState(true);
  const [error, setError] = useState('');

  const handleNextFromStep1 = (e) => {
    e?.preventDefault();
    if (!userName.trim()) {
      setError('Please enter your name or nickname');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleNextFromStep2 = () => {
    setError('');
    setStep(3);
  };

  const handleFinish = (e) => {
    e?.preventDefault();
    const parsedAmount = parseFloat(baseAmount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter your typical or estimated salary amount');
      return;
    }

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
      payDays: paySchedule === 'twice_month' ? [parseInt(payDay1, 10), parseInt(payDay2, 10)] : [parseInt(payDay1, 10)],
      isVariable: Boolean(isVariable),
      lastPromptDate: '',
    };

    dispatch({
      type: 'COMPLETE_ONBOARDING',
      payload: {
        userName: userName.trim(),
        monthlyIncome: calculatedMonthly,
        incomeSources: generatedSources,
        paydaySettings,
      },
    });

    if (onComplete) onComplete();
  };

  return (
    <div className="fixed inset-0 bg-[#000000]/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
      <div className="bg-[#ffffff] border border-[#e4dfd3] rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Progress & Banner */}
        <div className="bg-gradient-to-r from-[#133928] via-[#1b4332] to-[#2d6a4f] p-6 text-white text-center relative">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-white/15 flex items-center justify-center mb-3 text-2xl shadow-inner">
            {step === 1 ? '👋' : step === 2 ? '🗓️' : '💰'}
          </div>
          <h2 className="text-xl font-black tracking-tight">
            {step === 1 && 'Welcome to Spendy!'}
            {step === 2 && 'How often do you get paid?'}
            {step === 3 && 'Salary & Variable Pay'}
          </h2>
          <p className="text-xs text-white/80 mt-1 font-medium">
            {step === 1 && "Let's personalize your budgeting experience in 3 quick steps."}
            {step === 2 && 'Set your pay schedule so Spendy can notify you on payday.'}
            {step === 3 && 'Tailored tracking for fixed or fluctuating paychecks.'}
          </p>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-2 mt-4">
            {[1, 2, 3].map((s) => (
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
        <div className="p-6 space-y-5">
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
                    placeholder="e.g. Alex, Chris, Stefan..."
                    autoFocus
                    className="w-full bg-[#f8f7f2] border border-[#dcd7cb] rounded-2xl pl-11 pr-4 py-3 text-base font-bold text-[#14261c] focus:outline-none focus:border-[#1b4332]"
                  />
                </div>
              </div>

              <div className="pt-3">
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

          {/* ── STEP 2: Pay Schedule ── */}
          {step === 2 && (
            <div className="space-y-4">
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
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 ${
                      paySchedule === opt.id
                        ? 'border-[#1b4332] bg-[#eaf4ee]'
                        : 'border-[#e4dfd3] bg-[#f8f7f2] hover:bg-[#ece8df]'
                    }`}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#14261c]">{opt.title}</p>
                      <p className="text-xs text-[#6e8074]">{opt.desc}</p>
                    </div>
                    {paySchedule === opt.id && (
                      <div className="w-5 h-5 rounded-full bg-[#1b4332] flex items-center justify-center text-white">
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Day selection */}
              {paySchedule === 'twice_month' && (
                <div className="p-3.5 bg-[#f8f7f2] rounded-2xl border border-[#e4dfd3] flex items-center justify-between gap-3 text-xs">
                  <span className="font-bold text-[#14261c]">Paycheck days:</span>
                  <div className="flex items-center gap-2">
                    <span>Day</span>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={payDay1}
                      onChange={(e) => setPayDay1(e.target.value)}
                      className="w-12 bg-white border border-[#dcd7cb] rounded-lg px-2 py-1 text-center font-bold text-[#14261c]"
                    />
                    <span>& Day</span>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={payDay2}
                      onChange={(e) => setPayDay2(e.target.value)}
                      className="w-12 bg-white border border-[#dcd7cb] rounded-lg px-2 py-1 text-center font-bold text-[#14261c]"
                    />
                  </div>
                </div>
              )}

              {paySchedule === 'monthly_1' && (
                <div className="p-3.5 bg-[#f8f7f2] rounded-2xl border border-[#e4dfd3] flex items-center justify-between gap-3 text-xs">
                  <span className="font-bold text-[#14261c]">Day of month you get paid:</span>
                  <div className="flex items-center gap-2">
                    <span>Day</span>
                    <input
                      type="number"
                      min="1"
                      max="31"
                      value={payDay1}
                      onChange={(e) => setPayDay1(e.target.value)}
                      className="w-14 bg-white border border-[#dcd7cb] rounded-lg px-2 py-1 text-center font-bold text-[#14261c]"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-2xl border border-[#e4dfd3] text-xs font-bold text-[#65776c] hover:bg-[#f8f7f2]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextFromStep2}
                  className="flex-1 py-3 bg-[#1b4332] hover:bg-[#245740] active:scale-98 text-white rounded-2xl text-sm font-extrabold shadow-md shadow-[#1b4332]/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <span>Next Step</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: Typical Amount & Variable Check ── */}
          {step === 3 && (
            <form onSubmit={handleFinish} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#55695e] uppercase tracking-wider mb-1.5 block">
                  {paySchedule === 'twice_month'
                    ? 'Estimated Amount per 15-day Paycheck (€)'
                    : paySchedule === 'weekly'
                    ? 'Estimated Weekly Paycheck (€)'
                    : 'Estimated Monthly Salary (€)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7d8f84] text-base font-bold">€</span>
                  <input
                    type="number"
                    step="any"
                    placeholder="0.00"
                    value={baseAmount}
                    onChange={(e) => {
                      setBaseAmount(e.target.value);
                      setError('');
                    }}
                    autoFocus
                    className="w-full bg-[#f8f7f2] border border-[#dcd7cb] rounded-2xl pl-9 pr-4 py-3 text-base font-bold text-[#14261c] focus:outline-none focus:border-[#1b4332]"
                  />
                </div>
              </div>

              {/* Variable Paycheck Toggle */}
              <div
                onClick={() => setIsVariable(!isVariable)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
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

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-3 rounded-2xl border border-[#e4dfd3] text-xs font-bold text-[#65776c] hover:bg-[#f8f7f2]"
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
