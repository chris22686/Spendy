import { useState, useEffect } from 'react';

export default function SplashScreen({ onFinish }) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setFading(true);
    }, 1100);

    const timer2 = setTimeout(() => {
      onFinish();
    }, 1500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#f8f7f2] transition-opacity duration-400 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center">
        {/* Animated App Icon */}
        <div className="relative flex items-center justify-center">
          <div className="absolute w-28 h-28 rounded-full bg-[#1b4332]/10 animate-ping opacity-60" />
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#1b4332] to-[#2d6a4f] shadow-2xl shadow-[#1b4332]/30 flex items-center justify-center p-3 animate-spendy-pulse">
            <img
              src="/icon.png"
              alt="Spendy Logo"
              className="w-full h-full object-contain rounded-2xl"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* App Title & Slogan */}
        <div className="mt-5 text-center animate-spendy-fade-up">
          <h1 className="text-2xl font-black text-[#14261c] tracking-tight">Spendy</h1>
          <p className="text-xs font-semibold text-[#527964] mt-1 tracking-wider uppercase">
            Budget & Expense Tracker
          </p>
        </div>
      </div>
    </div>
  );
}
