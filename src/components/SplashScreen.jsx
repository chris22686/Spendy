import { useState, useEffect } from 'react';

export default function SplashScreen({ onFinish }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Hold animation for 1.35 seconds, then smoothly fade away
    const timer1 = setTimeout(() => {
      setFading(true);
    }, 1350);

    const timer2 = setTimeout(() => {
      onFinish();
    }, 1750);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f8f7f2] transition-opacity duration-400 ease-out select-none ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center">
        {/* Centered App Icon with Subtle Pulse Glow Ring */}
        <div className="relative flex items-center justify-center w-28 h-28">
          <div className="absolute inset-0 rounded-full bg-[#1b4332]/15 animate-spendy-ring" />
          
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1b4332] via-[#245740] to-[#2d6a4f] shadow-xl shadow-[#1b4332]/25 flex items-center justify-center p-3 animate-spendy-entrance">
            <img
              src="/icon.png"
              alt="Spendy Logo"
              className="w-full h-full object-contain rounded-2xl drop-shadow-sm"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Clean Title & Subtitle */}
        <div className="mt-5 text-center animate-spendy-text">
          <h1 className="text-2xl font-black text-[#14261c] tracking-tight">Spendy</h1>
          <p className="text-[11px] font-bold text-[#55695e] tracking-widest uppercase mt-0.5">
            Budget & Expense Tracker
          </p>
        </div>
      </div>
    </div>
  );
}
