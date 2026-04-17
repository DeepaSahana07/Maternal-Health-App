import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiActivity, FiMic, FiMicOff, FiAlertCircle,
  FiAlertTriangle, FiCheckCircle, FiSearch, FiType,
} from "react-icons/fi";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";
import Btn from "../components/Btn";
import { analyzeSymptoms, ALL_SYMPTOMS } from "../utils/triageEngine";
import { load, KEYS } from "../utils/storage";
import { t } from "../utils/i18n";
import { LANG_CODES } from "../utils/sarvamAI";

const riskGradients = {
  HIGH: "from-red-500 to-rose-500",
  MEDIUM: "from-amber-400 to-orange-400",
  LOW: "from-green-400 to-emerald-400",
};
const RiskIcon = { HIGH: FiAlertCircle, MEDIUM: FiAlertTriangle, LOW: FiCheckCircle };

export default function Triage() {
  const lang = load(KEYS.LANG, "en");
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [textInput, setTextInput] = useState("");
  const [showText, setShowText] = useState(false);

  const toggle = (s) => setSelected((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);

  const analyze = () => setResult(analyzeSymptoms(selected));

  const handleTextAnalyze = () => {
    const text = textInput.toLowerCase();
    const matched = ALL_SYMPTOMS.filter((s) => text.includes(s.toLowerCase()));
    if (matched.length) {
      setSelected((p) => [...new Set([...p, ...matched])]);
      setTextInput("");
      setShowText(false);
    }
  };

  const startVoice = () => {
    setVoiceError("");
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setVoiceError("Voice not supported. Use text input below.");
      setShowText(true);
      return;
    }
    const r = new SR();
    r.lang = LANG_CODES[lang] || "en-IN";
    r.onstart = () => setListening(true);
    r.onresult = (e) => {
      const text = e.results[0][0].transcript.toLowerCase();
      const matched = ALL_SYMPTOMS.filter((s) => text.includes(s.toLowerCase()));
      if (matched.length) {
        setSelected((p) => [...new Set([...p, ...matched])]);
      } else {
        setVoiceError(`Heard: "${e.results[0][0].transcript}" — no symptoms matched. Try text input.`);
        setShowText(true);
      }
      setListening(false);
    };
    r.onerror = (e) => {
      setListening(false);
      setVoiceError("Microphone error. Please allow microphone access or use text input.");
      setShowText(true);
    };
    r.onend = () => setListening(false);
    r.start();
  };

  return (
    <Layout>
      <PageHeader title={t(lang, "triage")} subtitle="AI-powered offline triage" icon={FiActivity} />

      <GlassCard className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700">{t(lang, "selectSymptoms")}</p>
          <div className="flex gap-2">
            <motion.button whileTap={{ scale: 0.9 }}
              onClick={() => setShowText(!showText)}
              className="w-9 h-9 rounded-2xl flex items-center justify-center bg-gray-100 text-gray-500">
              <FiType className="text-base" />
            </motion.button>
            <motion.button whileTap={{ scale: 0.9 }}
              animate={listening ? { scale: [1, 1.1, 1], transition: { repeat: Infinity, duration: 0.8 } } : {}}
              onClick={startVoice}
              className={`w-9 h-9 rounded-2xl flex items-center justify-center ${listening ? "bg-rose-500 text-white" : "bg-rose-100 text-rose-500"}`}>
              {listening ? <FiMicOff className="text-base" /> : <FiMic className="text-base" />}
            </motion.button>
          </div>
        </div>

        {/* Text input fallback */}
        <AnimatePresence>
          {showText && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-3">
              <div className="flex gap-2">
                <input value={textInput} onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Type symptoms e.g. headache, swelling"
                  onKeyDown={(e) => e.key === "Enter" && handleTextAnalyze()}
                  className="flex-1 glass rounded-2xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 outline-none focus:ring-2 focus:ring-rose-300" />
                <button onClick={handleTextAnalyze} className="bg-rose-500 text-white px-3 rounded-2xl text-xs font-semibold">Add</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {voiceError && <p className="text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2 mb-3">{voiceError}</p>}

        <div className="flex flex-wrap gap-2">
          {ALL_SYMPTOMS.map((s) => (
            <motion.button key={s} whileTap={{ scale: 0.95 }} onClick={() => toggle(s)}
              className={`px-3 py-1.5 rounded-2xl text-xs font-medium transition-all ${
                selected.includes(s) ? "bg-rose-500 text-white shadow-card" : "glass text-gray-600 border border-white/60"
              }`}>
              {s}
            </motion.button>
          ))}
        </div>
      </GlassCard>

      <Btn onClick={analyze} disabled={selected.length === 0} icon={FiSearch}>
        {t(lang, "analyze")} ({selected.length})
      </Btn>

      <AnimatePresence>
        {result && (
          <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`mt-4 bg-gradient-to-br ${riskGradients[result.level]} rounded-3xl p-5 text-white shadow-glass`}>
            <div className="flex items-center gap-3 mb-3">
              {(() => { const Icon = RiskIcon[result.level]; return <Icon className="text-3xl" />; })()}
              <div>
                <p className="text-xs opacity-80 font-medium">{t(lang, "riskLevel")}</p>
                <p className="text-2xl font-bold">{result.level}</p>
              </div>
            </div>
            <div className="bg-white/20 rounded-2xl p-3 mb-2">
              <p className="text-xs font-semibold opacity-80 mb-1">{t(lang, "whyResult").toUpperCase()}</p>
              <p className="text-sm">{result.reason}</p>
            </div>
            <div className="bg-white/20 rounded-2xl p-3">
              <p className="text-xs font-semibold opacity-80 mb-1">{t(lang, "recommended").toUpperCase()}</p>
              <p className="text-sm font-medium">{result.action}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Layout>
  );
}
