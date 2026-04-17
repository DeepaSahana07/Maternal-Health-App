import { motion } from "framer-motion";

export default function Btn({ children, onClick, className = "", variant = "primary", disabled = false, icon: Icon }) {
  const base = "w-full py-3.5 rounded-2xl font-semibold text-sm transition shadow-card flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-gradient-to-r from-rose-400 to-pink-500 text-white",
    secondary: "glass text-rose-500 border border-rose-200",
    danger: "bg-gradient-to-r from-red-500 to-rose-600 text-white",
    ghost: "text-rose-400 font-medium",
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${disabled ? "opacity-50" : ""} ${className}`}
    >
      {Icon && <Icon className="text-base" />}
      {children}
    </motion.button>
  );
}
