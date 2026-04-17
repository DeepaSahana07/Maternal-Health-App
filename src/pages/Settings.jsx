import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  FiSettings, FiUser, FiGlobe, FiShield, FiInfo,
  FiTrash2, FiSave, FiKey, FiCamera,
} from "react-icons/fi";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";
import Btn from "../components/Btn";
import { load, save, KEYS } from "../utils/storage";
import { LANGUAGES, t } from "../utils/i18n";

const inp = "w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 outline-none focus:ring-2 focus:ring-rose-300 transition mb-3";

export default function Settings() {
  const lang = load(KEYS.LANG, "en");
  const [profile, setProfile] = useState(() => load(KEYS.PROFILE, {}));
  const [selectedLang, setSelectedLang] = useState(() => load(KEYS.LANG, "en"));
  const [workerMode, setWorkerMode] = useState(() => load(KEYS.MODE, false));
  const [saved, setSaved] = useState(false);
  const photoRef = useRef();

  const set = (k) => (e) => setProfile((p) => ({ ...p, [k]: e.target.value }));

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setProfile((p) => ({ ...p, photo: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    save(KEYS.PROFILE, profile);
    save(KEYS.LANG, selectedLang);
    save(KEYS.MODE, workerMode);
    setSaved(true);
    setTimeout(() => { setSaved(false); window.location.reload(); }, 1500);
  };

  const clearAll = () => {
    if (window.confirm("Clear all data? This cannot be undone.")) {
      Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
      localStorage.removeItem("mh_users");
      window.location.href = "/";
    }
  };

  return (
    <Layout>
      <PageHeader title={t(lang, "settings")} subtitle="Personalize your experience" icon={FiSettings} />

      {/* Profile Photo */}
      <GlassCard className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <FiCamera className="text-rose-400" />
          <p className="text-xs font-semibold text-gray-500">{t(lang, "profilePhoto")}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-rose-100 flex items-center justify-center flex-shrink-0">
            {profile.photo
              ? <img src={profile.photo} alt="" className="w-full h-full object-cover" />
              : <FiUser className="text-rose-300 text-2xl" />}
          </div>
          <div className="flex-1">
            <input ref={photoRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            <button onClick={() => photoRef.current.click()}
              className="text-xs text-rose-500 font-semibold bg-rose-50 px-4 py-2 rounded-xl">
              {t(lang, "changePhoto")}
            </button>
          </div>
        </div>
      </GlassCard>

      {/* Profile Fields */}
      <GlassCard className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <FiUser className="text-rose-400" />
          <p className="text-xs font-semibold text-gray-500">{t(lang, "profile")}</p>
        </div>
        <input className={inp} placeholder={t(lang, "yourName")} value={profile.name || ""} onChange={set("name")} />
        <input className={inp} type="number" placeholder={t(lang, "age")} value={profile.age || ""} onChange={set("age")} />
        <input className={inp} type="number" placeholder={`${t(lang, "pregnancyMonth")} (1–9)`} min="1" max="9" value={profile.month || ""} onChange={(e) => {
          const m = parseInt(e.target.value) || "";
          setProfile((p) => ({ ...p, month: m, week: m ? m * 4 : p.week }));
        }} />
        <input className={inp} placeholder={`${t(lang, "bp")} (e.g. 120/80)`} value={profile.bp || ""} onChange={set("bp")} />
        <input className={inp} placeholder={`${t(lang, "weight")} (kg)`} value={profile.weight || ""} onChange={set("weight")} />
      </GlassCard>

      {/* Language */}
      <GlassCard className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <FiGlobe className="text-rose-400" />
          <p className="text-xs font-semibold text-gray-500">{t(lang, "language")}</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {LANGUAGES.map((l) => (
            <button key={l.code} onClick={() => setSelectedLang(l.code)}
              className={`py-2 rounded-2xl text-xs font-medium transition text-center ${selectedLang === l.code ? "bg-rose-500 text-white shadow-card" : "glass text-gray-500"}`}>
              <span className="block text-base">{l.flag}</span>
              <span>{l.native}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">Powered by Sarvam AI</p>
      </GlassCard>

      {/* Health Worker Mode */}
      <GlassCard className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiShield className="text-rose-400" />
            <div>
              <p className="text-sm font-semibold text-gray-700">{t(lang, "workerMode")}</p>
              <p className="text-xs text-gray-400">{t(lang, "workerModeDesc")}</p>
            </div>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setWorkerMode(!workerMode)}
            className={`w-12 h-6 rounded-full transition-colors relative ${workerMode ? "bg-rose-500" : "bg-gray-200"}`}>
            <motion.div animate={{ x: workerMode ? 24 : 2 }} className="absolute top-1 w-4 h-4 bg-white rounded-full shadow" />
          </motion.button>
        </div>
      </GlassCard>


      <Btn onClick={saveProfile} className="mb-3" icon={FiSave}>
        {saved ? t(lang, "saved") : t(lang, "saveSettings")}
      </Btn>
      <Btn variant="secondary" onClick={clearAll} icon={FiTrash2}>
        {t(lang, "clearData")}
      </Btn>
    </Layout>
  );
}
