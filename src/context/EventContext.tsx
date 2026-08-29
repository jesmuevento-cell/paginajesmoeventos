import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Candidate,
  NewsItem,
  Stage,
  GalleryItem,
  EventSettings,
  Evaluation,
  CandidateStatus,
  PaymentOrder,
  PaymentMethodConfig,
  PaymentProof,
} from '../types';
import {
  fetchCandidates,
  saveCandidate,
  deleteCandidate as deleteCandidateService,
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
  fetchPaymentOrders,
  fetchPaymentMethods,
  savePaymentOrder,
  savePaymentMethods,
  submitPaymentProof as submitPaymentProofService,
  confirmPayment as confirmPaymentService,
  rejectPayment as rejectPaymentService,
  cancelPayment as cancelPaymentService,
  createOrderObject,
  INITIAL_PAYMENT_METHODS,
  REGISTRATION_FEE,
} from '../services/paymentService';
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
  paymentOrders: PaymentOrder[];
  paymentMethods: PaymentMethodConfig[];
  loading: boolean;
  isRegistrationOpen: boolean;
  isRegistrationEnded: boolean;
  isRegistrationPending: boolean;
  registerCandidate: (data: Omit<Candidate, 'id' | 'codigoInscricao' | 'estado' | 'dataInscricao' | 'criadoEm'>) => Promise<{ candidate: Candidate; paymentOrder: PaymentOrder }>;
  updateCandidateStatus: (id: string, newStatus: CandidateStatus, message?: string) => Promise<void>;
  updateCandidate: (candidate: Candidate) => Promise<void>;
  deleteCandidate: (id: string) => Promise<void>;
  submitEvaluation: (evaluation: Omit<Evaluation, 'id' | 'data'>) => Promise<Evaluation>;
  addNewsItem: (news: Omit<NewsItem, 'id' | 'criadoEm'>) => Promise<void>;
  editNewsItem: (news: NewsItem) => Promise<void>;
  deleteNews: (id: string) => Promise<void>;
  addGalleryMedia: (item: Omit<GalleryItem, 'id'>) => Promise<void>;
  deleteGalleryMedia: (id: string) => Promise<void>;
  saveAllStages: (updatedStages: Stage[]) => Promise<void>;
  updateEventSettings: (newSettings: EventSettings) => Promise<void>;
  submitPaymentProof: (orderId: string, proofData: {
    comprovativoUrl: string;
    comprovativoNomeArquivo?: string;
    comprovativoTamanho?: number;
    dataPagamentoInformada: string;
    metodoUtilizado: string;
    nomePagador?: string;
    numeroTransacao?: string;
    observacoes?: string;
  }) => Promise<PaymentOrder>;
  confirmPayment: (orderId: string, admin: { uid: string; nome: string }) => Promise<{ order: PaymentOrder; receiptCode: string }>;
  rejectPayment: (orderId: string, motivo: string, admin: { uid: string; nome: string }) => Promise<PaymentOrder>;
  cancelPayment: (orderId: string, motivo: string, admin: { uid: string; nome: string }) => Promise<PaymentOrder>;
  updatePaymentMethodsList: (methods: PaymentMethodConfig[]) => Promise<void>;
  getPaymentOrderByCode: (code: string) => PaymentOrder | undefined;
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
  const [paymentOrders, setPaymentOrders] = useState<PaymentOrder[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodConfig[]>(INITIAL_PAYMENT_METHODS);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [st, cands, nws, gal, evals, sets, orders, methods] = await Promise.all([
        fetchStages(),
        fetchCandidates(),
        fetchNews(),
        fetchGallery(),
        fetchEvaluations(),
        fetchSettings(),
        fetchPaymentOrders(),
        fetchPaymentMethods(),
      ]);
      setStages(st);
      setCandidates(cands);
      setNews(nws);
      setGallery(gal);
      setEvaluations(evals);
      setSettings(sets);
      setPaymentMethods(methods);

      // Sincronizar ordens para candidatos existentes que não tinham ordem criada
      let syncdOrders = [...orders];
      const missingOrders: PaymentOrder[] = [];
      for (const cand of cands) {
        const hasOrder = syncdOrders.some(
          (o) => o.codigoInscricao === cand.codigoInscricao || o.candidatoId === cand.id
        );
        if (!hasOrder) {
          const autoOrder = createOrderObject(cand);
          missingOrders.push(autoOrder);
          savePaymentOrder(autoOrder).catch(() => {});
        }
      }
      if (missingOrders.length > 0) {
        syncdOrders = [...missingOrders, ...syncdOrders];
      }
      setPaymentOrders(syncdOrders);
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
  ): Promise<{ candidate: Candidate; paymentOrder: PaymentOrder }> => {
    const randomCodeNum = Math.floor(100000 + Math.random() * 900000);
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
        'A sua inscrição no THE VOICE LUNDA-SUL foi submetida com sucesso. Efectue o pagamento de 5.000 Kz e envie o comprovativo para validação oficial.',
      ],
      dataInscricao: formattedDate,
      criadoEm: timestamp,
      ordemPagamentoId: `PAY-${uniqueCode}`,
      pagamento: {
        ordemId: `PAY-${uniqueCode}`,
        estado: 'AGUARDANDO PAGAMENTO',
        valor: REGISTRATION_FEE,
      },
    };

    // 1. Criar Ordem de Pagamento associada
    const order = createOrderObject(newCandidate);

    await Promise.all([
      saveCandidate(newCandidate),
      savePaymentOrder(order),
    ]);

    setCandidates((prev) => [newCandidate, ...prev]);
    setPaymentOrders((prev) => [order, ...prev]);

    return { candidate: newCandidate, paymentOrder: order };
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

  const deleteCandidate = async (id: string) => {
    await deleteCandidateService(id);
    setCandidates((prev) => prev.filter((c) => c.id !== id && c.codigoInscricao !== id));
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

  // Pagamentos - Ações
  const submitPaymentProof = async (
    orderId: string,
    proofData: {
      comprovativoUrl: string;
      comprovativoNomeArquivo?: string;
      comprovativoTamanho?: number;
      dataPagamentoInformada: string;
      metodoUtilizado: string;
      nomePagador?: string;
      numeroTransacao?: string;
      observacoes?: string;
    }
  ): Promise<PaymentOrder> => {
    const updated = await submitPaymentProofService(orderId, proofData);
    setPaymentOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));

    // Atualizar candidato em memória
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.codigoInscricao === updated.codigoInscricao || c.id === updated.candidatoId) {
          const updatedCand: Candidate = {
            ...c,
            pagamento: {
              ordemId: updated.id,
              estado: updated.estado,
              valor: updated.valor,
            },
          };
          saveCandidate(updatedCand).catch(() => {});
          return updatedCand;
        }
        return c;
      })
    );

    return updated;
  };

  const confirmPayment = async (
    orderId: string,
    admin: { uid: string; nome: string }
  ): Promise<{ order: PaymentOrder; receiptCode: string }> => {
    const res = await confirmPaymentService(orderId, admin);
    setPaymentOrders((prev) => prev.map((o) => (o.id === orderId ? res.order : o)));

    // Atualizar candidato para Aprovada / Validada
    setCandidates((prev) =>
      prev.map((c) => {
        if (c.codigoInscricao === res.order.codigoInscricao || c.id === res.order.candidatoId) {
          const updatedCand: Candidate = {
            ...c,
            estado: 'Aprovada',
            pagamento: {
              ordemId: res.order.id,
              estado: 'PAGO E CONFIRMADO',
              valor: res.order.valor,
              dataConfirmacao: res.order.confirmadoPor?.dataHora,
              codigoConfirmacao: res.receiptCode,
            },
            mensagensOrganizacao: [
              ...(c.mensagensOrganizacao || []),
              `Pagamento de 5.000 Kz confirmado por ${admin.nome}. Inscrição validada com sucesso! Recibo: ${res.receiptCode}`,
            ],
          };
          saveCandidate(updatedCand).catch(() => {});
          return updatedCand;
        }
        return c;
      })
    );

    return res;
  };

  const rejectPayment = async (
    orderId: string,
    motivo: string,
    admin: { uid: string; nome: string }
  ): Promise<PaymentOrder> => {
    const updated = await rejectPaymentService(orderId, motivo, admin);
    setPaymentOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));

    setCandidates((prev) =>
      prev.map((c) => {
        if (c.codigoInscricao === updated.codigoInscricao || c.id === updated.candidatoId) {
          const updatedCand: Candidate = {
            ...c,
            pagamento: {
              ordemId: updated.id,
              estado: 'PAGAMENTO REJEITADO',
              valor: updated.valor,
            },
            mensagensOrganizacao: [
              ...(c.mensagensOrganizacao || []),
              `Atenção: O comprovativo de pagamento foi rejeitado. Motivo: ${motivo}. Por favor, envie um novo comprovativo válido.`,
            ],
          };
          saveCandidate(updatedCand).catch(() => {});
          return updatedCand;
        }
        return c;
      })
    );

    return updated;
  };

  const cancelPayment = async (
    orderId: string,
    motivo: string,
    admin: { uid: string; nome: string }
  ): Promise<PaymentOrder> => {
    const updated = await cancelPaymentService(orderId, motivo, admin);
    setPaymentOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    return updated;
  };

  const updatePaymentMethodsList = async (methods: PaymentMethodConfig[]) => {
    const saved = await savePaymentMethods(methods);
    setPaymentMethods(saved);
  };

  const getPaymentOrderByCode = (code: string): PaymentOrder | undefined => {
    const clean = (code || '').trim().toUpperCase();
    return paymentOrders.find((o) => (o.codigoInscricao || '').toUpperCase() === clean);
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
        paymentOrders,
        paymentMethods,
        loading,
        isRegistrationOpen,
        isRegistrationEnded,
        isRegistrationPending,
        registerCandidate,
        updateCandidateStatus,
        updateCandidate,
        deleteCandidate,
        submitEvaluation,
        addNewsItem,
        editNewsItem,
        deleteNews,
        addGalleryMedia,
        deleteGalleryMedia,
        saveAllStages,
        updateEventSettings,
        submitPaymentProof,
        confirmPayment,
        rejectPayment,
        cancelPayment,
        updatePaymentMethodsList,
        getPaymentOrderByCode,
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

