import { motion } from "framer-motion";
import { Scan } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4 py-8"
    >
      <div className="relative">
        <motion.div
          className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center"
          animate={{ rotate: [0, 0, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Scan className="w-7 h-7 text-primary-600" />
        </motion.div>
        <motion.div
          className="absolute inset-0 rounded-2xl border-2 border-primary-400"
          animate={{ scale: [1, 1.3, 1.3], opacity: [0.6, 0, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-700">
          Analyzing leaf image...
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Running classification model
        </p>
      </div>
    </motion.div>
  );
}
