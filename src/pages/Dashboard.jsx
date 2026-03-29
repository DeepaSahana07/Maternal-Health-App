import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import GlassCard from "../components/GlassCard";
import { load, save, KEYS } from "../utils/storage";

const FEATURES = [
  { icon: "🩺", label: "Symptom Check", path: "/triage", color: "from-rose-400 to-pink-400" },
  { icon: "🚨", label: "SOS Emergency", path: "/sos", color: "from-red-500 to-rose-500" },
  { icon: "🥗", label: "Nutrition", path: "/nutrition", color: "from-green-400 to-emerald-400" },
  { icon: "💗", label: "Health Log", path: "/health", color: "from-pink-400 to-fuchsia-400" },
  { icon: "👨‍👩‍👧", label: "Family", path: "/family", color: "from-purple-400 to-violet-400" },
  { icon: "📷", label: "Journal", path: "/journal", color: "from-amber-400 to-orange-400" },
  { icon: "📅", label: "Daily Plan", path: "/plan", color: "from-sky-400 to-blue-400" },
  { icon: "📋", label: "Records", path: "/records", color: "from-teal-400 to-cyan-400" },
  { icon: "🎒", label: "Delivery Kit", path: "/kit", color: "from-indigo-400 to-purple-400" },
  { icon: "🗺️", label: "Risk Map", path: "/riskmap", color: "from-rose-500 to-red-400" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const profile = load(KEYS.PROFILE, { name: "Mummy", week: 24 });
  const [score, setScore] = useState(() => load(KEYS.SCORE, 0));
  const [reminder, setReminder] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const recogRef = useRef(null);

  // Adaptive reminder
  useEffect(() => {
    const msgs = ["💊 Time for your iron tablet!", "💧 Drink a glass of water", "🧘 Take a 5-min stretch break"];
    let i = 0;
    const iv = setInterval(() => {
      setReminder(msgs[i % msgs.length]);
      i++;
      setTimeout(() => setReminder(""), 4000);
    }, 20000);
    return () => clearInterval(iv);
  }, []);

  const addScore = (pts) => {
    const ns = score + pts;
    setScore(ns);
    save(KEYS.SCORE, ns);
  };

  const startVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { alert("Voice not supported in this browser"); return; }
    const r = new SpeechRecognition();
    r.lang = "en-IN";
    r.onstart = () => setListening(true);
    r.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setVoiceText(text);
      setListening(false);
      addScore(5);
    };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    recogRef.current = r;
    r.start();
  };

  const week = profile.week || 24;
  const trimester = week <= 12 ? "1st Trimester" : week <= 27 ? "2nd Trimester" : "3rd Trimester";

  return (
    <Layout>
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <p className="text-xs text-gray-400 font-medium">Good morning 🌸</p>
          <h1 className="text-xl font-bold text-gray-800">Hello, {profile.name}!</h1>
        </div>
        <button onClick={() => navigate("/settings")} className="w-10 h-10 glass rounded-2xl flex items-center justify-center text-lg shadow-card">
          ⚙️
        </button>
      </div>

      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-gradient-to-br from-rose-400 via-pink-400 to-fuchsia-400 rounded-3xl p-5 text-white shadow-glass mb-4 overflow-hidden"
      >
        <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full" />
        <div className="absolute -right-2 bottom-2 w-20 h-20 bg-white/10 rounded-full" />
        <p className="text-xs font-medium opacity-80 mb-1">{trimester} · Pregnancy Timeline</p>
        <div className="flex items-end gap-2">
          <span className="text-6xl font-bold">{week}</span>
          <span className="text-lg mb-2 opacity-90">weeks</span>
        </div>
        <p className="text-xs opacity-75 mt-1">Baby is the size of an ear of corn 🌽</p>
        <div className="mt-3 flex gap-2">
          <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">~{Math.round(week * 7)} days</span>
          <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">{40 - week} weeks left</span>
        </div>
      </motion.div>

      {/* Stats Row */}
      <div className="flex gap-3 mb-5">
        {[
          { label: "Baby Weight", value: `${Math.round(week * 12)}g` },
          { label: "Baby Length", value: `${Math.round(week * 0.7)}cm` },
          { label: "Score 🏆", value: score },
        ].map((s, i) => (
          <GlassCard key={i} delay={i * 0.05} className="flex-1 text-center py-3">
            <p className="text-[10px] text-gray-400 font-medium">{s.label}</p>
            <p className="text-base font-bold text-gray-800">{s.value}</p>
          </GlassCard>
        ))}
      </div>

      {/* Reminder Banner */}
      <AnimatePresence>
        {reminder && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="glass-dark rounded-2xl px-4 py-3 mb-4 text-sm font-medium text-rose-700"
          >
            {reminder}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Companion */}
      <GlassCard className="mb-5">
        <p className="text-xs font-semibold text-gray-500 mb-2">🎙️ Voice Companion</p>
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            animate={listening ? { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 0.8 } } : {}}
            onClick={startVoice}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-card ${listening ? "bg-rose-500 text-white" : "bg-rose-100 text-rose-500"}`}
          >
            🎤
          </motion.button>
          <div className="flex-1">
            <p className="text-xs text-gray-400">{listening ? "Listening..." : "Tap to speak symptoms"}</p>
            {voiceText && <p className="text-sm font-medium text-gray-700 mt-0.5">"{voiceText}"</p>}
          </div>
          {voiceText && (
            <button onClick={() => { navigate("/triage"); }} className="text-xs text-rose-500 font-semibold">Analyze →</button>
          )}
        </div>
      </GlassCard>

      {/* Feature Grid */}
      <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Quick Access</p>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {FEATURES.map((f, i) => (
          <motion.button
            key={f.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { navigate(f.path); addScore(1); }}
            className={`bg-gradient-to-br ${f.color} rounded-3xl p-4 text-white shadow-card flex items-center gap-3`}
          >
            <span className="text-2xl">{f.icon}</span>
            <span className="text-sm font-semibold text-left leading-tight">{f.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Transport */}
      <GlassCard className="mb-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-700">🏥 Find Nearest Hospital</p>
            <p className="text-xs text-gray-400">Transport Intelligence</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => window.open("https://www.google.com/maps/search/hospital+near+me")}
            className="bg-rose-500 text-white px-4 py-2 rounded-2xl text-xs font-semibold shadow-card"
          >
            Open Maps
          </motion.button>
        </div>
      </GlassCard>
    </Layout>
  );
}
