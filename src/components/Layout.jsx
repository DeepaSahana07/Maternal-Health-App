import { useEffect, useState } from "react";
import BottomNav from "./BottomNav";
import { motion, AnimatePresence } from "framer-motion";
import { FiWifiOff, FiRefreshCw, FiCheck, FiBell, FiX } from "react-icons/fi";
import Chatbot from "./Chatbot";
import { load, KEYS } from "../utils/storage";

export default function Layout({ children, noNav = false }) {
  const [syncMsg, setSyncMsg] = useState("");
  const [dueAlert, setDueAlert] = useState(null);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const loaded = load(KEYS.REMINDERS, []);
      const due = loaded.find((r) => r.time === hhmm && r.active);
      if (due && (!dueAlert || dueAlert.id !== due.id)) setDueAlert(due);
    };
    checkReminders();
    const iv2 = setInterval(checkReminders, 30000);
    return () => clearInterval(iv2);
  }, [dueAlert]);

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

  const bannerConfig = {
    offline: { bg: "bg-gray-500", icon: FiWifiOff, text: "You're offline" },
    syncing: { bg: "bg-amber-400", icon: FiRefreshCw, text: "Syncing..." },
    synced: { bg: "bg-green-500", icon: FiCheck, text: "All data synced" },
  };

  return (
    <div className="app-shell">
      <div className="min-h-dvh pb-24 px-4 pt-4 relative">
        <AnimatePresence>
          {syncMsg && (() => {
            const cfg = bannerConfig[syncMsg];
            return (
              <motion.div
                key={syncMsg}
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-1.5 rounded-full text-xs font-medium shadow-lg text-white flex items-center gap-1.5 ${cfg.bg}`}
              >
                <cfg.icon className={`text-sm ${syncMsg === "syncing" ? "animate-spin" : ""}`} />
                {cfg.text}
              </motion.div>
            );
          })()}
        </AnimatePresence>

        <AnimatePresence>
          {dueAlert && (
            <motion.div
              initial={{ y: -60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -60, opacity: 0 }}
              className="fixed top-12 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl p-4 text-white shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <FiBell className="text-xl" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">Reminder Due!</p>
                  <p className="text-xs opacity-90">{dueAlert.title} · {dueAlert.time}</p>
                </div>
                <button onClick={() => setDueAlert(null)}
                  className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                  <FiX className="text-sm" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {children}
        {!noNav && <BottomNav />}
        <Chatbot />
      </div>
    </div>
  );
}
