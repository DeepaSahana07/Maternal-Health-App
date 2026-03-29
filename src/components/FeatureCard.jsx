import { motion } from "framer-motion";

export default function FeatureCard({ icon, title, red, onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
      className={`p-5 rounded-2xl shadow flex flex-col items-center justify-center cursor-pointer ${
        red ? "bg-red-400 text-white" : "bg-white"
      }`}
    >
      <div className="text-2xl mb-2">{ icon }</div>
      <p className="text-sm font-medium">{ title }</p>
    </motion.div>
  );
}