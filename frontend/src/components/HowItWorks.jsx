import { motion } from "framer-motion";
import { Camera, Cpu, FileText } from "lucide-react";

const steps = [
  {
    icon: Camera,
    step: "1",
    title: "Upload",
    description: "Take or upload a clear photo of the affected plant leaf",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Cpu,
    step: "2",
    title: "Analyze",
    description: "Our deep learning model processes the image in real time",
    color: "from-violet-500 to-violet-600",
  },
  {
    icon: FileText,
    step: "3",
    title: "Diagnose",
    description: "Receive a detailed report with treatment recommendations",
    color: "from-primary-500 to-primary-600",
  },
];

export default function HowItWorks() {
  return (
    <div className="mt-16 mb-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-bold text-gray-900">How It Works</h3>
        <p className="text-sm text-gray-500 mt-1">
          Three simple steps to diagnose plant health
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
        {steps.map((step, idx) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15, duration: 0.5 }}
            className="text-center"
          >
            <div className="flex justify-center mb-3">
              <div
                className={`w-14 h-14 rounded-2xl bg-linear-to-br ${step.color} flex items-center justify-center shadow-lg`}
              >
                <step.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
              Step {step.step}
            </div>
            <h4 className="text-base font-bold text-gray-900 mb-1">
              {step.title}
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              {step.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
