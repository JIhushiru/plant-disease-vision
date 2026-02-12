import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
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
let auth = null;

if (isConfigured) {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  auth = getAuth(app);
  signInAnonymously(auth).catch((err) => {
    console.warn("Firebase anonymous auth failed:", err.message);
  });
}

export function isFirebaseEnabled() {
  return db !== null;
}

export function onAuthReady(callback) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, (user) => callback(user));
}

function getUserRef(path) {
  const uid = auth?.currentUser?.uid;
  if (!db || !uid) return null;
  return ref(db, `users/${uid}/${path}`);
}

export function saveAnalysis(prediction, imageDataUrl) {
  const analysesRef = getUserRef("analyses");
  if (!analysesRef) return null;

  return push(analysesRef, {
    prediction: prediction.prediction,
    alternatives: prediction.alternatives,
    imageSnippet: imageDataUrl || null,
    timestamp: Date.now(),
  });
}

export function subscribeToHistory(callback, limit = 10) {
  const analysesRef = getUserRef("analyses");
  if (!analysesRef) {
    callback([]);
    return () => {};
  }

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
  const analysesRef = getUserRef("analyses");
  if (!analysesRef) return null;
  return remove(analysesRef);
}
