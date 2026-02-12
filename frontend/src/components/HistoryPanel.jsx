import { motion, AnimatePresence } from "framer-motion";
import { Clock, ShieldCheck, ShieldAlert, Trash2, Cloud } from "lucide-react";

function getPrediction(item) {
  if (item.result?.prediction) return item.result.prediction;
  if (item.prediction) return item.prediction;
  return null;
}

function getThumbnail(item) {
  return item.preview || item.imageSnippet || null;
}

export default function HistoryPanel({
  history,
  onSelect,
  onClear,
  persisted = false,
}) {
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
          {persisted && (
            <Cloud className="w-3.5 h-3.5 text-primary-400" title="Synced to cloud" />
          )}
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
          {history.map((item, idx) => {
            const pred = getPrediction(item);
            const thumb = getThumbnail(item);

            if (!pred) return null;

            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => onSelect(item)}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left"
              >
                {thumb ? (
                  <img
                    src={thumb}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover shrink-0 border border-gray-100"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gray-100 shrink-0 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">img</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {pred.condition}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {pred.plant} — {pred.confidence.toFixed(1)}%
                  </p>
                </div>
                <div className="shrink-0">
                  {pred.is_healthy ? (
                    <ShieldCheck className="w-4 h-4 text-primary-500" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-danger-400" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
