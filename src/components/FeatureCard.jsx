import { motion } from "framer-motion";

export default function FeatureCard({ icon, title, color = "from-rose-400 to-pink-400", onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`bg-gradient-to-br ${color} rounded-3xl p-4 text-white shadow-card flex items-center gap-3 w-full`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-sm font-semibold text-left">{title}</span>
    </motion.button>
  );
}
