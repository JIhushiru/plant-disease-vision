import { useState, useCallback, useRef } from "react";
import Header from "./components/Header";
import ImageDropzone from "./components/ImageDropzone";
import ResultCard from "./components/ResultCard";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import InfoPanel from "./components/InfoPanel";
import HistoryPanel from "./components/HistoryPanel";
import HowItWorks from "./components/HowItWorks";
import SupportedPlants from "./components/SupportedPlants";
import { usePrediction } from "./hooks/usePrediction";
import { RotateCcw } from "lucide-react";

let historyId = 0;

export default function App() {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [history, setHistory] = useState([]);
  const { result, loading, error, predict, reset, restoreResult } = usePrediction();
  const resultRef = useRef(null);

  const handleFileSelect = useCallback(
    async (file) => {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);

      const data = await predict(file);
      if (data?.success) {
        setHistory((prev) => [
          { id: ++historyId, preview: url, result: data, timestamp: Date.now() },
          ...prev.slice(0, 9),
        ]);
      }

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    },
    [predict],
  );

  const handleReset = useCallback(() => {
    setPreview(null);
    setSelectedFile(null);
    reset();
  }, [reset]);

  const handleRetry = useCallback(() => {
    if (selectedFile) {
      predict(selectedFile);
    }
  }, [selectedFile, predict]);

  const handleHistorySelect = useCallback(
    (item) => {
      setPreview(item.preview);
      setSelectedFile(null);
      restoreResult(item.result);
    },
    [restoreResult],
  );

  const handleHistoryClear = useCallback(() => {
    setHistory([]);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/30">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero */}
        <div className="text-center mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
            Powered by Deep Learning
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Diagnose Plant Diseases
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-600 to-primary-400">
              Instantly
            </span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Upload a photo of a plant leaf to detect diseases using deep
            learning. Get detailed diagnosis with treatment recommendations in
            seconds.
          </p>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* Left column - Upload + History */}
          <div className="lg:col-span-3 space-y-4">
            <ImageDropzone
              onFileSelect={handleFileSelect}
              loading={loading}
              preview={preview}
            />
            {preview && (
              <button
                onClick={handleReset}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl
                  text-sm font-medium text-gray-600 bg-white border border-gray-200
                  hover:bg-gray-50 hover:border-gray-300 transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-4 h-4" />
                Upload a different image
              </button>
            )}
            <HistoryPanel
              history={history}
              onSelect={handleHistorySelect}
              onClear={handleHistoryClear}
            />
          </div>

          {/* Right column - Results */}
          <div className="lg:col-span-2 space-y-4" ref={resultRef}>
            {loading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} onRetry={handleRetry} />}
            {result && <ResultCard result={result} />}
            {!loading && !error && !result && <InfoPanel />}
          </div>
        </div>

        {/* How it works + Supported plants */}
        {!result && !loading && (
          <>
            <HowItWorks />
            <SupportedPlants />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400">
              Plant Disease Vision — Built with PyTorch, FastAPI, and React
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>Model: EfficientNet-B0</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>Dataset: PlantVillage</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span>38 Classes</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
