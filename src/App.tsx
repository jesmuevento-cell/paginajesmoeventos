import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Registration } from './pages/Registration';
import { Prizes } from './pages/Prizes';
import { Stages } from './pages/Stages';
import { News } from './pages/News';
import { Gallery } from './pages/Gallery';
import { Contact } from './pages/Contact';
import { CandidateArea } from './pages/CandidateArea';
import { Admin } from './pages/Admin';

export function AppContent() {
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Sync with window hash for GitHub Pages deep links and bookmarking
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const tabMap: Record<string, string> = {
        inicio: 'home',
        sobre: 'about',
        inscricao: 'registration',
        inscricoes: 'registration',
        premios: 'prizes',
        etapas: 'stages',
        noticias: 'news',
        galeria: 'gallery',
        contactos: 'contact',
        candidato: 'candidate-area',
        admin: 'admin',
      };

      if (hash && tabMap[hash]) {
        setCurrentTab(tabMap[hash]);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const changeTab = (tab: string) => {
    setCurrentTab(tab);
    const reverseMap: Record<string, string> = {
      home: 'inicio',
      about: 'sobre',
      registration: 'inscricoes',
      prizes: 'premios',
      stages: 'etapas',
      news: 'noticias',
      gallery: 'galeria',
      contact: 'contactos',
      'candidate-area': 'candidato',
      admin: 'admin',
    };
    if (reverseMap[tab]) {
      window.location.hash = reverseMap[tab];
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white font-sans">
      <Header currentTab={currentTab} setCurrentTab={changeTab} />

      <main className="flex-1">
        {currentTab === 'home' && <Home setCurrentTab={changeTab} />}
        {currentTab === 'about' && <About setCurrentTab={changeTab} />}
        {currentTab === 'registration' && <Registration setCurrentTab={changeTab} />}
        {currentTab === 'prizes' && <Prizes setCurrentTab={changeTab} />}
        {currentTab === 'stages' && <Stages setCurrentTab={changeTab} />}
        {currentTab === 'news' && <News />}
        {currentTab === 'gallery' && <Gallery />}
        {currentTab === 'contact' && <Contact />}
        {currentTab === 'candidate-area' && <CandidateArea />}
        {currentTab === 'admin' && <Admin />}
      </main>

      <Footer setCurrentTab={changeTab} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <AppContent />
      </EventProvider>
    </AuthProvider>
  );
}
