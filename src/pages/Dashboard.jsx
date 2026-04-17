import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiActivity, FiAlertOctagon, FiShoppingBag, FiHeart,
  FiUsers, FiCamera, FiCalendar, FiFileText, FiPackage,
  FiMic, FiSettings, FiBell, FiMapPin, FiUpload, FiVideo,
  FiMessageCircle,
} from "react-icons/fi";
import Layout from "../components/Layout";
import GlassCard from "../components/GlassCard";
import { load, save, KEYS } from "../utils/storage";
import { t } from "../utils/i18n";
import { speakText, LANG_CODES } from "../utils/sarvamAI";

const FEATURES = [
  { icon: FiActivity, label: "triage", path: "/triage", color: "from-rose-400 to-pink-400" },
  { icon: FiAlertOctagon, label: "sos", path: "/sos", color: "from-red-500 to-rose-500" },
  { icon: FiShoppingBag, label: "nutrition", path: "/nutrition", color: "from-green-400 to-emerald-400" },
  { icon: FiHeart, label: "health", path: "/health", color: "from-pink-400 to-fuchsia-400" },
  { icon: FiUsers, label: "family", path: "/family", color: "from-purple-400 to-violet-400" },
  { icon: FiCamera, label: "journal", path: "/journal", color: "from-amber-400 to-orange-400" },
  { icon: FiCalendar, label: "calendarTitle", path: "/calendar", color: "from-sky-400 to-blue-400" },
  { icon: FiFileText, label: "records", path: "/records", color: "from-teal-400 to-cyan-400" },
  { icon: FiPackage, label: "kit", path: "/kit", color: "from-indigo-400 to-purple-400" },
  { icon: FiVideo, label: "videoTitle", path: "/video", color: "from-violet-400 to-purple-500" },
  { icon: FiMessageCircle, label: "assistant", path: "/assistant", color: "from-rose-400 to-fuchsia-400" },
  { icon: FiCalendar, label: "plan", path: "/plan", color: "from-orange-400 to-amber-400" },
];

// Baby size descriptions by week
const BABY_SIZE = {
  4: "poppy seed", 8: "raspberry", 12: "lime", 16: "avocado",
  20: "banana", 24: "ear of corn", 28: "eggplant", 32: "squash",
  36: "honeydew melon", 40: "watermelon",
};
const getBabySize = (week) => {
  const keys = Object.keys(BABY_SIZE).map(Number).sort((a, b) => a - b);
  const closest = keys.reduce((prev, curr) => (Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev));
  return BABY_SIZE[closest];
};

