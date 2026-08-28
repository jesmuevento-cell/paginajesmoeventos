/**
 * Serviços de Dados Conectados ao Firestore & Firebase para THE VOICE LUNDA-SUL
 * Suporta persistência real em nuvem com Firestore e fallback reactivo local.
 */
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  limit,
} from 'firebase/firestore';
import { db, isConfigured } from './config';
import {
  Candidate,
  NewsItem,
  Stage,
  GalleryItem,
  EventSettings,
  Evaluation,
  AppUser,
} from '../types';
import {
  INITIAL_SETTINGS,
  INITIAL_STAGES,
  INITIAL_CANDIDATES,
  INITIAL_NEWS,
  INITIAL_GALLERY,
  INITIAL_EVALUATIONS,
} from '../data/initialData';

// Chaves de Armazenamento Local para Fallback / Cache
const STORAGE_KEYS = {
  CANDIDATES: 'tvls_candidatos_v1',
  NEWS: 'tvls_noticias_v1',
  STAGES: 'tvls_etapas_v1',
  GALLERY: 'tvls_galeria_v1',
  SETTINGS: 'tvls_configuracoes_v1',
  EVALUATIONS: 'tvls_avaliacoes_v1',
  USERS: 'tvls_usuarios_v1',
};

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
    console.warn('Aviso: Armazenamento local indisponível:', e);
  }
}

// ================= CANDIDATOS =================

export async function fetchCandidates(): Promise<Candidate[]> {
  if (db && isConfigured) {
    try {
      const colRef = collection(db, 'candidatos');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const cloudData = snap.docs.map((d) => d.data() as Candidate);
        setLocal(STORAGE_KEYS.CANDIDATES, cloudData);
        return cloudData;
      }
    } catch (err) {
      console.warn('Firestore fetchCandidates fallback:', err);
    }
  }
  return getLocal<Candidate[]>(STORAGE_KEYS.CANDIDATES, INITIAL_CANDIDATES);
}

export async function saveCandidate(candidate: Candidate): Promise<void> {
  // 1. Persistir no Firestore
  if (db && isConfigured) {
    try {
      const docId = candidate.id || candidate.codigoInscricao;
      const docRef = doc(db, 'candidatos', docId);
      await setDoc(docRef, candidate, { merge: true });
    } catch (err) {
      console.warn('Firestore saveCandidate warning:', err);
    }
  }

  // 2. Atualizar cache local
  const current = getLocal<Candidate[]>(STORAGE_KEYS.CANDIDATES, INITIAL_CANDIDATES);
  const index = current.findIndex(
    (c) => c.id === candidate.id || c.codigoInscricao === candidate.codigoInscricao
  );
  if (index >= 0) {
    current[index] = candidate;
  } else {
    current.unshift(candidate);
  }
  setLocal(STORAGE_KEYS.CANDIDATES, current);
}

export async function findCandidateByCodeOrEmail(queryVal: string): Promise<Candidate | null> {
  const clean = queryVal.trim().toUpperCase();
  const cleanLower = queryVal.trim().toLowerCase();

  // Firestore query direct
  if (db && isConfigured) {
    try {
      const colRef = collection(db, 'candidatos');
      // Busca por código
      const qCode = query(colRef, where('codigoInscricao', '==', clean), limit(1));
      const snapCode = await getDocs(qCode);
      if (!snapCode.empty) {
        return snapCode.docs[0].data() as Candidate;
      }

      // Busca por email
      const qEmail = query(colRef, where('email', '==', cleanLower), limit(1));
      const snapEmail = await getDocs(qEmail);
      if (!snapEmail.empty) {
        return snapEmail.docs[0].data() as Candidate;
      }
    } catch (err) {
      console.warn('Firestore findCandidateByCodeOrEmail query error:', err);
    }
  }

  // Fallback local
  const all = await fetchCandidates();
  return (
    all.find(
      (c) =>
        c.codigoInscricao.toUpperCase() === clean ||
        c.email.toLowerCase() === cleanLower ||
        c.bi.toUpperCase() === clean
    ) || null
  );
}

