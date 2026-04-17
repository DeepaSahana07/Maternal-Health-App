import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronLeft } from "react-icons/fi";

export default function PageHeader({ title, subtitle, icon: Icon, emoji }) {
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 mb-6 pt-2"
    >
      <button
        onClick={() => navigate(-1)}
        className="w-9 h-9 glass rounded-2xl flex items-center justify-center text-rose-500 shadow-card"
      >
        <FiChevronLeft className="text-lg" />
      </button>
      <div className="flex items-center gap-2 flex-1">
        {Icon && (
          <div className="w-8 h-8 bg-rose-100 rounded-xl flex items-center justify-center">
            <Icon className="text-rose-500 text-sm" />
          </div>
        )}
        {emoji && !Icon && <span className="text-xl">{emoji}</span>}
        <div>
          <h1 className="text-lg font-semibold text-gray-800 leading-tight">{title}</h1>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
      </div>
    </motion.div>
  );
}
