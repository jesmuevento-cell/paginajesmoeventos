/**
 * Serviços Firestore e Armazenamento para THE VOICE LUNDA-SUL
 * Inclui sincronização com Firestore real e persistência local garantida.
 */
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db, isConfigured } from './config';
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

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    operationType,
    path,
  };
  console.error('Firestore Error Log:', JSON.stringify(errInfo));
  return errInfo;
}

// Local storage storage keys
const STORAGE_KEYS = {
  CANDIDATES: 'tvls_candidatos_v1',
  NEWS: 'tvls_noticias_v1',
  STAGES: 'tvls_etapas_v1',
  GALLERY: 'tvls_galeria_v1',
  SETTINGS: 'tvls_configuracoes_v1',
  EVALUATIONS: 'tvls_avaliacoes_v1',
};

// Helper for local state
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
    console.error('Erro ao guardar no armazenamento local:', e);
  }
}

// ================= CANDIDATOS =================

export async function fetchCandidates(): Promise<Candidate[]> {
  if (isConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'candidatos'));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Candidate));
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'candidatos');
    }
  }
  return getLocal<Candidate[]>(STORAGE_KEYS.CANDIDATES, INITIAL_CANDIDATES);
}

export async function saveCandidate(candidate: Candidate): Promise<void> {
  // Update local storage first
  const current = getLocal<Candidate[]>(STORAGE_KEYS.CANDIDATES, INITIAL_CANDIDATES);
  const index = current.findIndex((c) => c.id === candidate.id || c.codigoInscricao === candidate.codigoInscricao);
  if (index >= 0) {
    current[index] = candidate;
  } else {
    current.unshift(candidate);
  }
  setLocal(STORAGE_KEYS.CANDIDATES, current);

  // Sync to Firestore if configured
  if (isConfigured && db) {
    try {
      await setDoc(doc(db, 'candidatos', candidate.id), candidate);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `candidatos/${candidate.id}`);
    }
  }
}

export async function findCandidateByCodeOrEmail(
  queryVal: string
): Promise<Candidate | null> {
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
  if (isConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'noticias'));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ ...d.data(), id: d.id } as NewsItem));
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'noticias');
    }
  }
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

  if (isConfigured && db) {
    try {
      await setDoc(doc(db, 'noticias', news.id), news);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `noticias/${news.id}`);
    }
  }
}

export async function deleteNewsItem(id: string): Promise<void> {
  const current = getLocal<NewsItem[]>(STORAGE_KEYS.NEWS, INITIAL_NEWS);
  const updated = current.filter((n) => n.id !== id);
  setLocal(STORAGE_KEYS.NEWS, updated);

  if (isConfigured && db) {
    try {
      await deleteDoc(doc(db, 'noticias', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `noticias/${id}`);
    }
  }
}

// ================= ETAPAS =================

export async function fetchStages(): Promise<Stage[]> {
  if (isConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'etapas'));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ ...d.data(), id: Number(d.id) } as Stage));
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'etapas');
    }
  }
  return getLocal<Stage[]>(STORAGE_KEYS.STAGES, INITIAL_STAGES);
}

export async function saveStages(stages: Stage[]): Promise<void> {
  setLocal(STORAGE_KEYS.STAGES, stages);
  if (isConfigured && db) {
    try {
      for (const s of stages) {
        await setDoc(doc(db, 'etapas', String(s.id)), s);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'etapas');
    }
  }
}

// ================= AVALIAÇÕES DO JÚRI =================

export async function fetchEvaluations(): Promise<Evaluation[]> {
  if (isConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'avaliacoes'));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ ...d.data(), id: d.id } as Evaluation));
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'avaliacoes');
    }
  }
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

  if (isConfigured && db) {
    try {
      await setDoc(doc(db, 'avaliacoes', evalItem.id), evalItem);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `avaliacoes/${evalItem.id}`);
    }
  }
}

// ================= GALERIA =================

export async function fetchGallery(): Promise<GalleryItem[]> {
  if (isConfigured && db) {
    try {
      const snap = await getDocs(collection(db, 'galeria'));
      if (!snap.empty) {
        return snap.docs.map((d) => ({ ...d.data(), id: d.id } as GalleryItem));
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'galeria');
    }
  }
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

  if (isConfigured && db) {
    try {
      await setDoc(doc(db, 'galeria', item.id), item);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `galeria/${item.id}`);
    }
  }
}

export async function deleteGalleryItem(id: string): Promise<void> {
  const current = getLocal<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
  const updated = current.filter((g) => g.id !== id);
  setLocal(STORAGE_KEYS.GALLERY, updated);

  if (isConfigured && db) {
    try {
      await deleteDoc(doc(db, 'galeria', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `galeria/${id}`);
    }
  }
}

// ================= CONFIGURAÇÕES =================

export async function fetchSettings(): Promise<EventSettings> {
  if (isConfigured && db) {
    try {
      const snap = await getDoc(doc(db, 'configuracoes', 'geral'));
      if (snap.exists()) {
        return snap.data() as EventSettings;
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'configuracoes/geral');
    }
  }
  return getLocal<EventSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
}

export async function saveSettings(settings: EventSettings): Promise<void> {
  setLocal(STORAGE_KEYS.SETTINGS, settings);
  if (isConfigured && db) {
    try {
      await setDoc(doc(db, 'configuracoes', 'geral'), settings);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'configuracoes/geral');
    }
  }
}
