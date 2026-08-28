import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import configData from '../../firebase-applet-config.json';

export const firebaseConfig = {
  apiKey: configData.apiKey || "",
  authDomain: configData.authDomain || "",
  projectId: configData.projectId || "",
  storageBucket: configData.storageBucket || "",
  messagingSenderId: configData.messagingSenderId || "",
  appId: configData.appId || "",
};

// Check if valid Firebase configuration is active
export const isConfigured = Boolean(firebaseConfig.projectId && firebaseConfig.apiKey);

export const app = isConfigured
  ? (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig))
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app
  ? (configData.firestoreDatabaseId && configData.firestoreDatabaseId !== '(default)'
      ? getFirestore(app, configData.firestoreDatabaseId)
      : getFirestore(app))
  : null;
export const storage = app ? getStorage(app) : null;
