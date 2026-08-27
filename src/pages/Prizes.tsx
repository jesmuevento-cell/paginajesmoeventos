import React from 'react';
import {
  Award,
  Sparkles,
  CheckCircle2,
  Radio,
  Disc3,
  BookOpen,
  Music,
  FileCheck,
  Flame,
  ArrowRight,
} from 'lucide-react';

interface PrizesProps {
  setCurrentTab: (tab: string) => void;
}

export const Prizes: React.FC<PrizesProps> = ({ setCurrentTab }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Premiação Histórica</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Prémios Oficiais THE VOICE LUNDA-SUL
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Mais de <strong>1.750.000 Kz</strong> em prémios monetários, combinados com gravação de EP profissional, agenciamento, equipamento sonoro e bolsas de formação artística integral.
        </p>
      </div>

      {/* Main Prize Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* 1.º CLASSIFICADO — GOLD */}
        <div className="relative rounded-3xl bg-gradient-to-b from-amber-950/70 via-slate-900 to-slate-950 border-2 border-amber-400 p-8 shadow-2xl shadow-amber-500/20 flex flex-col justify-between group hover:scale-[1.02] transition-all duration-300 order-1 lg:order-2 lg:-translate-y-4">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-1.5 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5" />
            🥇 1.º CLASSIFICADO • GRANDE VENCEDOR
          </div>

          <div className="space-y-6 pt-4 text-left">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">Prémio Monetário</span>
              <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-amber-100 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
                1.000.000 Kz
              </div>
              <p className="text-xs text-amber-200/80 font-medium">Um Milhão de Kwanzas em numerário</p>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black text-white uppercase tracking-wider border-b border-amber-900/60 pb-2">
                Pacote Artístico Completo
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <Disc3 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Gravação de uma EP Oficial</strong> em estúdio de referência</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Agenciamento Profissional</strong> de carreira e promoção de espectáculos</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <BookOpen className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Curso de Gestão de Carreira Musical</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Music className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Curso de Piano</strong> (instrumento harmónico)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Curso de Técnica Vocal e Canto</strong> avançado</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <FileCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Declaração Oficial de Reconhecimento Cultural</strong> como Músico</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <span className="text-amber-200 font-bold">Uma surpresa especial da organização</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-amber-900/60">
            <button
              onClick={() => {
                setCurrentTab('registration');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs tracking-wider uppercase shadow-lg shadow-amber-500/20"
            >
              Concorrer a Este Prémio
            </button>
          </div>
        </div>

        {/* 2.º CLASSIFICADO — SILVER */}
        <div className="relative rounded-3xl bg-gradient-to-b from-slate-800/80 via-slate-900 to-slate-950 border border-slate-400/60 p-8 shadow-xl flex flex-col justify-between group hover:border-slate-300 transition-all duration-300 order-2 lg:order-1">
          <div className="absolute -top-3.5 left-8 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-slate-300 to-slate-100 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
            🥈 2.º CLASSIFICADO
          </div>

          <div className="space-y-6 pt-4 text-left">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Prémio Monetário</span>
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-slate-100 via-slate-300 to-slate-400 bg-clip-text text-transparent">
                500.000 Kz
              </div>
              <p className="text-xs text-slate-300 font-medium">Quinhentos Mil Kwanzas</p>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
                Benefícios & Equipamento
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <BookOpen className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                  <span><strong>Curso de Gestão de Carreira Musical</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Music className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                  <span><strong>Curso de Piano</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-slate-300 shrink-0 mt-0.5" />
                  <span><strong>Curso de Técnica Vocal e Canto</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Radio className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <span><strong>1 Rádio JBL</strong> profissional de alta fidelidade</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <span className="text-slate-100 font-bold">Uma surpresa especial da comissão</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-slate-800">
            <button
              onClick={() => {
                setCurrentTab('registration');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-bold text-xs tracking-wider uppercase"
            >
              Inscrever-me Agora
            </button>
          </div>
        </div>

        {/* 3.º CLASSIFICADO — BRONZE */}
        <div className="relative rounded-3xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border border-amber-700/60 p-8 shadow-xl flex flex-col justify-between group hover:border-amber-600 transition-all duration-300 order-3">
          <div className="absolute -top-3.5 left-8 px-3.5 py-0.5 rounded-full bg-gradient-to-r from-amber-700 to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-md">
            🥉 3.º CLASSIFICADO
          </div>

          <div className="space-y-6 pt-4 text-left">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Prémio Monetário</span>
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-400 via-amber-600 to-amber-700 bg-clip-text text-transparent">
                250.000 Kz
              </div>
              <p className="text-xs text-amber-400/80 font-medium">Duzentos e Cinquenta Mil Kwanzas</p>
            </div>

            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-black text-amber-300/80 uppercase tracking-wider border-b border-amber-950 pb-2">
                Benefícios & Equipamento
              </h4>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <span><strong>Curso de Técnica Vocal e Canto</strong></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Radio className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                  <span><strong>1 Rádio JBL</strong> de som cristalino</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <span className="text-amber-200 font-bold">Uma surpresa especial da comissão</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-amber-950">
            <button
              onClick={() => {
                setCurrentTab('registration');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-800/40 font-bold text-xs tracking-wider uppercase"
            >
              Inscrever-me Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
