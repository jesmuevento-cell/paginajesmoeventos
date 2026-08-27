import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle, CheckCircle2, Flame } from 'lucide-react';
import { useEvent } from '../context/EventContext';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
}

export const CountdownTimer: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { settings, isRegistrationEnded, isRegistrationPending, isRegistrationOpen } = useEvent();

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalMs: 0,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const startTime = new Date(settings.dataInicioInscricoes).getTime();
      const endTime = new Date(settings.dataFimInscricoes).getTime();

      let targetTime = endTime;
      if (now < startTime) {
        targetTime = startTime;
      }

      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, totalMs: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, totalMs: diff });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [settings.dataInicioInscricoes, settings.dataFimInscricoes]);

  if (isRegistrationEnded) {
    return (
      <div className="w-full max-w-2xl mx-auto bg-gradient-to-r from-red-950/80 via-rose-900/60 to-slate-900 border border-red-500/40 rounded-2xl p-4 sm:p-6 text-center shadow-xl shadow-red-950/40 backdrop-blur-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-300 text-xs sm:text-sm font-semibold mb-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          Prazo Terminado
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
          As inscrições encontram-se encerradas.
        </h3>
        <p className="text-sm text-slate-300 mt-1">
          O período oficial terminou a 09 de Novembro de 2026. Acompanhe a lista de classificados e as próximas etapas!
        </p>
      </div>
    );
  }

  const isCountingToStart = isRegistrationPending;

  return (
    <div
      className={`w-full ${
        compact ? 'max-w-xl' : 'max-w-3xl'
      } mx-auto bg-gradient-to-br from-slate-900/90 via-blue-950/60 to-slate-950 border border-sky-500/30 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-sky-950/50 backdrop-blur-md relative overflow-hidden`}
    >
      {/* Glow highlight */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-20 bg-sky-500/20 blur-3xl pointer-events-none rounded-full" />

      {/* Header pill */}
      <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs sm:text-sm font-bold">
          {isCountingToStart ? (
            <>
              <Clock className="w-4 h-4 text-sky-400 animate-spin" />
              Contagem para o Início das Inscrições
            </>
          ) : (
            <>
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              Inscrições Abertas — Contagem para Encerramento
            </>
          )}
        </div>

        <span className="text-xs text-slate-300 font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          Término: 09 de Novembro de 2026
        </span>
      </div>

      {/* Grid of time blocks */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {[
          { label: 'DIAS', val: timeLeft.days },
          { label: 'HORAS', val: timeLeft.hours },
          { label: 'MINUTOS', val: timeLeft.minutes },
          { label: 'SEGUNDOS', val: timeLeft.seconds },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-xl bg-slate-950/80 border border-sky-900/60 shadow-inner group hover:border-sky-400/50 transition-colors"
          >
            <span className="text-2xl sm:text-4xl md:text-5xl font-black bg-gradient-to-b from-white via-sky-100 to-sky-400 bg-clip-text text-transparent font-mono">
              {String(item.val).padStart(2, '0')}
            </span>
            <span className="text-[9px] sm:text-xs font-bold text-sky-300/80 tracking-widest mt-1">
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Subtext info */}
      <div className="mt-3.5 flex items-center justify-center gap-2 text-xs text-slate-300 text-center">
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          Candidaturas gratuitas para cidadãos com <strong>18 anos ou mais</strong> em toda a Lunda-Sul.
        </span>
      </div>
    </div>
  );
};
