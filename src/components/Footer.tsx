import React, { useState } from 'react';
import { Logo } from './Logo';
import {
  Phone,
  Mail,
  MapPin,
  Flame,
  ShieldCheck,
  FileText,
  Heart,
  ArrowUp,
  Globe,
  Share2,
} from 'lucide-react';
import { useEvent } from '../context/EventContext';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab }) => {
  const { settings } = useEvent();
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (tab: string) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 border-t border-sky-950 text-slate-400 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[250px] bg-blue-900/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Slogan */}
          <div className="space-y-4">
            <Logo size="lg" />
            <p className="text-sm text-sky-200 font-medium italic">
              "{settings.slogan}"
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              A maior plataforma de descoberta, valorização e consagração de talentos vocais e musicais da província da Lunda-Sul.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={settings.redesSociais.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-sky-400 hover:border-sky-500 transition-colors"
                title="Facebook"
              >
                <span className="font-bold text-xs">f</span>
              </a>
              <a
                href={settings.redesSociais.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-sky-400 hover:border-sky-500 transition-colors"
                title="Instagram"
              >
                <span className="font-bold text-xs">ig</span>
              </a>
              <a
                href={settings.redesSociais.youtube}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-sky-400 hover:border-sky-500 transition-colors"
                title="YouTube"
              >
                <span className="font-bold text-xs">yt</span>
              </a>
              <a
                href={settings.redesSociais.tiktok}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-sky-400 hover:border-sky-500 transition-colors"
                title="TikTok"
              >
                <span className="font-bold text-xs">tk</span>
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <Flame className="w-4 h-4 text-sky-400" />
              Navegação
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleNav('home')}
                  className="hover:text-sky-300 transition-colors"
                >
                  Início & Destaques
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('about')}
                  className="hover:text-sky-300 transition-colors"
                >
                  Sobre o THE VOICE
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('registration')}
                  className="hover:text-sky-300 transition-colors text-sky-400 font-semibold"
                >
                  Inscrições 2026
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('prizes')}
                  className="hover:text-sky-300 transition-colors"
                >
                  Prémios & Categorias
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('stages')}
                  className="hover:text-sky-300 transition-colors"
                >
                  Etapas do Concurso
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('news')}
                  className="hover:text-sky-300 transition-colors"
                >
                  Notícias & Comunicados
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('gallery')}
                  className="hover:text-sky-300 transition-colors"
                >
                  Galeria Multimédia
                </button>
              </li>
            </ul>
          </div>

          {/* Portais do Utilizador */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Portais & Acesso
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => handleNav('candidate-area')}
                  className="hover:text-sky-300 transition-colors flex items-center gap-1.5 text-sky-300"
                >
                  <span>Área do Candidato (Consultar Estado)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('admin')}
                  className="hover:text-sky-300 transition-colors flex items-center gap-1.5 text-indigo-300"
                >
                  <span>Área Administrativa & Júri</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowTerms(true)}
                  className="hover:text-sky-300 transition-colors flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Regulamento & Termos</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowPrivacy(true)}
                  className="hover:text-sky-300 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Política de Privacidade</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contactos & Localização */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              Contactos Oficiais
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                <span>
                  {settings.contactos.localizacao}, {settings.contactos.municipio}, {settings.contactos.provincia}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{settings.contactos.telefone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{settings.contactos.email}</span>
              </div>
              <div className="pt-2">
                <a
                  href={`https://wa.me/${settings.contactos.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 transition-all font-semibold text-xs"
                >
                  <span>Atendimento WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-400 text-center sm:text-left">
            © 2026 THE VOICE LUNDA-SUL. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Lunda-Sul • Saurimo • Angola</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
              title="Voltar ao topo"
              aria-label="Voltar ao topo"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-900/60 rounded-2xl max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-400" />
                Termos e Condições do Concurso THE VOICE LUNDA-SUL
              </h3>
              <button
                onClick={() => setShowTerms(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs text-slate-300 leading-relaxed">
              <p><strong>1. Elegibilidade:</strong> O concurso destina-se a cidadãos residentes na província da Lunda-Sul com idade igual ou superior a 18 anos à data da inscrição.</p>
              <p><strong>2. Inscrições:</strong> O período oficial estende-se de 13 de Setembro a 09 de Novembro de 2026. A inscrição é gratuita e única por Bilhete de Identidade e email.</p>
              <p><strong>3. Critérios de Avaliação:</strong> As audições e galas são avaliadas por corpo de jurados idóneo com base em técnica vocal, afinação, presença em palco, originalidade, interpretação e potencial artístico.</p>
              <p><strong>4. Direitos de Imagem:</strong> Ao submeter a candidatura, o participante autoriza a captação e transmissão das suas actuações para fins culturais e promocionais do evento.</p>
              <p><strong>5. Premiação:</strong> Os prémios monetários e pacotes artísticos atribuídos ao 1.º, 2.º e 3.º classificados serão formalmente entregues na Gala de Premiação.</p>
            </div>
            <div className="pt-4 border-t border-slate-800 text-right">
              <button
                onClick={() => setShowTerms(false)}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs"
              >
                Compreendi e Aceito
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacy && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-sky-900/60 rounded-2xl max-w-2xl w-full p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Política de Privacidade & Protecção de Dados
              </h3>
              <button
                onClick={() => setShowPrivacy(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>A organização do THE VOICE LUNDA-SUL assegura que todos os dados fornecidos no formulário (incluindo Bilhete de Identidade, contactos telefónicos e fotografias) destinam-se exclusivamente à gestão das inscrições, selecção e comunicação com os participantes.</p>
              <p>Os dados confidenciais não são cedidos a terceiros para fins comerciais e permanecem sob custódia segura nos servidores Firebase e administração autorizada.</p>
            </div>
            <div className="pt-4 border-t border-slate-800 text-right">
              <button
                onClick={() => setShowPrivacy(false)}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