export async function deleteCandidate(id: string): Promise<void> {
  if (db && isConfigured) {
    try {
      const docRef = doc(db, 'candidatos', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Firestore deleteCandidate warning:', err);
    }
  }

  const current = getLocal<Candidate[]>(STORAGE_KEYS.CANDIDATES, INITIAL_CANDIDATES);
  const updated = current.filter((c) => c.id !== id && c.codigoInscricao !== id);
  setLocal(STORAGE_KEYS.CANDIDATES, updated);
}

// ================= NOTÍCIAS =================

export async function fetchNews(): Promise<NewsItem[]> {
  if (db && isConfigured) {
    try {
      const colRef = collection(db, 'noticias');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const cloudData = snap.docs.map((d) => d.data() as NewsItem);
        setLocal(STORAGE_KEYS.NEWS, cloudData);
        return cloudData;
      }
    } catch (err) {
      console.warn('Firestore fetchNews fallback:', err);
    }
  }
  return getLocal<NewsItem[]>(STORAGE_KEYS.NEWS, INITIAL_NEWS);
}

export async function saveNewsItem(news: NewsItem): Promise<void> {
  if (db && isConfigured) {
    try {
      const docRef = doc(db, 'noticias', news.id);
      await setDoc(docRef, news, { merge: true });
    } catch (err) {
      console.warn('Firestore saveNewsItem warning:', err);
    }
  }

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
  if (db && isConfigured) {
    try {
      const docRef = doc(db, 'noticias', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Firestore deleteNewsItem warning:', err);
    }
  }

  const current = getLocal<NewsItem[]>(STORAGE_KEYS.NEWS, INITIAL_NEWS);
  const updated = current.filter((n) => n.id !== id);
  setLocal(STORAGE_KEYS.NEWS, updated);
}

// ================= ETAPAS =================

export async function fetchStages(): Promise<Stage[]> {
  if (db && isConfigured) {
    try {
      const colRef = collection(db, 'etapas');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const stagesList = snap.docs.map((d) => d.data() as Stage);
        stagesList.sort((a, b) => a.numero - b.numero);
        setLocal(STORAGE_KEYS.STAGES, stagesList);
        return stagesList;
      }
    } catch (err) {
      console.warn('Firestore fetchStages fallback:', err);
    }
  }
  return getLocal<Stage[]>(STORAGE_KEYS.STAGES, INITIAL_STAGES);
}

export async function saveStages(stages: Stage[]): Promise<void> {
  if (db && isConfigured) {
    try {
      for (const st of stages) {
        const docRef = doc(db, 'etapas', `etapa-${st.numero}`);
        await setDoc(docRef, st, { merge: true });
      }
    } catch (err) {
      console.warn('Firestore saveStages warning:', err);
    }
  }
  setLocal(STORAGE_KEYS.STAGES, stages);
}

// ================= AVALIAÇÕES DO JÚRI =================

export async function fetchEvaluations(): Promise<Evaluation[]> {
  if (db && isConfigured) {
    try {
      const colRef = collection(db, 'avaliacoes');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const evalList = snap.docs.map((d) => d.data() as Evaluation);
        setLocal(STORAGE_KEYS.EVALUATIONS, evalList);
        return evalList;
      }
    } catch (err) {
      console.warn('Firestore fetchEvaluations fallback:', err);
    }
  }
  return getLocal<Evaluation[]>(STORAGE_KEYS.EVALUATIONS, INITIAL_EVALUATIONS);
}

export async function saveEvaluation(evalItem: Evaluation): Promise<void> {
  if (db && isConfigured) {
    try {
      const docRef = doc(db, 'avaliacoes', evalItem.id);
      await setDoc(docRef, evalItem, { merge: true });
    } catch (err) {
      console.warn('Firestore saveEvaluation warning:', err);
    }
  }

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
  if (db && isConfigured) {
    try {
      const colRef = collection(db, 'galeria');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const list = snap.docs.map((d) => d.data() as GalleryItem);
        setLocal(STORAGE_KEYS.GALLERY, list);
        return list;
      }
    } catch (err) {
      console.warn('Firestore fetchGallery fallback:', err);
    }
  }
  return getLocal<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
}

