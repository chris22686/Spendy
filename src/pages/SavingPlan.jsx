import { useMemo, useState } from 'react';
import { useApp, formatMoney, getMonthExpenses, getCategoryById } from '../store';
import { Sparkles, ChevronRight, TrendingDown, Target, Calendar, Zap, CheckCircle } from 'lucide-react';
import { format, addDays } from 'date-fns';

function buildPlan(expenses, categories, monthlyIncome, days) {
  const monthExp = getMonthExpenses(expenses);
  const dailyAvg = monthExp.reduce((s, e) => s + e.amount, 0) / 30;
  const dailyTarget = dailyAvg * 0.75;

  const catSpend = {};
  monthExp.forEach(e => { catSpend[e.category] = (catSpend[e.category] || 0) + e.amount; });

  const sortedCats = Object.entries(catSpend)
    .map(([id, total]) => ({ id, total, cat: getCategoryById(categories, id) }))
    .sort((a, b) => b.total - a.total);

  const essentials = ['housing', 'utilities', 'health', 'transport'];
  const reductions = sortedCats
    .filter(c => !essentials.includes(c.id))
    .slice(0, 4)
    .map(c => ({
      category: c.cat,
      current:  c.total,
      cap:      Math.round(c.total * 0.8 * 100) / 100,
      saving:   Math.round(c.total * 0.2 * 100) / 100,
    }));

  const monthlySaving = reductions.reduce((s, r) => s + r.saving, 0);
  const dailySaving   = monthlySaving / 30;

  const tasks = [];
  const now = new Date();
  for (let i = 0; i < days; i++) {
    const d = addDays(now, i);
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const dayTasks = [];
    if (i % 3 === 0) dayTasks.push({ action: 'Review Daily Pace', desc: 'Verify you are under your daily cap', icon: '📊' });
    if (isWeekend)   dayTasks.push({ action: 'No-Spend Challenge', desc: 'Opt for home activities or walk outside', icon: '🌲' });
    if (i % 7 === 0) dayTasks.push({ action: 'Weekly Meal Prep', desc: 'Prep healthy lunches to cut takeout spending', icon: '🥗' });
    if (reductions[i % reductions.length]) {
      const r = reductions[i % reductions.length];
      dayTasks.push({ action: 'Cap Spending', desc: `Keep ${r.category.name} under ${formatMoney(r.cap / 4)} today`, icon: r.category.icon });
    }
    dayTasks.push({ action: 'Automatic Stash', desc: `Transfer ${formatMoney(dailySaving.toFixed(2))} to your savings account`, icon: '💰' });

    tasks.push({ date: format(d, 'EEE, MMM d'), day: i + 1, tasks: dayTasks });
  }

  return { reductions, monthlySaving, dailySaving, dailyAvg, dailyTarget, tasks };
}

