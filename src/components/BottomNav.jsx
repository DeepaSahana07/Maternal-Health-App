import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const tabs = [
  { path: "/", icon: "🏠", label: "Home" },
  { path: "/health", icon: "💗", label: "Health" },
  { path: "/plan", icon: "📅", label: "Plan" },
  { path: "/journal", icon: "📷", label: "Journal" },
  { path: "/settings", icon: "⚙️", label: "More" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] glass border-t border-white/60 z-50">
      <div className="flex justify-around items-center py-2 px-2">
        {tabs.map((tab) => {
          const active = pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 relative"
            >
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-rose-100 rounded-2xl"
                />
              )}
              <span className="text-xl relative z-10">{tab.icon}</span>
              <span className={`text-[10px] font-medium relative z-10 ${active ? "text-rose-500" : "text-gray-400"}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
