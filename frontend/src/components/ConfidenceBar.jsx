import { motion } from "framer-motion";

export default function ConfidenceBar({
  label,
  confidence,
  isHealthy,
  isPrimary = false,
  delay = 0,
}) {
  const getColor = () => {
    if (isHealthy) return "bg-primary-500";
    if (confidence > 50) return "bg-danger-500";
    if (confidence > 25) return "bg-warning-500";
    return "bg-gray-400";
  };

  const getBgColor = () => {
    if (isHealthy) return "bg-primary-50 dark:bg-primary-900/20";
    if (confidence > 50) return "bg-danger-50 dark:bg-danger-900/20";
    if (confidence > 25) return "bg-warning-50 dark:bg-warning-400/10";
    return "bg-gray-50 dark:bg-slate-700";
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span
          className={`${
            isPrimary ? "text-sm font-semibold" : "text-xs font-medium"
          } text-gray-700 dark:text-slate-300 truncate mr-3`}
        >
          {label}
        </span>
        <span
          className={`${
            isPrimary ? "text-sm font-bold" : "text-xs font-semibold"
          } text-gray-900 dark:text-white tabular-nums shrink-0`}
        >
          {confidence.toFixed(1)}%
        </span>
      </div>
      <div
        className={`w-full ${isPrimary ? "h-3" : "h-2"} ${getBgColor()} rounded-full overflow-hidden`}
      >
        <motion.div
          className={`h-full ${getColor()} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(confidence, 1)}%` }}
          transition={{ delay: delay + 0.2, duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  );
}
