import { getCategoryById, formatMoney } from '../store';
import { Trash2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';

export default function TransactionCard({ expense, categories, onDelete, onClick }) {
  const cat = getCategoryById(categories, expense.category);

  return (
    <div
      onClick={() => onClick && onClick(expense)}
      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-[#ffffff] border border-[#e8e4da] hover:border-[#cbd7cf] hover:shadow-[0_4px_16px_rgba(27,67,50,0.05)] transition-all duration-150 cursor-pointer group"
    >
      <div
        className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 text-lg sm:text-xl shadow-xs"
        style={{ backgroundColor: (cat.color || '#1b4332') + '18', border: `1px solid ${(cat.color || '#1b4332')}33` }}
      >
        {cat.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <p className="text-xs sm:text-sm font-bold text-[#15241c] truncate">{expense.description}</p>
          {expense.recurring && (
            <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-[#1b4332] bg-[#eaf4ee] border border-[#d2e7d8] px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0">
              <RefreshCw size={10} className="stroke-[2.5]" />
              <span className="hidden xs:inline">Recurring</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5">
          <span className="text-[11px] sm:text-xs font-medium text-[#65776c] truncate max-w-[100px] sm:max-w-none">{cat.name}</span>
          <span className="text-[#c1cbc4]">·</span>
          <span className="text-[11px] sm:text-xs text-[#809186] shrink-0">
            {format(new Date(expense.date + 'T00:00:00'), 'MMM d, yyyy')}
          </span>
          {expense.notes && (
            <>
              <span className="text-[#c1cbc4]">·</span>
              <span className="text-[11px] sm:text-xs text-[#809186] truncate max-w-[100px] sm:max-w-[140px] italic">{expense.notes}</span>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <span className="text-sm sm:text-base font-extrabold text-[#991b1b]">
          -{formatMoney(expense.amount)}
        </span>
        {onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(expense.id); }}
            className="p-1 sm:p-1.5 rounded-lg text-[#94a399] hover:text-[#b91c1c] hover:bg-[#fee2e2] transition-all cursor-pointer"
            title="Delete expense"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
