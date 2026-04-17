import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiMic, FiAlertCircle, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";
import Input from "../components/Input";
import Btn from "../components/Btn";
import Badge from "../components/Badge";
import { load, save, KEYS } from "../utils/storage";
import { analyzeSymptoms } from "../utils/triageEngine";
import { t } from "../utils/i18n";
import { LANG_CODES } from "../utils/sarvamAI";

const riskColor = { HIGH: "red", MEDIUM: "amber", LOW: "green" };
const RiskIcon = { HIGH: FiAlertCircle, MEDIUM: FiAlertTriangle, LOW: FiCheckCircle };

export default function Health() {
  const lang = load(KEYS.LANG, "en");
  const profile = load(KEYS.PROFILE, {});
  const [bp, setBp] = useState(profile.bp || "");
  const [weight, setWeight] = useState(profile.weight || "");
  const [symptoms, setSymptoms] = useState("");
  const [records, setRecords] = useState(() => load(KEYS.HEALTH));
  const [result, setResult] = useState(null);
  const [voiceRecording, setVoiceRecording] = useState(false);

  const handleSave = () => {
    if (!bp && !weight && !symptoms) return;
    const symptomList = symptoms.split(",").map((s) => s.trim()).filter(Boolean);
    const ai = analyzeSymptoms(symptomList);
    const rec = { bp, weight, symptoms, date: new Date().toLocaleString(), risk: ai?.level || "LOW" };
    const updated = [rec, ...records];
    setRecords(updated);
    save(KEYS.HEALTH, updated);
    setResult(ai);
    setBp(""); setWeight(""); setSymptoms("");
  };

  const startVoiceNote = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = LANG_CODES[lang] || "en-IN";
    r.onstart = () => setVoiceRecording(true);
    r.onresult = (e) => {
      const text = e.results[0][0].transcript;
      const rec = { bp: "Voice Note", weight: "-", symptoms: text, date: new Date().toLocaleString(), risk: "LOW" };
      const updated = [rec, ...records];
      setRecords(updated);
      save(KEYS.HEALTH, updated);
      setVoiceRecording(false);
    };
    r.onerror = () => setVoiceRecording(false);
    r.onend = () => setVoiceRecording(false);
    r.start();
  };

  return (
    <Layout>
      <PageHeader title={t(lang, "health")} subtitle="Track BP, weight & symptoms" icon={FiHeart} />

      <GlassCard className="mb-4">
        <p className="text-xs font-semibold text-gray-500 mb-3">{t(lang, "logReading")}</p>
        <Input label={t(lang, "bp")} placeholder="e.g. 120/80 mmHg" value={bp} onChange={(e) => setBp(e.target.value)} />
        <Input label={t(lang, "weight")} placeholder="e.g. 65 kg" value={weight} onChange={(e) => setWeight(e.target.value)} />
        <Input label="Symptoms (comma separated)" placeholder="e.g. Swelling, Dizziness" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} />
        <Btn onClick={handleSave} icon={FiHeart}>{t(lang, "saveAnalyze")}</Btn>
      </GlassCard>

      <AnimatePresence>
        {result && (
          <motion.div key="result" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={`mb-4 rounded-3xl p-4 text-white shadow-glass bg-gradient-to-br ${
              result.level === "HIGH" ? "from-red-500 to-rose-500" :
              result.level === "MEDIUM" ? "from-amber-400 to-orange-400" : "from-green-400 to-emerald-400"
            }`}>
            <div className="flex items-center gap-2 mb-2">
              {(() => { const Icon = RiskIcon[result.level]; return <Icon className="text-xl" />; })()}
              <p className="font-bold text-lg">{result.level} {t(lang, "riskLevel")}</p>
            </div>
            <p className="text-sm opacity-90">{result.reason}</p>
            <p className="text-sm font-semibold mt-2 bg-white/20 rounded-xl px-3 py-1.5">{result.action}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Note */}
      <GlassCard className="mb-4">
        <p className="text-xs font-semibold text-gray-500 mb-2">{t(lang, "voiceNote")}</p>
        <Btn variant="secondary" onClick={startVoiceNote} icon={FiMic}>
          {voiceRecording ? t(lang, "listening") : t(lang, "voiceNote")}
        </Btn>
      </GlassCard>

      {/* History */}
      <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">{t(lang, "history")}</p>
      {records.length === 0 ? (
        <GlassCard><p className="text-sm text-gray-400 text-center">{t(lang, "noHealthRecords")}</p></GlassCard>
      ) : (
        <div className="space-y-3">
          {records.map((r, i) => (
            <GlassCard key={i} delay={i * 0.04}>
              <div className="flex justify-between items-start mb-1">
                <p className="text-xs text-gray-400">{r.date}</p>
                <Badge label={r.risk} color={riskColor[r.risk] || "pink"} />
              </div>
              {r.bp !== "Voice Note" && (
                <div className="flex gap-4 text-sm">
                  <span><span className="text-gray-400 text-xs">BP </span><span className="font-semibold">{r.bp || "—"}</span></span>
                  <span><span className="text-gray-400 text-xs">Wt </span><span className="font-semibold">{r.weight || "—"}</span></span>
                </div>
              )}
              {r.symptoms && <p className="text-xs text-gray-500 mt-1">{r.symptoms}</p>}
            </GlassCard>
          ))}
        </div>
      )}
    </Layout>
  );
}
