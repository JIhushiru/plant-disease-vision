import { motion } from "framer-motion";
import {
  ShieldCheck,
  ShieldAlert,
  Bug,
  Stethoscope,
  Pill,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import ConfidenceBar from "./ConfidenceBar";
import RejectionCard from "./RejectionCard";

function DiseaseDetail({ icon: Icon, title, content, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex gap-3"
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <h4 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-0.5">
          {title}
        </h4>
        <p className="text-sm text-gray-700 dark:text-slate-300 leading-relaxed">{content}</p>
      </div>
    </motion.div>
  );
}

export default function ResultCard({ result }) {
  const [showAlternatives, setShowAlternatives] = useState(false);

  if (!result) return null;
  if (result.rejected) return <RejectionCard reason={result.reason} />;

  const { prediction, alternatives } = result;
  const { plant, condition, confidence, is_healthy, info } = prediction;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-3"
    >
      {/* Status badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4 text-primary-500" />
        <span className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
          Analysis Complete
        </span>
      </motion.div>

      {/* Main prediction */}
      <div
        className={`rounded-2xl p-5 sm:p-6 border-2 transition-colors ${
          is_healthy
            ? "bg-linear-to-br from-primary-50/80 to-primary-100/40 border-primary-200 dark:from-primary-900/20 dark:to-primary-800/10 dark:border-primary-700"
            : "bg-linear-to-br from-danger-50/80 to-danger-100/40 border-danger-200 dark:from-danger-900/20 dark:to-danger-800/10 dark:border-danger-700"
        }`}
      >
        <div className="flex items-start gap-3 mb-5">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
              is_healthy
                ? "bg-primary-500 text-white"
                : "bg-danger-500 text-white"
            }`}
          >
            {is_healthy ? (
              <ShieldCheck className="w-6 h-6" />
            ) : (
              <ShieldAlert className="w-6 h-6" />
            )}
          </motion.div>
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              {condition}
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 mt-0.5">{plant}</p>
          </div>
        </div>

        <ConfidenceBar
          label="Confidence"
          confidence={confidence}
          isHealthy={is_healthy}
          isPrimary
        />
      </div>

      {/* Disease details */}
      {!is_healthy && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 sm:p-6 space-y-4 shadow-sm"
        >
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Disease Information
          </h3>
          <div className="space-y-4">
            <DiseaseDetail
              icon={Bug}
              title="Cause"
              content={info.cause}
              color="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
              delay={0.4}
            />
            <DiseaseDetail
              icon={Stethoscope}
              title="Symptoms"
              content={info.symptoms}
              color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              delay={0.5}
            />
            <DiseaseDetail
              icon={Pill}
              title="Recommended Treatment"
              content={info.treatment}
              color="bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400"
              delay={0.6}
            />
          </div>
        </motion.div>
      )}

      {is_healthy && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 sm:p-6 shadow-sm"
        >
          <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-3">
            Maintenance Tips
          </h3>
          <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
            {info.treatment}
          </p>
        </motion.div>
      )}

      {/* Alternative predictions */}
      {alternatives && alternatives.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden"
        >
          <button
            onClick={() => setShowAlternatives(!showAlternatives)}
            className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <span className="text-sm font-semibold text-gray-600 dark:text-slate-300">
              Other possible diagnoses
            </span>
            <motion.div
              animate={{ rotate: showAlternatives ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-gray-400 dark:text-slate-500" />
            </motion.div>
          </button>

          <motion.div
            initial={false}
            animate={{
              height: showAlternatives ? "auto" : 0,
              opacity: showAlternatives ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-3">
              {alternatives.map((alt, idx) => (
                <ConfidenceBar
                  key={alt.class_name}
                  label={`${alt.plant} — ${alt.condition}`}
                  confidence={alt.confidence}
                  isHealthy={alt.is_healthy}
                  delay={idx * 0.08}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}
