import { useEffect, useState } from "react";
import BottomNav from "./BottomNav";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout({ children, noNav = false }) {
  const [syncMsg, setSyncMsg] = useState("");

  useEffect(() => {
    const handleOnline = () => {
      setSyncMsg("syncing");
      setTimeout(() => setSyncMsg("synced"), 1800);
      setTimeout(() => setSyncMsg(""), 4000);
    };
    const handleOffline = () => setSyncMsg("offline");
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="min-h-dvh pb-24 px-4 pt-4 relative">
      <AnimatePresence>
        {syncMsg && (
          <motion.div
            key={syncMsg}
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full text-xs font-medium shadow-lg text-white ${
              syncMsg === "offline" ? "bg-gray-500" : syncMsg === "syncing" ? "bg-amber-400" : "bg-green-500"
            }`}
          >
            {syncMsg === "offline" ? "📵 You're offline" : syncMsg === "syncing" ? "🔄 Syncing..." : "✓ All data synced"}
          </motion.div>
        )}
      </AnimatePresence>
      {children}
      {!noNav && <BottomNav />}
    </div>
  );
}