export async function saveGalleryItem(item: GalleryItem): Promise<void> {
  if (db && isConfigured) {
    try {
      const docRef = doc(db, 'galeria', item.id);
      await setDoc(docRef, item, { merge: true });
    } catch (err) {
      console.warn('Firestore saveGalleryItem warning:', err);
    }
  }

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
  if (db && isConfigured) {
    try {
      const docRef = doc(db, 'galeria', id);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Firestore deleteGalleryItem warning:', err);
    }
  }

  const current = getLocal<GalleryItem[]>(STORAGE_KEYS.GALLERY, INITIAL_GALLERY);
  const updated = current.filter((g) => g.id !== id);
  setLocal(STORAGE_KEYS.GALLERY, updated);
}

// ================= CONFIGURAÇÕES =================

export async function fetchSettings(): Promise<EventSettings> {
  if (db && isConfigured) {
    try {
      const docRef = doc(db, 'configuracoes', 'principal');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const cloudSettings = snap.data() as EventSettings;
        setLocal(STORAGE_KEYS.SETTINGS, cloudSettings);
        return cloudSettings;
      }
    } catch (err) {
      console.warn('Firestore fetchSettings fallback:', err);
    }
  }
  return getLocal<EventSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
}

export async function saveSettings(settings: EventSettings): Promise<void> {
  if (db && isConfigured) {
    try {
      const docRef = doc(db, 'configuracoes', 'principal');
      await setDoc(docRef, settings, { merge: true });
    } catch (err) {
      console.warn('Firestore saveSettings warning:', err);
    }
  }
  setLocal(STORAGE_KEYS.SETTINGS, settings);
}

// ================= UTILIZADORES / USUÁRIOS REGISTADOS =================

export async function fetchUsers(): Promise<AppUser[]> {
  if (db && isConfigured) {
    try {
      const colRef = collection(db, 'usuarios');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const usersList = snap.docs.map((d) => d.data() as AppUser);
        setLocal(STORAGE_KEYS.USERS, usersList);
        return usersList;
      }
    } catch (err) {
      console.warn('Firestore fetchUsers fallback:', err);
    }
  }
  return getLocal<AppUser[]>(STORAGE_KEYS.USERS, []);
}

export async function saveUser(user: AppUser): Promise<void> {
  if (db && isConfigured) {
    try {
      const docRef = doc(db, 'usuarios', user.uid);
      await setDoc(docRef, user, { merge: true });
    } catch (err) {
      console.warn('Firestore saveUser warning:', err);
    }
  }

  const current = getLocal<AppUser[]>(STORAGE_KEYS.USERS, []);
  const idx = current.findIndex((u) => u.uid === user.uid || u.email.toLowerCase() === user.email.toLowerCase());
  if (idx >= 0) {
    current[idx] = { ...current[idx], ...user };
  } else {
    current.unshift(user);
  }
  setLocal(STORAGE_KEYS.USERS, current);
}

export async function findUserByEmail(email: string): Promise<AppUser | null> {
  const cleanEmail = email.trim().toLowerCase();
  if (db && isConfigured) {
    try {
      const colRef = collection(db, 'usuarios');
      const q = query(colRef, where('email', '==', cleanEmail), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs[0].data() as AppUser;
      }
    } catch (err) {
      console.warn('Firestore findUserByEmail query error:', err);
    }
  }

  const all = await fetchUsers();
  return all.find((u) => u.email.toLowerCase() === cleanEmail) || null;
}

export async function deleteUser(uid: string): Promise<void> {
  if (db && isConfigured) {
    try {
      const docRef = doc(db, 'usuarios', uid);
      await deleteDoc(docRef);
    } catch (err) {
      console.warn('Firestore deleteUser warning:', err);
    }
  }

  const current = getLocal<AppUser[]>(STORAGE_KEYS.USERS, []);
  const updated = current.filter((u) => u.uid !== uid);
  setLocal(STORAGE_KEYS.USERS, updated);
}

