import { motion, AnimatePresence } from "framer-motion";
import { Clock, ShieldCheck, ShieldAlert, Trash2, X } from "lucide-react";

export default function HistoryPanel({ history, onSelect, onClear }) {
  if (history.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-50">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-700">
            Recent Analyses
          </h3>
          <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
            {history.length}
          </span>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-gray-400 hover:text-danger-500 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>

      <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {history.map((item, idx) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onSelect(item)}
              className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left"
            >
              <img
                src={item.preview}
                alt=""
                className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-100"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {item.prediction.condition}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {item.prediction.plant} — {item.prediction.confidence.toFixed(1)}%
                </p>
              </div>
              <div className="shrink-0">
                {item.prediction.is_healthy ? (
                  <ShieldCheck className="w-4 h-4 text-primary-500" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-danger-400" />
                )}
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