export default function SavingPlan() {
  const { state } = useApp();
  const { expenses, categories, monthlyIncome } = state;
  const [planDays, setPlanDays] = useState(7);
  const [expandedDay, setExpandedDay] = useState(0);

  const plan = useMemo(
    () => buildPlan(expenses, categories, monthlyIncome, planDays),
    [expenses, categories, monthlyIncome, planDays]
  );

  const projectedMonthly = plan.monthlySaving;
  const projectedYearly  = plan.monthlySaving * 12;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#14261c] tracking-tight">Smart Saving Plan</h1>
          <p className="text-[#65776c] text-sm mt-0.5 font-medium">Algorithmic reduction targets tailored to your habits</p>
        </div>
        <div className="flex gap-1.5 bg-[#ffffff] border border-[#e7e4da] rounded-xl p-1 shadow-2xs self-start sm:self-auto">
          {[7, 30].map(d => (
            <button key={d} onClick={() => setPlanDays(d)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                planDays === d ? 'bg-[#1b4332] text-white shadow-xs' : 'text-[#6e8074] hover:text-[#1b4332]'
              }`}
            >
              {d}-Day Plan
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl bg-gradient-to-br from-[#133928] via-[#1b4332] to-[#2d6a4f] border border-[#2d6a4f]/50 p-6 sm:p-8 text-white shadow-xl shadow-[#1b4332]/20">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#a7e8c2]">
            <Sparkles size={22} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white">Your {planDays}-Day Adaptive Plan</h2>
            <p className="text-xs text-[#a0cfb2] font-medium">Personalized targets reducing non-essential spending</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-white/10 pt-5">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#99f6e4]">{formatMoney(projectedMonthly)}</p>
            <p className="text-xs text-[#a0cfb2] font-semibold mt-1">Projected Monthly Savings</p>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#fef08a]">{formatMoney(projectedYearly)}</p>
            <p className="text-xs text-[#a0cfb2] font-semibold mt-1">Projected Annual Savings</p>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#bbf7d0]">{formatMoney(plan.dailySaving.toFixed(2))}</p>
            <p className="text-xs text-[#a0cfb2] font-semibold mt-1">Daily Stash Target</p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="rounded-2xl bg-[#ffffff] border border-[#e7e4da] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown size={18} className="text-[#991b1b]" />
            <span className="text-xs font-bold text-[#6e8074] uppercase tracking-wider">Current Daily Outflow Average</span>
          </div>
          <p className="text-3xl font-extrabold text-[#991b1b]">{formatMoney(plan.dailyAvg.toFixed(2))}</p>
          <p className="text-xs text-[#809186] mt-1 font-medium">Derived from past 30-day run rate</p>
        </div>
        <div className="rounded-2xl bg-[#ffffff] border border-[#e7e4da] p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Target size={18} className="text-[#1b4332]" />
            <span className="text-xs font-bold text-[#6e8074] uppercase tracking-wider">Recommended Target Cap</span>
          </div>
          <p className="text-3xl font-extrabold text-[#1b4332]">{formatMoney(plan.dailyTarget.toFixed(2))}</p>
          <p className="text-xs text-[#809186] mt-1 font-medium">Achieves 25% lifestyle trimming</p>
        </div>
      </div>

      <div className="rounded-2xl bg-[#ffffff] border border-[#e7e4da] p-5 shadow-[0_2px_12px_rgba(27,67,50,0.03)]">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={18} className="text-[#d97706]" />
          <h2 className="text-sm font-bold text-[#14261c]">Recommended Category Caps</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {plan.reductions.map((r, i) => (
            <div key={i} className="flex items-center gap-3.5 p-4 rounded-xl bg-[#f8f7f2] border border-[#e7e4da]">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 shadow-2xs"
                style={{ backgroundColor: (r.category.color || '#1b4332') + '22', border: `1px solid ${(r.category.color || '#1b4332')}44` }}
              >
                {r.category.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[#14261c] truncate">{r.category.name}</p>
                <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold">
                  <span className="text-[#991b1b] line-through">{formatMoney(r.current)}</span>
                  <ChevronRight size={12} className="text-[#809186]" />
                  <span className="text-[#1b4332]">{formatMoney(r.cap)}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-extrabold text-[#1b4332] bg-[#eaf4ee] px-2 py-0.5 rounded-full border border-[#cce3d5]">
                  Save {formatMoney(r.saving)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={18} className="text-[#1b4332]" />
          <h2 className="text-sm font-bold text-[#14261c]">Step-by-Step Action Roadmap</h2>
        </div>

        {plan.tasks.map((day, i) => {
          const isExpanded = expandedDay === i;
          return (
            <div key={i} className={`rounded-2xl border transition-all bg-[#ffffff] ${
              isExpanded
                ? 'border-[#1b4332] shadow-sm'
                : 'border-[#e8e4da] hover:border-[#cbd7cf]'
            }`}>
              <button
                className="w-full flex items-center gap-3.5 p-4 text-left cursor-pointer"
                onClick={() => setExpandedDay(isExpanded ? -1 : i)}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold flex-shrink-0 transition-colors ${
                  isExpanded ? 'bg-[#1b4332] text-white shadow-xs' : 'bg-[#eaf4ee] text-[#1b4332]'
                }`}>
                  {day.day}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#14261c]">{day.date}</p>
                  <p className="text-xs text-[#718578] font-medium">{day.tasks.length} actionable habits</p>
                </div>
                <div className={`text-[#7d8f84] transition-transform duration-200 ${isExpanded ? 'rotate-90 text-[#1b4332]' : ''}`}>
                  <ChevronRight size={18} />
                </div>
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 space-y-2 border-t border-[#f1ede3] pt-3">
                  {day.tasks.map((task, j) => (
                    <div key={j} className="flex items-center gap-3 p-3 rounded-xl bg-[#f8f7f2] border border-[#e8e4da]">
                      <span className="text-lg">{task.icon}</span>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-[#1b4332]">{task.action}</p>
                        <p className="text-xs text-[#55695e] font-medium mt-0.5">{task.desc}</p>
                      </div>
                      <CheckCircle size={16} className="text-[#1b4332] flex-shrink-0" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
