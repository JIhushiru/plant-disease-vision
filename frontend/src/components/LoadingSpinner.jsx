import { motion } from "framer-motion";
import { Scan } from "lucide-react";

const pulseRings = [0, 1, 2];

export default function LoadingSpinner() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-5 py-10"
    >
      <div className="relative w-20 h-20">
        {pulseRings.map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-2xl border-2 border-primary-300"
            animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.6,
              ease: "easeOut",
            }}
          />
        ))}
        <motion.div
          className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary-100 to-primary-200 flex items-center justify-center"
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Scan className="w-8 h-8 text-primary-600" />
        </motion.div>
      </div>

      <div className="text-center space-y-1.5">
        <p className="text-sm font-semibold text-gray-800">
          Analyzing leaf image...
        </p>
        <p className="text-xs text-gray-400">
          Running EfficientNet-B0 classification model
        </p>
      </div>

      {/* Skeleton preview of results */}
      <div className="w-full space-y-3 mt-2">
        <div className="bg-gray-100 rounded-2xl p-5 animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gray-200" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
              <div className="h-3 bg-gray-200 rounded-lg w-1/3" />
            </div>
          </div>
          <div className="h-3 bg-gray-200 rounded-full w-full" />
        </div>
      </div>
    </motion.div>
  );
}
