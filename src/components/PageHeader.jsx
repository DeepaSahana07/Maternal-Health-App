import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function PageHeader({ title, subtitle, emoji }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 mb-6 pt-2"
    >
      <button
        onClick={() => navigate(-1)}
        className="w-9 h-9 glass rounded-2xl flex items-center justify-center text-rose-500 font-bold shadow-card"
      >
        ‹
      </button>
      <div>
        <h1 className="text-lg font-semibold text-gray-800 leading-tight">
          {emoji && <span className="mr-1">{emoji}</span>}{title}
        </h1>
        {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
      </div>
    </motion.div>
  );
}
