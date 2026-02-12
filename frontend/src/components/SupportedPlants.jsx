import { motion } from "framer-motion";

const plants = [
  { name: "Apple", emoji: "\ud83c\udf4e" },
  { name: "Blueberry", emoji: "\ud83e\uded0" },
  { name: "Cherry", emoji: "\ud83c\udf52" },
  { name: "Corn", emoji: "\ud83c\udf3d" },
  { name: "Grape", emoji: "\ud83c\udf47" },
  { name: "Orange", emoji: "\ud83c\udf4a" },
  { name: "Peach", emoji: "\ud83c\udf51" },
  { name: "Pepper", emoji: "\ud83c\udf36\ufe0f" },
  { name: "Potato", emoji: "\ud83e\udd54" },
  { name: "Raspberry", emoji: "\ud83e\udd6c" },
  { name: "Soybean", emoji: "\ud83c\udf31" },
  { name: "Squash", emoji: "\ud83c\udf83" },
  { name: "Strawberry", emoji: "\ud83c\udf53" },
  { name: "Tomato", emoji: "\ud83c\udf45" },
];

export default function SupportedPlants() {
  return (
    <div className="mt-12">
      <div className="text-center mb-5">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Supported Crops</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          14 plant species with 38 disease categories
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
        {plants.map((plant, idx) => (
          <motion.div
            key={plant.name}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.03, duration: 0.3 }}
            className="flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-full px-3 py-1.5 text-sm shadow-sm hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700 transition-all"
          >
            <span className="text-base">{plant.emoji}</span>
            <span className="text-gray-700 dark:text-slate-300 font-medium">{plant.name}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
