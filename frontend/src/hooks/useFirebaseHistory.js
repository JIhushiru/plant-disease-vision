import { useState, useEffect, useCallback } from "react";
import {
  isFirebaseEnabled,
  onAuthReady,
  saveAnalysis,
  subscribeToHistory,
  clearHistory,
} from "../services/firebase";

function createThumbnail(file, maxSize = 80) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.6));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

export function useFirebaseHistory() {
  const [history, setHistory] = useState([]);
  const [authed, setAuthed] = useState(false);
  const enabled = isFirebaseEnabled();

  useEffect(() => {
    if (!enabled) return;
    const unsubscribe = onAuthReady((user) => setAuthed(!!user));
    return unsubscribe;
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !authed) return;

    const unsubscribe = subscribeToHistory((entries) => {
      setHistory(entries);
    });

    return unsubscribe;
  }, [enabled, authed]);

  const addEntry = useCallback(
    async (result, file) => {
      if (!enabled || !authed || !result?.success) return;
      const thumbnail = file ? await createThumbnail(file) : null;
      await saveAnalysis(result, thumbnail);
    },
    [enabled, authed],
  );

  const clear = useCallback(async () => {
    if (!enabled || !authed) return;
    await clearHistory();
  }, [enabled, authed]);

  return { history, addEntry, clear, enabled };
}
