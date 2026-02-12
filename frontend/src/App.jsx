import { useState, useCallback } from "react";
import Header from "./components/Header";
import ImageDropzone from "./components/ImageDropzone";
import ResultCard from "./components/ResultCard";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";
import InfoPanel from "./components/InfoPanel";
import { usePrediction } from "./hooks/usePrediction";
import { RotateCcw } from "lucide-react";

export default function App() {
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { result, loading, error, predict, reset } = usePrediction();

  const handleFileSelect = useCallback(
    (file) => {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      predict(file);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Hero section */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Diagnose Plant Diseases{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400">
              Instantly
            </span>
          </h2>
          <p className="text-gray-500 max-w-lg mx-auto text-sm sm:text-base">
            Upload a photo of a plant leaf to detect diseases using deep
            learning. Get actionable treatment recommendations in seconds.
          </p>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Left column - Upload */}
          <div className="space-y-4">
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
          </div>

          {/* Right column - Results */}
          <div className="space-y-4">
            {loading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} onRetry={handleRetry} />}
            {result && <ResultCard result={result} />}
            {!loading && !error && !result && <InfoPanel />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-xs text-gray-400">
            Plant Disease Vision — Built with PyTorch, FastAPI, and React.
            Model trained on the PlantVillage dataset.
          </p>
        </div>
      </footer>
    </div>
  );
}
