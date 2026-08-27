import React from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Flame,
  Award,
  Users,
  Mic,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';

interface StagesProps {
  setCurrentTab: (tab: string) => void;
}

export const Stages: React.FC<StagesProps> = ({ setCurrentTab }) => {
  const { stages } = useEvent();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5 text-sky-400" />
          <span>Cronograma Oficial</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Etapas do Concurso THE VOICE LUNDA-SUL
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Conheça a jornada estruturada em 8 fases que levará os candidatos anónimos da província da Lunda-Sul até à grande consagração no palco.
        </p>
      </div>

      {/* Timeline List */}
      <div className="relative max-w-4xl mx-auto space-y-6">
        {/* Continuous Line (Desktop) */}
        <div className="hidden md:block absolute left-8 top-8 bottom-8 w-1 bg-gradient-to-b from-sky-500 via-blue-700 to-indigo-900 rounded-full" />

        {stages.map((stage) => {
          const isAtiva = stage.estado === 'ativa';
          const isConcluida = stage.estado === 'concluida';
          const isPendente = stage.estado === 'pendente';

          return (
            <div
              key={stage.id}
              className={`relative rounded-3xl border p-6 sm:p-8 transition-all duration-300 ${
                isAtiva
                  ? 'bg-gradient-to-r from-sky-950/80 via-blue-950/60 to-slate-900 border-sky-400 shadow-2xl shadow-sky-500/20 ring-1 ring-sky-400 md:ml-12'
                  : isConcluida
                  ? 'bg-slate-900/60 border-emerald-500/30 md:ml-12'
                  : 'bg-slate-900/40 border-slate-800 md:ml-12 opacity-85 hover:opacity-100'
              }`}
            >
              {/* Badge Number Circle on timeline */}
              <div
                className={`hidden md:flex absolute -left-12 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full items-center justify-center font-bold text-xs shadow-md ${
                  isAtiva
                    ? 'bg-sky-400 text-slate-950 ring-4 ring-sky-400/30'
                    : isConcluida
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                0{stage.numero}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="md:hidden text-xs font-black px-2.5 py-1 rounded-md bg-sky-500/20 text-sky-300">
                    Etapa 0{stage.numero}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">{stage.nome}</h3>
                </div>

                {/* Status Pill */}
                <div>
                  {isAtiva && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-bold animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Etapa em Curso
                    </span>
                  )}
                  {isConcluida && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Concluída
                    </span>
                  )}
                  {isPendente && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-slate-400 border border-slate-800 text-xs font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      Agendada
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-4 text-left">
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {stage.descricao}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-sky-300">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    <span>Início: {stage.dataInicio}</span>
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-sky-400" />
                    <span>Término: {stage.dataFim}</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="text-center pt-6">
        <button
          onClick={() => {
            setCurrentTab('registration');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-sm uppercase tracking-wider shadow-xl inline-flex items-center gap-2"
        >
          <Flame className="w-4 h-4 text-amber-300" />
          <span>Garantir Vaga na Etapa 01</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
