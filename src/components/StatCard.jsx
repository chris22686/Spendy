export default function StatCard({ label, value, sub, icon: Icon, color = '#1b4332', trend, isHero }) {
  if (isHero) {
    return (
      <div className="rounded-3xl p-6 bg-gradient-to-br from-[#133928] via-[#1b4332] to-[#2d6a4f] text-white shadow-xl shadow-[#1b4332]/20 border border-[#2d6a4f]/50 flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
        
        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="text-[11px] font-semibold text-[#8cc5a5] uppercase tracking-wider">Primary Metric</span>
            <p className="text-sm text-[#cce3d5] font-medium mt-0.5">{label}</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-sm">
            <Icon size={20} className="text-[#a7e8c2]" />
          </div>
        </div>

        <div className="mt-4 relative z-10">
          <p className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">{value}</p>
          <div className="flex items-center gap-2 mt-2">
            {trend !== undefined && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/15 text-[#b9f2d1] backdrop-blur-sm">
                {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
              </span>
            )}
            {sub && <span className="text-xs text-[#b0cfbc]">{sub}</span>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-5 bg-[#ffffff] border border-[#e7e4da] shadow-[0_2px_10px_rgba(27,67,50,0.03)] flex flex-col justify-between hover:shadow-[0_4px_16px_rgba(27,67,50,0.06)] hover:border-[#d4cec0] transition-all">
      <div className="flex items-start justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs"
          style={{ backgroundColor: color + '15', border: `1px solid ${color}30` }}
        >
          <Icon size={18} style={{ color }} strokeWidth={2.2} />
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trend >= 0 ? 'text-[#1b4332] bg-[#eaf4ee]' : 'text-[#b91c1c] bg-[#fee2e2]'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className="mt-3">
        <p className="text-xs text-[#6e8074] font-semibold uppercase tracking-wider mb-1">{label}</p>
        <p className="text-2xl font-bold text-[#14261c] tracking-tight">{value}</p>
        {sub && <p className="text-xs text-[#7d8f84] mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}
