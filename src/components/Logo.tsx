import React from 'react';
import { Mic, Music, Sparkles } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSlogan?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showSlogan = false, className = '' }) => {
  const sizeMap = {
    sm: {
      box: 'w-9 h-9',
      icon: 'w-5 h-5',
      title: 'text-base font-extrabold tracking-wider',
      sub: 'text-[9px] tracking-widest',
    },
    md: {
      box: 'w-11 h-11',
      icon: 'w-6 h-6',
      title: 'text-xl font-black tracking-wider',
      sub: 'text-[10px] tracking-widest',
    },
    lg: {
      box: 'w-16 h-16',
      icon: 'w-8 h-8',
      title: 'text-2xl sm:text-3xl font-black tracking-wider',
      sub: 'text-xs tracking-widest',
    },
    xl: {
      box: 'w-24 h-24',
      icon: 'w-12 h-12',
      title: 'text-4xl sm:text-5xl font-black tracking-widest',
      sub: 'text-sm sm:text-base tracking-[0.25em]',
    },
  };

  const current = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Visual Emblem Badge */}
      <div
        className={`relative ${current.box} rounded-2xl bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-950 p-[2px] shadow-lg shadow-sky-500/25 flex items-center justify-center shrink-0 group`}
      >
        <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle light effect */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 to-sky-400/20 opacity-80" />
          
          {/* Animated pulse ring */}
          <div className="absolute inset-0 border border-sky-400/40 rounded-[14px] animate-pulse" />

          {/* Microphone & Music Note Emblem */}
          <div className="relative z-10 text-sky-300 flex items-center justify-center">
            <Mic className={`${current.icon} text-sky-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]`} />
            <Sparkles className="w-3 h-3 text-amber-300 absolute -top-1 -right-1" />
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`${current.title} bg-gradient-to-r from-white via-sky-100 to-sky-400 bg-clip-text text-transparent drop-shadow-sm`}>
            THE VOICE
          </span>
        </div>
        <div className="flex items-center gap-1 leading-none mt-1">
          <span className={`${current.sub} font-bold text-sky-400 uppercase tracking-widest`}>
            LUNDA-SUL
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-ping" />
        </div>
        {showSlogan && (
          <p className="text-xs text-slate-400 italic mt-1 font-medium hidden sm:block">
            "Existimos para lhe motivar, produzimos para lhe entreter"
          </p>
        )}
      </div>
    </div>
  );
};
