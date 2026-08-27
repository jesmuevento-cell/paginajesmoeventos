import React from 'react';
import { Logo } from '../components/Logo';
import { CountdownTimer } from '../components/CountdownTimer';
import { AudioVisualizer } from '../components/AudioVisualizer';
import {
  Sparkles,
  ArrowRight,
  Award,
  Music,
  Mic,
  Calendar,
  Newspaper,
  CheckCircle2,
  Users,
  Radio,
  Disc3,
  Flame,
  ChevronRight,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';

interface HomeProps {
  setCurrentTab: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({ setCurrentTab }) => {
  const { settings, stages, news, candidates, isRegistrationOpen } = useEvent();

  const publishedNews = news.filter((n) => n.publicado).slice(0, 3);
  const activeStage = stages.find((s) => s.estado === 'ativa') || stages[0];

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-16 px-4 sm:px-6 overflow-hidden">
        {/* Background stage lighting and beams */}
        <div className="absolute inset-0 bg-radial-gradient from-blue-900/30 via-slate-950/80 to-slate-950 pointer-events-none" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[500px] bg-gradient-to-tr from-sky-600/15 via-blue-700/20 to-indigo-900/10 blur-[130px] rounded-full pointer-events-none" />
        
        {/* Light flare beams */}
        <div className="absolute top-0 left-1/4 w-1 h-96 bg-gradient-to-b from-sky-400/40 via-sky-500/10 to-transparent blur-sm rotate-12 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-1 h-96 bg-gradient-to-b from-blue-400/40 via-blue-500/10 to-transparent blur-sm -rotate-12 pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs sm:text-sm font-semibold backdrop-blur-md animate-fade-in shadow-lg shadow-sky-500/10">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>O Maior Concurso de Canto da Lunda-Sul</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            <span className="text-emerald-400 font-bold">Edição 2026</span>
          </div>

          {/* Main Logo & Title */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <Logo size="xl" className="transform hover:scale-105 transition-transform duration-300" />
            
            {/* Official Slogan */}
            <div className="max-w-3xl mx-auto pt-2">
              <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-sky-200 via-white to-sky-300 bg-clip-text text-transparent italic tracking-wide">
                "{settings.slogan}"
              </h2>
            </div>

            <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed pt-2">
              A montra que vai revelar a próxima grande estrela vocal de Angola. Suba ao palco de Saurimo e mostre ao mundo o talento que vive em si.
            </p>
          </div>

          {/* Ambient Equalizer */}
          <div className="py-2">
            <AudioVisualizer bars={24} size="md" />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                setCurrentTab('registration');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-sm sm:text-base tracking-wider uppercase shadow-2xl shadow-sky-500/40 hover:shadow-sky-500/60 active:scale-95 transition-all flex items-center justify-center gap-3 group"
            >
              <Mic className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
              <span>INSCREVER-ME AGORA</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                setCurrentTab('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-sky-600/40 text-slate-200 hover:text-white font-bold text-sm sm:text-base tracking-wide transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <span>SAIBA MAIS</span>
              <ChevronRight className="w-4 h-4 text-sky-400" />
            </button>
          </div>

          {/* Registration Live Countdown */}
          <div className="pt-6">
            <CountdownTimer />
          </div>
        </div>
      </section>

      {/* 2. INSPIRATIONAL & ABOUT SUMMARY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl bg-gradient-to-br from-slate-900/90 via-blue-950/40 to-slate-900 border border-sky-800/40 p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 blur-3xl pointer-events-none rounded-full" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider">
                <Music className="w-3.5 h-3.5" />
                <span>Sobre a Iniciativa</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                Descobrir, Lapidar e Consagrar os Talentos da Lunda-Sul
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {settings.textoSobre}
              </p>

              {/* Inspirational Quote Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-sky-950/50 border-l-4 border-sky-400 border-y border-r border-sky-900/50">
                <p className="text-sm sm:text-base text-sky-100 font-semibold italic">
                  "{settings.mensagemInspiradora}"
                </p>
                <span className="block text-xs text-sky-400 font-bold uppercase tracking-widest mt-2">
                  — Mensagem Oficial da Organização
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-sky-900/40">
                  <span className="block text-xl sm:text-2xl font-black text-white">4</span>
                  <span className="text-xs text-slate-400 font-medium">Municípios Conectados</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-sky-900/40">
                  <span className="block text-xl sm:text-2xl font-black text-amber-400">1.750.000 Kz+</span>
                  <span className="text-xs text-slate-400 font-medium">Em Prémios Totais</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/80 border border-sky-900/40 col-span-2 sm:col-span-1">
                  <span className="block text-xl sm:text-2xl font-black text-sky-400">18+ Anos</span>
                  <span className="text-xs text-slate-400 font-medium">Inscrição Gratuita</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-sky-500/30 shadow-2xl aspect-4/3 group">
                <img
                  src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80"
                  alt="THE VOICE LUNDA-SUL Palco"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent flex flex-col justify-end p-6">
                  <span className="text-xs font-bold text-sky-300 uppercase tracking-widest">
                    Pavilhão Multiusos • Saurimo
                  </span>
                  <h4 className="text-base font-bold text-white mt-1">
                    Um palco profissional à altura do seu talento
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRIZES PREVIEW (PRÉMIOS OFICIAIS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8 text-center">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Grandes Galardões</span>
          </div>
          <h3 className="text-2xl sm:text-4xl font-black text-white">
            Prémios Oficiais THE VOICE LUNDA-SUL
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            Além do prémio monetário em Kwanzas, os vencedores recebem pacotes completos de lançamento e formação artística.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* 1.º Lugar (Gold) */}
          <div className="relative rounded-3xl bg-gradient-to-b from-amber-950/60 via-slate-900 to-slate-950 border-2 border-amber-400/60 p-6 sm:p-8 shadow-2xl shadow-amber-500/10 flex flex-col justify-between group hover:border-amber-300 transition-all md:-translate-y-2">
            <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
              🥇 1.º CLASSIFICADO — GRANDE VENCEDOR
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                  1.000.000 Kz
                </span>
                <span className="text-xs font-semibold text-amber-300/80">Um Milhão de Kwanzas</span>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>Gravação de uma EP</strong> em estúdio profissional</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>Agenciamento</strong> de carreira musical</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Curso de Gestão de Carreira Musical</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Curso de Piano</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Curso de Técnica Vocal e Canto</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Declaração de Reconhecimento Cultural</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                  <span className="text-amber-200 font-bold">Uma surpresa especial da organização</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-amber-900/40 mt-6">
              <button
                onClick={() => setCurrentTab('prizes')}
                className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 text-xs font-bold tracking-wider uppercase transition-colors"
              >
                Ver Detalhes do Prémio
              </button>
            </div>
          </div>

          {/* 2.º Lugar (Silver) */}
          <div className="relative rounded-3xl bg-gradient-to-b from-slate-800/70 via-slate-900 to-slate-950 border border-slate-400/50 p-6 sm:p-8 shadow-xl flex flex-col justify-between group hover:border-slate-300 transition-all">
            <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-slate-300 to-slate-100 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md">
              🥈 2.º CLASSIFICADO
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-slate-100 via-slate-300 to-slate-400 bg-clip-text text-transparent">
                  500.000 Kz
                </span>
                <span className="text-xs font-semibold text-slate-300">Quinhentos Mil Kwanzas</span>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>Curso de Gestão de Carreira Musical</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>Curso de Piano</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-slate-300 shrink-0" />
                  <span>Curso de Técnica Vocal e Canto</span>
                </li>
                <li className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-sky-400 shrink-0" />
                  <span><strong>1 Rádio JBL</strong> profissional</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                  <span className="text-slate-200 font-bold">Uma surpresa especial</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-slate-800 mt-6">
              <button
                onClick={() => setCurrentTab('prizes')}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold tracking-wider uppercase transition-colors"
              >
                Ver Detalhes do Prémio
              </button>
            </div>
          </div>

          {/* 3.º Lugar (Bronze) */}
          <div className="relative rounded-3xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border border-amber-700/50 p-6 sm:p-8 shadow-xl flex flex-col justify-between group hover:border-amber-600 transition-all">
            <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-700 to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-md">
              🥉 3.º CLASSIFICADO
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-baseline justify-between flex-wrap gap-2">
                <span className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-amber-400 via-amber-600 to-amber-700 bg-clip-text text-transparent">
                  250.000 Kz
                </span>
                <span className="text-xs font-semibold text-amber-400/80">Duzentos e Cinquenta Mil Kz</span>
              </div>

              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Curso de Técnica Vocal e Canto</span>
                </li>
                <li className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-sky-400 shrink-0" />
                  <span><strong>1 Rádio JBL</strong> de alta definição</span>
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                  <span className="text-amber-200 font-bold">Uma surpresa especial</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-amber-950 mt-6">
              <button
                onClick={() => setCurrentTab('prizes')}
                className="w-full py-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/40 text-amber-300 border border-amber-800/40 text-xs font-bold tracking-wider uppercase transition-colors"
              >
                Ver Detalhes do Prémio
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ETAPAS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-slate-900/80 border border-sky-900/40 p-8 sm:p-10 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Calendar className="w-3.5 h-3.5" />
                <span>Roteiro do Concurso</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                As 8 Etapas até à Consagração
              </h3>
            </div>
            <button
              onClick={() => setCurrentTab('stages')}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sky-300 border border-sky-700/40 text-xs font-bold flex items-center gap-2"
            >
              <span>Ver Cronograma Completo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-2">
            {stages.map((stage) => {
              const isCurrent = stage.estado === 'ativa';
              return (
                <div
                  key={stage.id}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isCurrent
                      ? 'bg-sky-500/20 border-sky-400 shadow-lg shadow-sky-500/20 ring-1 ring-sky-400'
                      : 'bg-slate-950/60 border-slate-800/80 opacity-80 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-md ${
                        isCurrent ? 'bg-sky-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      0{stage.numero}
                    </span>
                    {isCurrent && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </div>
                  <h5 className="text-xs font-bold text-white line-clamp-1">{stage.nome}</h5>
                  <p className="text-[10px] text-sky-300/80 mt-1 font-mono">{stage.dataInicio}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. LATEST NEWS PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Newspaper className="w-3.5 h-3.5" />
              <span>Actualidade & Comunicados</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Últimas Notícias do THE VOICE
            </h3>
          </div>

          <button
            onClick={() => setCurrentTab('news')}
            className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1.5"
          >
            <span>Ver Todas as Notícias</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publishedNews.map((item) => (
            <article
              key={item.id}
              onClick={() => setCurrentTab('news')}
              className="rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 overflow-hidden shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.imagemUrl}
                    alt={item.titulo}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-sky-300 border border-sky-500/30">
                    {item.categoria}
                  </span>
                </div>

                <div className="p-5 space-y-2 text-left">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {item.dataPublicacao} • {item.autor}
                  </span>
                  <h4 className="text-base font-bold text-white group-hover:text-sky-300 transition-colors line-clamp-2">
                    {item.titulo}
                  </h4>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {item.resumo}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 text-left">
                <span className="inline-flex items-center gap-1 text-xs font-bold text-sky-400 group-hover:underline">
                  Ler notícia completa <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 6. BOTTOM CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-950 border border-sky-400/40 p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h3 className="text-2xl sm:text-4xl font-black text-white">
              Pronto para Dar Voz ao Seu Sonho?
            </h3>
            <p className="text-sm sm:text-base text-sky-100 leading-relaxed">
              As inscrições são gratuitas e abertas a toda a província da Lunda-Sul. Preencha o formulário online e garanta o seu código único de candidatura.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => {
                  setCurrentTab('registration');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-slate-950 hover:bg-sky-50 font-black text-sm tracking-wider uppercase shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                <Flame className="w-4 h-4 text-amber-500" />
                <span>FAZER INSCRIÇÃO AGORA</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab('candidate-area');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-sky-950/60 hover:bg-sky-900/80 border border-sky-400/40 text-white font-bold text-sm transition-all"
              >
                Já me inscrevi (Consultar Estado)
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
