import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";
import Input from "../components/Input";
import Btn from "../components/Btn";
import { load, save, KEYS } from "../utils/storage";

export default function Settings() {
  const [profile, setProfile] = useState(() => load(KEYS.PROFILE, { name: "Mummy", week: 24 }));
  const [lang, setLang] = useState(() => load(KEYS.LANG, "en"));
  const [workerMode, setWorkerMode] = useState(() => load(KEYS.MODE, false));
  const [saved, setSaved] = useState(false);

  const saveProfile = () => {
    save(KEYS.PROFILE, profile);
    save(KEYS.LANG, lang);
    save(KEYS.MODE, workerMode);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clearAll = () => {
    if (window.confirm("Clear all data? This cannot be undone.")) {
      Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
      window.location.reload();
    }
  };

  return (
    <Layout>
      <PageHeader title="Settings" subtitle="Personalize your experience" emoji="⚙️" />

      {/* Profile */}
      <GlassCard className="mb-4">
        <p className="text-xs font-semibold text-gray-500 mb-3">👤 Profile</p>
        <Input label="Your Name" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
        <Input label="Pregnancy Week (1-40)" type="number" min="1" max="40"
          value={profile.week} onChange={(e) => setProfile({ ...profile, week: parseInt(e.target.value) || 1 })} />
      </GlassCard>

      {/* Language */}
      <GlassCard className="mb-4">
        <p className="text-xs font-semibold text-gray-500 mb-3">🌐 Language</p>
        <div className="flex gap-3">
          {[["en", "English 🇬🇧"], ["hi", "हिंदी 🇮🇳"]].map(([code, label]) => (
            <button key={code} onClick={() => setLang(code)}
              className={`flex-1 py-2.5 rounded-2xl text-sm font-medium transition ${lang === code ? "bg-rose-500 text-white shadow-card" : "glass text-gray-500"}`}>
              {label}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* Health Worker Mode */}
      <GlassCard className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-700">👩⚕️ Health Worker Mode</p>
            <p className="text-xs text-gray-400">Manage multiple patients</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setWorkerMode(!workerMode)}
            className={`w-12 h-6 rounded-full transition-colors relative ${workerMode ? "bg-rose-500" : "bg-gray-200"}`}
          >
            <motion.div
              animate={{ x: workerMode ? 24 : 2 }}
              className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
            />
          </motion.button>
        </div>
        {workerMode && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="mt-3 bg-rose-50 rounded-2xl p-3">
            <p className="text-xs text-rose-600 font-medium">Health Worker Mode Active</p>
            <p className="text-xs text-gray-500 mt-0.5">You can now manage multiple patient profiles from the Family dashboard.</p>
          </motion.div>
        )}
      </GlassCard>

      {/* App Info */}
      <GlassCard className="mb-4">
        <p className="text-xs font-semibold text-gray-500 mb-2">ℹ️ App Info</p>
        <div className="space-y-1 text-xs text-gray-500">
          <p>Version: 1.0.0</p>
          <p>Storage: LocalStorage (Offline-first)</p>
          <p>AI Engine: Rule-based (offline)</p>
          <p>Voice: Web Speech API</p>
        </div>
      </GlassCard>

      <Btn onClick={saveProfile} className="mb-3">
        {saved ? "✓ Saved!" : "Save Settings"}
      </Btn>

      <Btn variant="secondary" onClick={clearAll}>
        🗑️ Clear All Data
      </Btn>
    </Layout>
  );
}
