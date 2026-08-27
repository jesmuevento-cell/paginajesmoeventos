import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Candidate,
  NewsItem,
  Stage,
  GalleryItem,
  EventSettings,
  Evaluation,
  CandidateStatus,
} from '../types';
import {
  fetchCandidates,
  saveCandidate,
  fetchNews,
  saveNewsItem,
  deleteNewsItem,
  fetchStages,
  saveStages,
  fetchEvaluations,
  saveEvaluation,
  fetchGallery,
  saveGalleryItem,
  deleteGalleryItem,
  fetchSettings,
  saveSettings,
} from '../firebase/services';
import {
  INITIAL_SETTINGS,
  INITIAL_STAGES,
  INITIAL_CANDIDATES,
  INITIAL_NEWS,
  INITIAL_GALLERY,
  INITIAL_EVALUATIONS,
} from '../data/initialData';

interface EventContextType {
  settings: EventSettings;
  stages: Stage[];
  candidates: Candidate[];
  news: NewsItem[];
  gallery: GalleryItem[];
  evaluations: Evaluation[];
  loading: boolean;
  isRegistrationOpen: boolean;
  isRegistrationEnded: boolean;
  isRegistrationPending: boolean;
  registerCandidate: (data: Omit<Candidate, 'id' | 'codigoInscricao' | 'estado' | 'dataInscricao' | 'criadoEm'>) => Promise<Candidate>;
  updateCandidateStatus: (id: string, newStatus: CandidateStatus, message?: string) => Promise<void>;
  updateCandidate: (candidate: Candidate) => Promise<void>;
  submitEvaluation: (evaluation: Omit<Evaluation, 'id' | 'data'>) => Promise<Evaluation>;
  addNewsItem: (news: Omit<NewsItem, 'id' | 'criadoEm'>) => Promise<void>;
  editNewsItem: (news: NewsItem) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  addGalleryMedia: (item: Omit<GalleryItem, 'id'>) => Promise<void>;
  deleteGalleryMedia: (id: string) => Promise<void>;
  saveAllStages: (updatedStages: Stage[]) => Promise<void>;
  updateEventSettings: (newSettings: EventSettings) => Promise<void>;
  refreshData: () => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<EventSettings>(INITIAL_SETTINGS);
  const [stages, setStages] = useState<Stage[]>(INITIAL_STAGES);
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [evaluations, setEvaluations] = useState<Evaluation[]>(INITIAL_EVALUATIONS);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [st, cands, nws, gal, evals, sets] = await Promise.all([
        fetchStages(),
        fetchCandidates(),
        fetchNews(),
        fetchGallery(),
        fetchEvaluations(),
        fetchSettings(),
      ]);
      setStages(st);
      setCandidates(cands);
      setNews(nws);
      setGallery(gal);
      setEvaluations(evals);
      setSettings(sets);
    } catch (err) {
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Registration period logic
  const now = new Date();
  const startDate = new Date(settings.dataInicioInscricoes);
  const endDate = new Date(settings.dataFimInscricoes);

  // Checks
  const isRegistrationPending = settings.estadoInscricoes === 'automatica' ? now < startDate : false;
  const isRegistrationEnded = settings.estadoInscricoes === 'encerrada' || (settings.estadoInscricoes === 'automatica' && now > endDate);
  const isRegistrationOpen = settings.estadoInscricoes === 'aberta' || (settings.estadoInscricoes === 'automatica' && now >= startDate && now <= endDate);

  const registerCandidate = async (
    data: Omit<Candidate, 'id' | 'codigoInscricao' | 'estado' | 'dataInscricao' | 'criadoEm'>
  ): Promise<Candidate> => {
    // Generate unique random 5-digit number
    const randomCodeNum = Math.floor(10000 + Math.random() * 90000);
    const uniqueCode = `TVLS-2026-${randomCodeNum}`;
    const timestamp = new Date().toISOString();
    const formattedDate = new Date().toLocaleString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newCandidate: Candidate = {
      ...data,
      id: `cand-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      codigoInscricao: uniqueCode,
      estado: 'Recebida',
      etapaActual: 'Inscrições Oficiais',
      mensagensOrganizacao: [
        'A sua inscrição no THE VOICE LUNDA-SUL foi submetida com sucesso. Guarde o seu código de inscrição para consultar o estado e convocações.',
      ],
      dataInscricao: formattedDate,
      criadoEm: timestamp,
    };

    await saveCandidate(newCandidate);
    setCandidates((prev) => [newCandidate, ...prev]);
    return newCandidate;
  };

  const updateCandidateStatus = async (
    id: string,
    newStatus: CandidateStatus,
    message?: string
  ) => {
    const target = candidates.find((c) => c.id === id);
    if (!target) return;

    const updatedMessages = message
      ? [...(target.mensagensOrganizacao || []), message]
      : target.mensagensOrganizacao;

    const updated: Candidate = {
      ...target,
      estado: newStatus,
      mensagensOrganizacao: updatedMessages,
    };

    await saveCandidate(updated);
    setCandidates((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  const updateCandidate = async (candidate: Candidate) => {
    await saveCandidate(candidate);
    setCandidates((prev) => prev.map((c) => (c.id === candidate.id ? candidate : c)));
  };

  const submitEvaluation = async (
    evalData: Omit<Evaluation, 'id' | 'data'>
  ): Promise<Evaluation> => {
    const newEval: Evaluation = {
      ...evalData,
      id: `eval-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      data: new Date().toISOString().split('T')[0],
    };

    await saveEvaluation(newEval);
    setEvaluations((prev) => {
      const idx = prev.findIndex(
        (e) => e.candidatoId === newEval.candidatoId && e.juradoId === newEval.juradoId
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newEval;
        return copy;
      }
      return [...prev, newEval];
    });
    return newEval;
  };

  const addNewsItem = async (newsData: Omit<NewsItem, 'id' | 'criadoEm'>) => {
    const item: NewsItem = {
      ...newsData,
      id: `noticia-${Date.now()}`,
      criadoEm: new Date().toISOString(),
    };
    await saveNewsItem(item);
    setNews((prev) => [item, ...prev]);
  };

  const editNewsItem = async (item: NewsItem) => {
    await saveNewsItem(item);
    setNews((prev) => prev.map((n) => (n.id === item.id ? item : n)));
  };

  const deleteNews = async (id: string) => {
    await deleteNewsItem(id);
    setNews((prev) => prev.filter((n) => n.id !== id));
  };

  const addGalleryMedia = async (itemData: Omit<GalleryItem, 'id'>) => {
    const item: GalleryItem = {
      ...itemData,
      id: `gal-${Date.now()}`,
    };
    await saveGalleryItem(item);
    setGallery((prev) => [item, ...prev]);
  };

  const deleteGalleryMedia = async (id: string) => {
    await deleteGalleryItem(id);
    setGallery((prev) => prev.filter((g) => g.id !== id));
  };

  const saveAllStages = async (updatedStages: Stage[]) => {
    await saveStages(updatedStages);
    setStages(updatedStages);
  };

  const updateEventSettings = async (newSettings: EventSettings) => {
    await saveSettings(newSettings);
    setSettings(newSettings);
  };

  return (
    <EventContext.Provider
      value={{
        settings,
        stages,
        candidates,
        news,
        gallery,
        evaluations,
        loading,
        isRegistrationOpen,
        isRegistrationEnded,
        isRegistrationPending,
        registerCandidate,
        updateCandidateStatus,
        updateCandidate,
        submitEvaluation,
        addNewsItem,
        editNewsItem,
        deleteNews,
        addGalleryMedia,
        deleteGalleryMedia,
        saveAllStages,
        updateEventSettings,
        refreshData: loadAll,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvent = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
};
