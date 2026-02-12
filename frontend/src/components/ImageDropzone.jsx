import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, Leaf } from "lucide-react";

export default function ImageDropzone({ onFileSelect, loading, preview }) {
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
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer
        overflow-hidden group
        ${
          isDragActive
            ? "border-primary-400 bg-primary-50/70 scale-[1.01] shadow-lg shadow-primary-500/10"
            : preview
              ? "border-transparent bg-gray-50 hover:shadow-lg"
              : "border-gray-200 hover:border-primary-300 hover:bg-primary-50/30 hover:shadow-md"
        }
        ${loading ? "opacity-60 pointer-events-none" : ""}
        ${preview ? "p-0 border-solid" : "p-8 sm:p-14"}
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
            className="relative aspect-4/3 sm:aspect-16/10"
          >
            <img
              src={preview}
              alt="Uploaded plant leaf"
              className="w-full h-full object-contain bg-gray-50 rounded-2xl"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 rounded-2xl flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                className="opacity-0 group-hover:opacity-100 transition-all duration-200 bg-white/95 backdrop-blur-sm rounded-xl px-5 py-2.5 shadow-xl"
              >
                <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-primary-500" />
                  Click or drop to replace
                </p>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-5 text-center"
          >
            <motion.div
              animate={
                isDragActive
                  ? { scale: 1.1, rotate: [0, -5, 5, 0] }
                  : { scale: 1 }
              }
              transition={{ duration: 0.4 }}
              className={`
                w-18 h-18 rounded-2xl flex items-center justify-center transition-colors duration-300 shadow-sm
                ${
                  isDragActive
                    ? "bg-primary-200 shadow-primary-200/50"
                    : "bg-gray-100 group-hover:bg-primary-100"
                }
              `}
            >
              {isDragActive ? (
                <Leaf className="w-8 h-8 text-primary-600" />
              ) : (
                <Upload className="w-8 h-8 text-gray-400 group-hover:text-primary-500 transition-colors duration-300" />
              )}
            </motion.div>
            <div>
              <p className="text-base font-bold text-gray-800">
                {isDragActive
                  ? "Drop your image here"
                  : "Drop a plant leaf image here"}
              </p>
              <p className="text-sm text-gray-500 mt-1.5">
                or{" "}
                <span className="text-primary-600 font-medium">
                  click to browse
                </span>{" "}
                your files
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="bg-gray-100 px-2.5 py-1 rounded-md">JPG</span>
              <span className="bg-gray-100 px-2.5 py-1 rounded-md">PNG</span>
              <span className="bg-gray-100 px-2.5 py-1 rounded-md">WebP</span>
              <span className="text-gray-300">|</span>
              <span>Max 10 MB</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
