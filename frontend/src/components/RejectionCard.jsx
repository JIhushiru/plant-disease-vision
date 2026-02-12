import { motion } from "framer-motion";
import { Leaf, Camera, Sun, Focus } from "lucide-react";

const tips = [
  { icon: Leaf, text: "Use a clear photo of a single plant leaf" },
  { icon: Focus, text: "Focus closely on the leaf surface" },
  { icon: Sun, text: "Ensure good, even lighting" },
  { icon: Camera, text: "Avoid blurry or distant shots" },
];

export default function RejectionCard({ reason }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-3"
    >
      <div className="bg-linear-to-br from-warning-50/80 to-warning-100/40 border-2 border-warning-200 rounded-2xl p-5 sm:p-6">
        <div className="flex items-start gap-3 mb-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-warning-500 text-white shadow-sm"
          >
            <Leaf className="w-6 h-6" />
          </motion.div>
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              Not a Plant Leaf
            </h3>
            <p className="text-sm text-gray-500 mt-1">{reason}</p>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm"
      >
        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">
          Tips for Best Results
        </h3>
        <div className="space-y-3">
          {tips.map(({ icon: Icon, text }, idx) => (
            <motion.div
              key={text}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.1, duration: 0.4 }}
              className="flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-warning-100 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-warning-600" />
              </div>
              <p className="text-sm text-gray-700">{text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
