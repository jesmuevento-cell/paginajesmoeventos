import React, { useState, useEffect } from 'react';
import { Logo } from './Logo';
import {
  Menu,
  X,
  UserCheck,
  ShieldCheck,
  Sparkles,
  Flame,
  Music2,
  Calendar,
  Award,
  Newspaper,
  Image as ImageIcon,
  Phone,
  Info,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvent } from '../context/EventContext';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { isRegistrationOpen } = useEvent();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Início', icon: Music2 },
    { id: 'about', label: 'Sobre o Evento', icon: Info },
    { id: 'registration', label: 'Inscrições', icon: Flame, badge: isRegistrationOpen ? 'Abertas' : undefined },
    { id: 'prizes', label: 'Prémios', icon: Award },
    { id: 'stages', label: 'Etapas', icon: Calendar },
    { id: 'news', label: 'Notícias', icon: Newspaper },
    { id: 'gallery', label: 'Galeria', icon: ImageIcon },
    { id: 'contact', label: 'Contactos', icon: Phone },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/95 backdrop-blur-md border-b border-sky-900/40 shadow-xl shadow-slate-950/80 py-2.5'
          : 'bg-gradient-to-b from-slate-950/90 via-slate-950/60 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="focus:outline-none transition-transform active:scale-95"
          aria-label="THE VOICE LUNDA-SUL Início"
        >
          <Logo size="md" />
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white bg-sky-500/20 border border-sky-400/30 shadow-sm shadow-sky-500/20 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.label}
                {item.badge && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block ml-0.5" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Candidate Area Button */}
          <button
            onClick={() => handleNavClick('candidate-area')}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
              currentTab === 'candidate-area'
                ? 'bg-sky-600 text-white border-sky-400 shadow-md shadow-sky-500/20'
                : 'bg-slate-900/80 text-sky-300 border-sky-700/50 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4 text-sky-400" />
            <span>Área do Candidato</span>
          </button>

          {/* Admin / Portal Button */}
          {isAuthenticated ? (
            <div className="flex items-center gap-1.5 bg-slate-900 border border-indigo-500/40 rounded-xl p-1 pr-2">
              <button
                onClick={() => handleNavClick('admin')}
                className="px-2.5 py-1 text-xs font-bold text-indigo-300 hover:text-white flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span>{user?.papel || 'Painel Admin'}</span>
              </button>
              <button
                onClick={logout}
                title="Terminar Sessão"
                className="p-1 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('admin')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                currentTab === 'admin'
                  ? 'border-indigo-500 text-indigo-300 bg-indigo-950/40 shadow-md'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
              }`}
              title="Acesso e Cadastro de Utilizadores"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              <span>Entrar / Cadastrar</span>
            </button>
          )}

          {/* CTA Inscrição Header */}
          <button
            onClick={() => handleNavClick('registration')}
            className="relative group overflow-hidden px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span>INSCREVER-ME</span>
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => handleNavClick('registration')}
            className="px-3 py-1.5 rounded-lg bg-sky-500 text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-sky-500/30"
          >
            <Sparkles className="w-3 h-3 text-amber-200" />
            <span>Inscrever</span>
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 hover:text-white"
            aria-label="Abrir Menu de Navegação"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] bg-slate-950/98 border-b border-sky-900/50 shadow-2xl p-5 max-h-[85vh] overflow-y-auto backdrop-blur-xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col gap-1.5 mb-5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold'
                      : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {item.badge && (
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-800 flex flex-col gap-2.5">
            <button
              onClick={() => handleNavClick('candidate-area')}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 border border-sky-700/50 text-sky-300 font-semibold text-sm flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-sky-400" />
              <span>Consultar Área do Candidato</span>
            </button>

            <button
              onClick={() => handleNavClick('admin')}
              className="w-full py-3 px-4 rounded-xl bg-slate-900/60 border border-indigo-800/40 text-indigo-300 font-semibold text-sm flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>{isAuthenticated ? `Painel: ${user?.papel}` : 'Entrar / Cadastrar Utilizador'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
