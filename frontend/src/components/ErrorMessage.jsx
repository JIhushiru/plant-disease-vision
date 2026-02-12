import { motion } from "framer-motion";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorMessage({ message, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-danger-50 dark:bg-danger-900/20 border border-danger-200 dark:border-danger-700 rounded-2xl p-5"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-danger-100 dark:bg-danger-900/40 flex items-center justify-center shrink-0">
          <AlertCircle className="w-5 h-5 text-danger-600 dark:text-danger-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-danger-800 dark:text-danger-300">
            Analysis Failed
          </h4>
          <p className="text-sm text-danger-600 dark:text-danger-400 mt-1">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-danger-700 hover:text-danger-900 dark:text-danger-400 dark:hover:text-danger-300 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try again
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
