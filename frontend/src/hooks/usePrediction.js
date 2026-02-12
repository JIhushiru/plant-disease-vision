import { useState, useCallback } from "react";
import { predictDisease } from "../services/api";

export function usePrediction() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const predict = useCallback(async (file) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await predictDisease(file);
      setResult(data);
      return data;
    } catch (err) {
      const message =
        err.response?.data?.detail ||
        err.message ||
        "An unexpected error occurred.";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, loading, error, predict, reset };
}
