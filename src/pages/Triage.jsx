import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";
import Btn from "../components/Btn";
import Badge from "../components/Badge";
import { analyzeSymptoms, ALL_SYMPTOMS } from "../utils/triageEngine";

const riskColors = { HIGH: "from-red-500 to-rose-500", MEDIUM: "from-amber-400 to-orange-400", LOW: "from-green-400 to-emerald-400" };

export default function Triage() {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [listening, setListening] = useState(false);

  const toggle = (s) => setSelected((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);

  const analyze = () => setResult(analyzeSymptoms(selected));

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = "en-IN";
    r.onstart = () => setListening(true);
    r.onresult = (e) => {
      const text = e.results[0][0].transcript.toLowerCase();
      const matched = ALL_SYMPTOMS.filter((s) => text.includes(s.toLowerCase()));
      if (matched.length) setSelected((p) => [...new Set([...p, ...matched])]);
      setListening(false);
    };
    r.onerror = () => setListening(false);
    r.onend = () => setListening(false);
    r.start();
  };

  return (
    <Layout>
      <PageHeader title="Symptom Checker" subtitle="AI-powered offline triage" emoji="🩺" />

      <GlassCard className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700">Select your symptoms</p>
          <motion.button
            whileTap={{ scale: 0.9 }}
            animate={listening ? { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 0.8 } } : {}}
            onClick={startVoice}
            className={`w-9 h-9 rounded-2xl flex items-center justify-center text-base ${listening ? "bg-rose-500 text-white" : "bg-rose-100 text-rose-500"}`}
          >
            🎤
          </motion.button>
        </div>
        <div className="flex flex-wrap gap-2">
          {ALL_SYMPTOMS.map((s) => (
            <motion.button
              key={s}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggle(s)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-medium transition-all ${
                selected.includes(s)
                  ? "bg-rose-500 text-white shadow-card"
                  : "glass text-gray-600 border border-white/60"
              }`}
            >
              {s}
            </motion.button>
          ))}
        </div>
      </GlassCard>

      <Btn onClick={analyze} disabled={selected.length === 0}>
        🔍 Analyze Risk ({selected.length} symptoms)
      </Btn>

      <AnimatePresence>
        {result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-4 bg-gradient-to-br ${riskColors[result.level]} rounded-3xl p-5 text-white shadow-glass`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl">{result.icon}</span>
              <div>
                <p className="text-xs opacity-80 font-medium">Risk Level</p>
                <p className="text-2xl font-bold">{result.level}</p>
              </div>
            </div>
            <div className="bg-white/20 rounded-2xl p-3 mb-2">
              <p className="text-xs font-semibold opacity-80 mb-1">WHY THIS RESULT</p>
              <p className="text-sm">{result.reason}</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-3">
              <p className="text-xs font-semibold opacity-80 mb-1">RECOMMENDED ACTION</p>
              <p className="text-sm font-medium">{result.action}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Health Worker Mode note */}
      <GlassCard className="mt-4">
        <p className="text-xs text-gray-500">
          <span className="font-semibold text-rose-500">👩‍⚕️ Health Worker Mode:</span> Switch in Settings to manage multiple patients.
        </p>
      </GlassCard>
    </Layout>
  );
}
