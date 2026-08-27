import React from 'react';
import { Logo } from '../components/Logo';
import {
  Music,
  Sparkles,
  MapPin,
  CheckCircle2,
  Mic,
  Award,
  Heart,
  Users,
  Radio,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';

interface AboutProps {
  setCurrentTab: (tab: string) => void;
}

export const About: React.FC<AboutProps> = ({ setCurrentTab }) => {
  const { settings } = useEvent();

  const criteria = [
    { title: 'Técnica Vocal', desc: 'Controlo da respiração, afinação, sustentação de notas e dinâmica vocal.' },
    { title: 'Afinação', desc: 'Precisão tonal harmónica e coerência musical ao longo de toda a performance.' },
    { title: 'Presença em Palco', desc: 'Postura corporal, comunicação visual, domínio do espaço cénico e magnetismo.' },
    { title: 'Originalidade', desc: 'Identidade artística própria, arranjos criativos e autenticidade.' },
    { title: 'Interpretação', desc: 'Capacidade de transmitir a emoção e a mensagem da canção ao público e júri.' },
    { title: 'Potencial Artístico', desc: 'Versatilidade, capacidade de evolução e adequação para gravação em estúdio.' },
  ];

  const municipalities = [
    { nome: 'Saurimo', desc: 'Sede provincial, coração cultural e palco das grandes audições e galas ao vivo.' },
    { nome: 'Cacolo', desc: 'Celeiro de ricas tradições musicais, vozes corais e ritmos expressivos.' },
    { nome: 'Dala', desc: 'Berço de inspiração ancestral, melodias acústicas e instrumentos autóctones.' },
    { nome: 'Muconda', desc: 'Juventude vibrante com forte paixão pelos ritmos contemporâneos e tradicionais.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20 space-y-16">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Institucional & Visão Cultural</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Sobre o THE VOICE LUNDA-SUL
        </h1>
        <p className="text-sky-300 font-bold italic text-base sm:text-lg">
          "{settings.slogan}"
        </p>
      </div>

      {/* Main Narrative Card */}
      <div className="rounded-3xl bg-slate-900/90 border border-sky-900/50 p-8 sm:p-12 shadow-2xl space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5 text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              A Grande Montra dos Talentos da Região Leste de Angola
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              O <strong>THE VOICE LUNDA-SUL</strong> nasce da profunda convicção de que a província da Lunda-Sul possui uma das heranças musicais e expressivas mais ricas de África. Das harmonias tradicionais Cokwe ao Semba, Kizomba, Gospel e tendências urbanas, este evento é o catalisador que transforma sonhos anónimos em carreiras musicais estruturadas.
            </p>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Com uma produção moderna, palco de nível internacional, júri qualificado e acompanhamento com banda ao vivo, a iniciativa abre portas reais de formação em gestão de carreira, técnica de canto, piano e gravação de EP profissional.
            </p>

            {/* Inspirational Quote */}
            <div className="p-5 rounded-2xl bg-sky-950/60 border-l-4 border-amber-400 border-y border-r border-sky-900/40">
              <p className="text-sm sm:text-base text-amber-100 font-semibold italic">
                "{settings.mensagemInspiradora}"
              </p>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl overflow-hidden border border-sky-500/30 shadow-2xl aspect-square relative group">
              <img
                src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80"
                alt="Palco The Voice Lunda-Sul"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-6">
                <Logo size="md" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Municipalities Represented */}
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-sky-300 text-xs font-bold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5 text-rose-400" />
            <span>Abrangência Provincial</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Uma Voz em Cada Município da Lunda-Sul
          </h3>
          <p className="text-sm text-slate-300 max-w-xl mx-auto">
            A comissão organizadora garante igualdade de acesso e suporte aos candidatos dos 4 municípios que compõem a nossa província.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
          {municipalities.map((mun, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/50 shadow-lg transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-bold text-white mb-1.5">{mun.nome}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{mun.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Evaluation Criteria */}
      <div className="rounded-3xl bg-slate-900/80 border border-sky-900/40 p-8 sm:p-10 space-y-6 text-left">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Critérios Oficiais de Avaliação</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            Como os Jurados Avaliam as Performances
          </h3>
          <p className="text-sm text-slate-300">
            Cada concorrente é pontuado em seis pilares essenciais com base em padrões de excelência musical e autenticidade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {criteria.map((crit, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 text-xs font-bold flex items-center justify-center">
                  0{idx + 1}
                </span>
                <h5 className="text-sm font-bold text-white">{crit.title}</h5>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed pl-8">{crit.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center pt-4">
        <button
          onClick={() => {
            setCurrentTab('registration');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-black text-sm uppercase tracking-wider shadow-xl shadow-sky-600/30 inline-flex items-center gap-2"
        >
          <Mic className="w-4 h-4 text-amber-300" />
          <span>Fazer Minha Inscrição Agora</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
