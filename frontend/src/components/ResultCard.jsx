import { motion } from "framer-motion";
import {
  ShieldCheck,
  ShieldAlert,
  Bug,
  Stethoscope,
  Pill,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import ConfidenceBar from "./ConfidenceBar";

function DiseaseDetail({ icon: Icon, title, content, color }) {
  return (
    <div className="flex gap-3">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${color}`}
      >
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
          {title}
        </h4>
        <p className="text-sm text-gray-700 leading-relaxed">{content}</p>
      </div>
    </div>
  );
}

export default function ResultCard({ result }) {
  const [showAlternatives, setShowAlternatives] = useState(false);

  if (!result) return null;

  const { prediction, alternatives } = result;
  const { plant, condition, confidence, is_healthy, info } = prediction;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-4"
    >
      {/* Main prediction */}
      <div
        className={`rounded-2xl p-5 sm:p-6 border ${
          is_healthy
            ? "bg-primary-50/50 border-primary-200"
            : "bg-danger-50/50 border-danger-200"
        }`}
      >
        <div className="flex items-start gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              is_healthy
                ? "bg-primary-100 text-primary-700"
                : "bg-danger-100 text-danger-600"
            }`}
          >
            {is_healthy ? (
              <ShieldCheck className="w-5 h-5" />
            ) : (
              <ShieldAlert className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg font-bold text-gray-900">{condition}</h3>
            <p className="text-sm text-gray-500">{plant}</p>
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
          className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 space-y-4 shadow-sm"
        >
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Disease Information
          </h3>
          <DiseaseDetail
            icon={Bug}
            title="Cause"
            content={info.cause}
            color="bg-orange-100 text-orange-600"
          />
          <DiseaseDetail
            icon={Stethoscope}
            title="Symptoms"
            content={info.symptoms}
            color="bg-blue-100 text-blue-600"
          />
          <DiseaseDetail
            icon={Pill}
            title="Treatment"
            content={info.treatment}
            color="bg-violet-100 text-violet-600"
          />
        </motion.div>
      )}

      {is_healthy && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm"
        >
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
            Care Tips
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {info.treatment}
          </p>
        </motion.div>
      )}

      {/* Alternative predictions */}
      {alternatives && alternatives.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <button
            onClick={() => setShowAlternatives(!showAlternatives)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="text-sm font-semibold text-gray-700">
              Other possible diagnoses
            </span>
            {showAlternatives ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
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
            <div className="px-4 pb-4 space-y-3">
              {alternatives.map((alt, idx) => (
                <ConfidenceBar
                  key={alt.class_name}
                  label={`${alt.plant} — ${alt.condition}`}
                  confidence={alt.confidence}
                  isHealthy={alt.is_healthy}
                  delay={idx * 0.1}
                />
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
