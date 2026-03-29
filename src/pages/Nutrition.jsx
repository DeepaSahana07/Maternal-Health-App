import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";

const categories = [
  {
    key: "Iron", emoji: "🩸", color: "from-red-400 to-rose-400",
    foods: [
      { name: "Moringa (Drumstick)", benefit: "25x more iron than spinach. Boosts hemoglobin.", emoji: "🌿" },
      { name: "Spinach", benefit: "Rich in iron & folate. Prevents anemia.", emoji: "🥬" },
      { name: "Dates", benefit: "Natural iron source. Aids labor preparation.", emoji: "🫘" },
    ],
  },
  {
    key: "Calcium", emoji: "🦴", color: "from-blue-400 to-sky-400",
    foods: [
      { name: "Ragi (Finger Millet)", benefit: "Highest calcium among cereals. Strengthens bones.", emoji: "🌾" },
      { name: "Sesame Seeds", benefit: "Rich in calcium & healthy fats.", emoji: "🫙" },
      { name: "Milk & Curd", benefit: "Complete calcium source for baby's bone development.", emoji: "🥛" },
    ],
  },
  {
    key: "Energy", emoji: "⚡", color: "from-amber-400 to-yellow-400",
    foods: [
      { name: "Jaggery (Gur)", benefit: "Natural iron + energy. Better than refined sugar.", emoji: "🍯" },
      { name: "Banana", benefit: "Instant energy, potassium, reduces cramps.", emoji: "🍌" },
      { name: "Sweet Potato", benefit: "Beta-carotene, fiber, sustained energy.", emoji: "🍠" },
    ],
  },
  {
    key: "Protein", emoji: "💪", color: "from-green-400 to-emerald-400",
    foods: [
      { name: "Lentils (Dal)", benefit: "Complete protein + folate for neural development.", emoji: "🫘" },
      { name: "Eggs", benefit: "Choline for brain development.", emoji: "🥚" },
      { name: "Groundnuts", benefit: "Protein + healthy fats + folate.", emoji: "🥜" },
    ],
  },
];

export default function Nutrition() {
  const [active, setActive] = useState(null);

  return (
    <Layout>
      <PageHeader title="Nutrition Guide" subtitle="Localized foods for healthy pregnancy" emoji="🥗" />

      <div className="grid grid-cols-2 gap-3 mb-4">
        {categories.map((c, i) => (
          <motion.button
            key={c.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActive(active?.key === c.key ? null : c)}
            className={`bg-gradient-to-br ${c.color} rounded-3xl p-4 text-white shadow-card text-left`}
          >
            <span className="text-3xl block mb-1">{c.emoji}</span>
            <p className="font-semibold text-sm">{c.key}</p>
            <p className="text-xs opacity-80">{c.foods.length} foods</p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            key={active.key}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">{active.emoji} {active.key}-Rich Foods</p>
            <div className="space-y-3 mb-4">
              {active.foods.map((f, i) => (
                <GlassCard key={i} delay={i * 0.06}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{f.emoji}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{f.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{f.benefit}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated Explainer */}
      <GlassCard>
        <p className="text-xs font-semibold text-gray-500 mb-2">💡 Did You Know?</p>
        <p className="text-sm text-gray-600">
          Ragi has <span className="font-bold text-rose-500">344mg calcium per 100g</span> — more than milk! It's a superfood for pregnant women in South Asia.
        </p>
      </GlassCard>
    </Layout>
  );
}
