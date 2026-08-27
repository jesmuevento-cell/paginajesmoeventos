/**
 * Configuração Central do Firebase para THE VOICE LUNDA-SUL
 * 
 * Para ligar ao seu projecto Firebase oficial:
 * 1. Aceda à Consola do Firebase (https://console.firebase.google.com/)
 * 2. Crie um projecto chamado "The Voice Lunda-Sul"
 * 3. Active os serviços: Authentication (Email/Password & Google), Cloud Firestore, e Firebase Storage.
 * 4. Copie as chaves do seu projecto web e substitua no objecto abaixo ou defina as variáveis de ambiente.
 */
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const metaEnv = (import.meta as any).env || {};

export const firebaseConfig = {
  apiKey: metaEnv.VITE_FIREBASE_API_KEY || "AIzaSy_MOCK_VOICE_LUNDA_SUL_KEY",
  authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN || "the-voice-lunda-sul.firebaseapp.com",
  projectId: metaEnv.VITE_FIREBASE_PROJECT_ID || "the-voice-lunda-sul",
  storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET || "the-voice-lunda-sul.appspot.com",
  messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || "850756224929",
  appId: metaEnv.VITE_FIREBASE_APP_ID || "1:850756224929:web:a1b2c3d4e5f6g7h8",
};

let appInstance;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;
let isFirebaseReady = false;

try {
  if (!getApps().length) {
    appInstance = initializeApp(firebaseConfig);
  } else {
    appInstance = getApp();
  }

  // Only initialize live services if valid API key is present
  if (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes('MOCK')) {
    authInstance = getAuth(appInstance);
    dbInstance = getFirestore(appInstance);
    storageInstance = getStorage(appInstance);
    isFirebaseReady = true;
  }
} catch (error) {
  console.info('Aviso: Firebase a operar em modo local/desconectado com persistência reactiva.', error);
}

export const app = appInstance;
export const auth = authInstance;
export const db = dbInstance;
export const storage = storageInstance;
export const isConfigured = isFirebaseReady;
