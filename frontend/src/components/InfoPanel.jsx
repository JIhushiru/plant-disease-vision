import { motion } from "framer-motion";
import { Cpu, Database, Microscope, Layers, ArrowLeft } from "lucide-react";

const features = [
  {
    icon: Microscope,
    title: "38 Disease Classes",
    description:
      "Identifies diseases across 14 plant species using the PlantVillage dataset",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    icon: Cpu,
    title: "EfficientNet-B0",
    description:
      "Transfer learning with ImageNet-pretrained backbone for high accuracy",
    color: "bg-violet-50 text-violet-600 border-violet-100",
  },
  {
    icon: Database,
    title: "54,000+ Images",
    description:
      "Trained on an extensive dataset of labeled crop disease photographs",
    color: "bg-amber-50 text-amber-600 border-amber-100",
  },
  {
    icon: Layers,
    title: "Detailed Reports",
    description:
      "Returns causes, symptoms, and treatment options for every diagnosis",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
];

export default function InfoPanel() {
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-gray-400"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">
          Upload an image to get started
        </span>
      </motion.div>

      <div className="grid grid-cols-1 gap-3">
        {features.map((feature, idx) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + idx * 0.08, duration: 0.4 }}
            className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md hover:border-gray-200 transition-all"
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${feature.color}`}
              >
                <feature.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
