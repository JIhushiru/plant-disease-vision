import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, query, limitToLast, onValue, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isConfigured = Object.values(firebaseConfig).every(Boolean);

let db = null;

if (isConfigured) {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
}

export function isFirebaseEnabled() {
  return db !== null;
}

export function saveAnalysis(prediction, imageDataUrl) {
  if (!db) return null;

  const analysesRef = ref(db, "analyses");
  return push(analysesRef, {
    prediction: prediction.prediction,
    alternatives: prediction.alternatives,
    imageSnippet: imageDataUrl || null,
    timestamp: Date.now(),
  });
}

export function subscribeToHistory(callback, limit = 10) {
  if (!db) {
    callback([]);
    return () => {};
  }

  const analysesRef = ref(db, "analyses");
  const recentQuery = query(analysesRef, limitToLast(limit));

  const unsubscribe = onValue(recentQuery, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      callback([]);
      return;
    }

    const entries = Object.entries(data)
      .map(([id, value]) => ({ id, ...value }))
      .sort((a, b) => b.timestamp - a.timestamp);

    callback(entries);
  });

  return unsubscribe;
}

export function clearHistory() {
  if (!db) return null;
  const analysesRef = ref(db, "analyses");
  return remove(analysesRef);
}
