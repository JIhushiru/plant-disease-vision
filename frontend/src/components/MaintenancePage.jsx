import { motion } from "framer-motion";
import { Wrench, Leaf, RefreshCw } from "lucide-react";
import Header from "./Header";

export default function MaintenancePage({ dark, onToggleDark }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-primary-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <Header dark={dark} onToggleDark={onToggleDark} />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-amber-100 dark:bg-amber-900/30 mb-8"
          >
            <Wrench className="w-10 h-10 text-amber-600 dark:text-amber-400" />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Under Maintenance
          </h1>

          <p className="text-gray-500 dark:text-slate-400 text-base sm:text-lg leading-relaxed mb-8 max-w-md mx-auto">
            We're upgrading our plant disease detection model to serve you
            better. This won't take long.
          </p>

          <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 mb-8 shadow-sm">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-primary-500" />
                <span>Retraining EfficientNet-B0</span>
              </div>
              <span className="w-1 h-1 bg-gray-300 dark:bg-slate-600 rounded-full"></span>
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <RefreshCw className="w-4 h-4 text-amber-500" />
                </motion.div>
                <span>In progress</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 dark:text-slate-500">
            Check back in a few minutes. The app will be fully operational once
            the new model is deployed.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
