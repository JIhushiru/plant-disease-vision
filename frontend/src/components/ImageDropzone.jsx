import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, X } from "lucide-react";

export default function ImageDropzone({ onFileSelect, loading, preview }) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/bmp": [".bmp"],
    },
    multiple: false,
    disabled: loading,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
        overflow-hidden group
        ${
          isDragActive || dragActive
            ? "border-primary-400 bg-primary-50 scale-[1.02]"
            : "border-gray-200 hover:border-primary-300 hover:bg-gray-50"
        }
        ${loading ? "opacity-60 pointer-events-none" : ""}
        ${preview ? "p-0" : "p-8 sm:p-12"}
      `}
    >
      <input {...getInputProps()} />

      <AnimatePresence mode="wait">
        {preview ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative aspect-[4/3] sm:aspect-[16/10]"
          >
            <img
              src={preview}
              alt="Uploaded plant leaf"
              className="w-full h-full object-contain bg-gray-50 rounded-2xl"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-2xl flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
                <p className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Click or drop to replace
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <div
              className={`
                w-16 h-16 rounded-2xl flex items-center justify-center transition-colors duration-300
                ${isDragActive ? "bg-primary-100" : "bg-gray-100 group-hover:bg-primary-50"}
              `}
            >
              <Upload
                className={`w-7 h-7 transition-colors duration-300 ${
                  isDragActive
                    ? "text-primary-600"
                    : "text-gray-400 group-hover:text-primary-500"
                }`}
              />
            </div>
            <div>
              <p className="text-base font-semibold text-gray-700">
                Drop a plant leaf image here
              </p>
              <p className="text-sm text-gray-500 mt-1">
                or click to browse your files
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Supports JPG, PNG, WebP, BMP — up to 10 MB
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
