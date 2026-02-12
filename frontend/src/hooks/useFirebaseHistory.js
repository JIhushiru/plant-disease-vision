import { useState, useEffect, useCallback } from "react";
import {
  isFirebaseEnabled,
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
  const enabled = isFirebaseEnabled();

  useEffect(() => {
    if (!enabled) return;

    const unsubscribe = subscribeToHistory((entries) => {
      setHistory(entries);
    });

    return unsubscribe;
  }, [enabled]);

  const addEntry = useCallback(
    async (result, file) => {
      if (!enabled || !result?.success) return;
      const thumbnail = file ? await createThumbnail(file) : null;
      await saveAnalysis(result, thumbnail);
    },
    [enabled],
  );

  const clear = useCallback(async () => {
    if (!enabled) return;
    await clearHistory();
  }, [enabled]);

  return { history, addEntry, clear, enabled };
}
