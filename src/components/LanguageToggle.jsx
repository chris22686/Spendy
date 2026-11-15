import { useApp } from '../store';

export default function LanguageToggle({ className = '', variant = 'pill' }) {
  const { state, dispatch } = useApp();
  const currentLang = state.language || 'el';

  const toggleLang = () => {
    const nextLang = currentLang === 'el' ? 'en' : 'el';
    dispatch({ type: 'SET_LANGUAGE', payload: nextLang });
  };

  if (variant === 'full') {
    return (
      <div className={`p-3 rounded-2xl bg-[#f8f7f2] border border-[#e4dfd3] flex items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center gap-2">
          <span className="text-xl">{currentLang === 'el' ? '🇬🇷' : '🇬🇧'}</span>
          <div>
            <p className="text-xs font-bold text-[#14261c]">
              {currentLang === 'el' ? 'Γλώσσα Εφαρμογής' : 'App Language'}
            </p>
            <p className="text-[11px] text-[#718578]">
              {currentLang === 'el' ? 'Ελληνικά (Απλά & Κατανοητά)' : 'English (Default)'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleLang}
          data-testid="toggle-language-btn"
          className="px-3 py-1.5 rounded-xl bg-white border border-[#dcd7cb] hover:border-[#1b4332] text-xs font-extrabold text-[#1b4332] transition-all cursor-pointer shadow-2xs active:scale-95"
        >
          {currentLang === 'el' ? 'English 🇬🇧' : 'Ελληνικά 🇬🇷'}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleLang}
      data-testid="toggle-language-btn"
      title={currentLang === 'el' ? 'Αλλαγή σε English 🇬🇧' : 'Switch to Greek 🇬🇷'}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer active:scale-95 shadow-2xs ${
        currentLang === 'el'
          ? 'bg-[#ffffff] text-[#1b4332] border-[#cce3d5] hover:bg-[#eaf4ee]'
          : 'bg-[#ffffff] text-[#334155] border-[#cbd5e1] hover:bg-[#f1f5f9]'
      } ${className}`}
    >
      <span className="text-sm">{currentLang === 'el' ? '🇬🇷' : '🇬🇧'}</span>
      <span className="text-[11px] font-black uppercase tracking-wider">
        {currentLang === 'el' ? 'ΕΛ' : 'EN'}
      </span>
    </button>
  );
}
