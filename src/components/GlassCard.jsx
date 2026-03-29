import { motion } from "framer-motion";

export default function GlassCard({ children, className = "", onClick, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileTap={onClick ? { scale: 0.97 } : {}}
      onClick={onClick}
      className={`glass rounded-3xl shadow-card p-4 ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {children}
    </motion.div>
  );
}
