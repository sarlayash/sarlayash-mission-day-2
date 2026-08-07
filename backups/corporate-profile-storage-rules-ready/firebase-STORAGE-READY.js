import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const config = {
  apiKey: "AIzaSyD4Ji_owu1t4lbXNsF6GEiruGYDF1zsX0U",
  authDomain: "sarlayash-mission-day-2.firebaseapp.com",
  projectId: "sarlayash-mission-day-2",
  storageBucket: "sarlayash-mission-day-2.firebasestorage.app",
  messagingSenderId: "805370423564",
  appId: "1:805370423564:web:9e7dff20bf2b3518104129"
};

export const firebaseReady = Object.values(config).every(Boolean);

const firebaseApp = firebaseReady ? initializeApp(config) : null;

export const db = firebaseApp ? getFirestore(firebaseApp) : null;
export const auth = firebaseApp ? getAuth(firebaseApp) : null;
export const storage = firebaseApp ? getStorage(firebaseApp) : null;