export default function Dashboard() {
  const navigate = useNavigate();
  const lang = load(KEYS.LANG, "en");
  const [profile, setProfile] = useState(() => load(KEYS.PROFILE, {}));
  const [scan, setScan] = useState(() => load(KEYS.SCAN, null));
  const [reminder, setReminder] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const week = scan?.week || profile.week || 0;
  const month = scan?.month || profile.month || 0;
  const trimester = week <= 12 ? "1st Trimester" : week <= 27 ? "2nd Trimester" : "3rd Trimester";
  const weeksLeft = week > 0 ? Math.max(0, 40 - week) : null;

  const REMINDERS = [
    t(lang, "reminderIron"),
    t(lang, "reminderWater"),
    t(lang, "reminderStretch"),
    t(lang, "reminderBP"),
  ];

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setReminder(REMINDERS[i % REMINDERS.length]);
      i++;
      setTimeout(() => setReminder(""), 5000);
    }, 25000);
    return () => clearInterval(iv);
  }, [lang]);

  // Simulate scan report extraction
  const handleScanUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setTimeout(() => {
      // Simulate extracted data from scan
      const extracted = {
        week: profile.week || 24,
        month: profile.month || 6,
        bp: "120/80",
        weight: "65",
        fetalWeight: `${Math.round((profile.week || 24) * 12 + Math.random() * 50)}g`,
        fileName: file.name,
        date: new Date().toLocaleDateString(),
      };
      setScan(extracted);
      save(KEYS.SCAN, extracted);
      // Update profile week from scan
      const updatedProfile = { ...profile, week: extracted.week, month: extracted.month };
      setProfile(updatedProfile);
      save(KEYS.PROFILE, updatedProfile);
      setUploading(false);
    }, 1500);
  };

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { navigate("/assistant"); return; }
    const r = new SR();
    r.lang = LANG_CODES[lang] || "en-IN";
    r.onstart = () => setListening(true);
    r.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setVoiceText(text);
      setListening(false);
    };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    r.start();
  };

  return (
    <Layout>
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <p className="text-xs text-gray-400 font-medium">{t(lang, "goodMorning")}</p>
          <h1 className="text-xl font-bold text-gray-800">
            {profile.name ? `${t(lang, "hello")}, ${profile.name}!` : t(lang, "welcome")}
          </h1>
        </div>
        <button onClick={() => navigate("/settings")} className="w-10 h-10 glass rounded-2xl flex items-center justify-center shadow-card">
          <FiSettings className="text-gray-500 text-lg" />
        </button>
      </div>

      {/* Hero Card — only shows real data */}
      {week > 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-gradient-to-br from-rose-400 via-pink-400 to-fuchsia-400 rounded-3xl p-5 text-white shadow-glass mb-4 overflow-hidden"
        >
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />
          <div className="absolute -right-2 bottom-2 w-20 h-20 bg-white/10 rounded-full" />
          <p className="text-xs font-medium opacity-80 mb-1">{trimester} · {t(lang, "pregnancyTimeline")}</p>
          <div className="flex items-end gap-2">
            <span className="text-6xl font-bold">{week}</span>
            <span className="text-lg mb-2 opacity-90">{t(lang, "weeks")}</span>
          </div>
          <p className="text-xs opacity-75 mt-1">
            {t(lang, "babySize")}: {getBabySize(week)}
          </p>
          <div className="mt-3 flex gap-2 flex-wrap">
            <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">~{week * 7} {t(lang, "days")}</span>
            {weeksLeft !== null && <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">{weeksLeft} {t(lang, "weeksLeft")}</span>}
            {month > 0 && <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">{t(lang, "month")} {month}</span>}
          </div>
        </motion.div>
      ) : (
        <GlassCard className="mb-4">
          <p className="text-sm text-gray-500 text-center">{t(lang, "noDataYet")}</p>
          <p className="text-xs text-gray-400 text-center mt-1">{t(lang, "uploadScanOrSetup")}</p>
        </GlassCard>
      )}

        <div className="flex gap-3 mb-5">
          {[
            { label: t(lang, "babyWeight"), value: scan?.fetalWeight || "0g" },
          ].map((s, i) => (
            <GlassCard key={i} delay={i * 0.05} className="flex-1 text-center py-3">
              <p className="text-[10px] text-gray-400 font-medium">{s.label}</p>
              <p className="text-base font-bold text-gray-800">{s.value}</p>
            </GlassCard>
          ))}
        </div>

      {/* Scan Upload */}
      <GlassCard className="mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-700">{t(lang, "uploadScan")}</p>
            <p className="text-xs text-gray-400">
              {scan ? `${scan.fileName} · ${scan.date}` : t(lang, "uploadScanDesc")}
            </p>
          </div>
          <input ref={fileRef} type="file" accept="image/*,.pdf" onChange={handleScanUpload} className="hidden" />
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => fileRef.current.click()}
            disabled={uploading}
            className="bg-rose-500 text-white px-3 py-2 rounded-2xl text-xs font-semibold flex items-center gap-1.5 shadow-card"
          >
            <FiUpload className="text-sm" />
            {uploading ? t(lang, "processing") : t(lang, "upload")}
          </motion.button>
        </div>
        {scan && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              { label: "BP", value: scan.bp },
              { label: t(lang, "weight"), value: `${scan.weight} kg` },
            ].map((item, i) => (
              <div key={i} className="bg-rose-50 rounded-2xl px-3 py-2">
                <p className="text-[10px] text-gray-400">{item.label}</p>
                <p className="text-sm font-bold text-rose-600">{item.value}</p>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      {/* Reminder Banner */}
      <AnimatePresence>
        {reminder && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="glass-dark rounded-2xl px-4 py-3 mb-4 flex items-center gap-2"
          >
            <FiBell className="text-rose-500 flex-shrink-0" />
            <p className="text-sm font-medium text-rose-700">{reminder}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Companion */}
      <GlassCard className="mb-5">
        <p className="text-xs font-semibold text-gray-500 mb-2">{t(lang, "voiceCompanion")}</p>
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            animate={listening ? { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 0.8 } } : {}}
            onClick={startVoice}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-card ${listening ? "bg-rose-500 text-white" : "bg-rose-100 text-rose-500"}`}
          >
            <FiMic className="text-xl" />
          </motion.button>
          <div className="flex-1">
            <p className="text-xs text-gray-400">{listening ? t(lang, "listening") : t(lang, "tapToSpeak")}</p>
            {voiceText && <p className="text-sm font-medium text-gray-700 mt-0.5">"{voiceText}"</p>}
          </div>
          <button onClick={() => navigate("/assistant")} className="text-xs text-rose-500 font-semibold bg-rose-50 px-3 py-1.5 rounded-xl">
            {t(lang, "fullAI")} →
          </button>
        </div>
      </GlassCard>

      {/* Feature Grid */}
      <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">{t(lang, "quickAccess")}</p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {FEATURES.map((f, i) => (
          <motion.button
            key={f.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { navigate(f.path); }}
            className={`bg-gradient-to-br ${f.color} rounded-3xl p-4 text-white shadow-card flex items-center gap-3`}
          >
            <f.icon className="text-2xl flex-shrink-0" />
            <span className="text-sm font-semibold text-left leading-tight">{t(lang, f.label)}</span>
          </motion.button>
        ))}
      </div>

      {/* Hospital */}
      <GlassCard className="mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-rose-100 rounded-2xl flex items-center justify-center">
              <FiMapPin className="text-rose-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">{t(lang, "findHospital")}</p>
              <p className="text-xs text-gray-400">{t(lang, "transportIntelligence")}</p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open("https://www.google.com/maps/search/hospital+near+me")}
            className="bg-rose-500 text-white px-4 py-2 rounded-2xl text-xs font-semibold shadow-card"
          >
            {t(lang, "openMaps")}
          </motion.button>
        </div>
      </GlassCard>
    </Layout>
  );
}
