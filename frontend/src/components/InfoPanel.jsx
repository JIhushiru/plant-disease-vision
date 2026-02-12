import { motion } from "framer-motion";
import { Cpu, Database, Microscope, Layers } from "lucide-react";

const features = [
  {
    icon: Microscope,
    title: "38 Disease Classes",
    description: "Identifies diseases across 14 plant species using the PlantVillage dataset",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Cpu,
    title: "EfficientNet-B0",
    description: "Transfer learning with ImageNet-pretrained backbone for high accuracy",
    color: "bg-violet-100 text-violet-600",
  },
  {
    icon: Database,
    title: "54,000+ Images",
    description: "Trained on an extensive dataset of labeled crop disease photographs",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: Layers,
    title: "Detailed Reports",
    description: "Returns causes, symptoms, and treatment options for every diagnosis",
    color: "bg-emerald-100 text-emerald-600",
  },
];

export default function InfoPanel() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {features.map((feature, idx) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1, duration: 0.4 }}
          className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${feature.color}`}
            >
              <feature.icon className="w-4.5 h-4.5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900">
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
  );
}
