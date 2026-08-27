/**
 * Serviços de Dados Locais & Informativos para THE VOICE LUNDA-SUL
 * Operação 100% desconectada de servidores externos / Firebase, com persistência local garantida.
 */
import {
  Candidate,
  NewsItem,
  Stage,
  GalleryItem,
  EventSettings,
  Evaluation,
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_STAGES,
  INITIAL_CANDIDATES,
  INITIAL_NEWS,
  INITIAL_GALLERY,
  INITIAL_EVALUATIONS,
} from '../data/initialData';

// Chaves de Armazenamento Local
const STORAGE_KEYS = {
  CANDIDATES: 'tvls_candidatos_v1',
  NEWS: 'tvls_noticias_v1',
  STAGES: 'tvls_etapas_v1',
  GALLERY: 'tvls_galeria_v1',
  SETTINGS: 'tvls_configuracoes_v1',
  EVALUATIONS: 'tvls_avaliacoes_v1',
};

// Helper para ler dados locais com fallback nos dados iniciais oficiais
function getLocal<T>(key: string, defaultVal: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(item);
  } catch (e) {
    return defaultVal;
  }
}

function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn('Erro ao guardar no armazenamento local:', e);
  }
}

// ================= CANDIDATOS =================

export async function fetchCandidates(): Promise<Candidate[]> {
  return getLocal<Candidate[]>(STORAGE_KEYS.CANDIDATES, INITIAL_CANDIDATES);
}

export async function saveCandidate(candidate: Candidate): Promise<void> {
  const current = getLocal<Candidate[]>(STORAGE_KEYS.CANDIDATES, INITIAL_CANDIDATES);
  const index = current.findIndex((c) => c.id === candidate.id || c.codigoInscricao === candidate.codigoInscricao);
  if (index >= 0) {
    current[index] = candidate;
  } else {
    current.unshift(candidate);
  }
  setLocal(STORAGE_KEYS.CANDIDATES, current);
}

export async function findCandidateByCodeOrEmail(queryVal: string): Promise<Candidate | null> {
  const clean = queryVal.trim().toLowerCase();
  const all = await fetchCandidates();
  return (
    all.find(
      (c) =>
        c.codigoInscricao.toLowerCase() === clean ||
        c.email.toLowerCase() === clean ||
        c.bi.toLowerCase() === clean
    ) || null
  );
}

// ================= NOTÍCIAS =================

export async function fetchNews(): Promise<NewsItem[]> {
  return getLocal<NewsItem[]>(STORAGE_KEYS.NEWS, INITIAL_NEWS);
}

export async function saveNewsItem(news: NewsItem): Promise<void> {
  const current = getLocal<NewsItem[]>(STORAGE_KEYS.NEWS, INITIAL_NEWS);
  const idx = current.findIndex((n) => n.id === news.id);
  if (idx >= 0) {
    current[idx] = news;
  } else {
    current.unshift(news);
  }
  setLocal(STORAGE_KEYS.NEWS, current);
}

export async function deleteNewsItem(id: string): Promise<void> {
  const current = getLocal<NewsItem[]>(STORAGE_KEYS.NEWS, INITIAL_NEWS);
  const updated = current.filter((n) => n.id !== id);
  setLocal(STORAGE_KEYS.NEWS, updated);
}

// ================= ETAPAS =================

export async function fetchStages(): Promise<Stage[]> {
  return getLocal<Stage[]>(STORAGE_KEYS.STAGES, INITIAL_STAGES);
}

export async function saveStages(stages: Stage[]): Promise<void> {
  setLocal(STORAGE_KEYS.STAGES, stages);
}

// ================= AVALIAÇÕES DO JÚRI =================

export async function fetchEvaluations(): Promise<Evaluation[]> {
  return getLocal<Evaluation[]>(STORAGE_KEYS.EVALUATIONS, INITIAL_EVALUATIONS);
}

export async function saveEvaluation(evalItem: Evaluation): Promise<void> {
  const current = getLocal<Evaluation[]>(STORAGE_KEYS.EVALUATIONS, INITIAL_EVALUATIONS);
  const idx = current.findIndex((e) => e.id === evalItem.id);
  if (idx >= 0) {
    current[idx] = evalItem;
  } else {
    current.push(evalItem);
  }
  setLocal(STORAGE_KEYS.EVALUATIONS, current);
}

// ================= GALERIA =================

export async function fetchGallery(): Promise<GalleryItem[]> {
  return getLocal<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
}

export async function saveGalleryItem(item: GalleryItem): Promise<void> {
  const current = getLocal<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
  const idx = current.findIndex((g) => g.id === item.id);
  if (idx >= 0) {
    current[idx] = item;
  } else {
    current.unshift(item);
  }
  setLocal(STORAGE_KEYS.GALLERY, current);
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const current = getLocal<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
  const updated = current.filter((g) => g.id !== id);
  setLocal(STORAGE_KEYS.GALLERY, updated);
}

// ================= CONFIGURAÇÕES =================

export async function fetchSettings(): Promise<EventSettings> {
  return getLocal<EventSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
}

export async function saveSettings(settings: EventSettings): Promise<void> {
  setLocal(STORAGE_KEYS.SETTINGS, settings);
}
