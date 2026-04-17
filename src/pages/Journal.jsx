import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCamera, FiSave, FiX, FiCpu } from "react-icons/fi";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";
import { load, save, KEYS } from "../utils/storage";
import { t } from "../utils/i18n";

const INSIGHTS = [
  "Skin looks healthy — good hydration detected",
  "Mild swelling pattern observed — monitor ankles",
  "Glow is strong! Hormones are balanced",
  "3+ entries this week — great consistency!",
  "Rest well — your body is working hard",
];

export default function Journal() {
  const lang = load(KEYS.LANG, "en");
  const [entries, setEntries] = useState(() => load(KEYS.JOURNAL));
  const [note, setNote] = useState("");
  const [preview, setPreview] = useState(null);
  const [imgData, setImgData] = useState(null);
  const fileRef = useRef();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImgData(ev.target.result);
      setPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  const handleSave = () => {
    if (!imgData && !note.trim()) return;
    const entry = {
      id: Date.now(),
      img: imgData || null,
      note: note.trim() || "",
      date: new Date().toLocaleDateString(),
      insight: INSIGHTS[Math.floor(Math.random() * INSIGHTS.length)],
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    save(KEYS.JOURNAL, updated);
    setNote("");
    setImgData(null);
    setPreview(null);
  };

  const remove = (id) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    save(KEYS.JOURNAL, updated);
  };

  return (
    <Layout>
      <PageHeader title={t(lang, "journal")} subtitle="Visual health diary with AI insights" icon={FiCamera} />

      {/* Add Entry Card */}
      <GlassCard className="mb-4">
        <p className="text-xs font-semibold text-gray-500 mb-3">{t(lang, "addEntry")}</p>

        {/* Image preview */}
        {preview && (
          <div className="relative mb-3">
            <img src={preview} alt="" className="w-full rounded-2xl object-cover max-h-40" />
            <button onClick={() => { setPreview(null); setImgData(null); }}
              className="absolute top-2 right-2 w-7 h-7 bg-black/40 rounded-full flex items-center justify-center">
              <FiX className="text-white text-sm" />
            </button>
          </div>
        )}

        {/* Note input */}
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t(lang, "addNote")}
          className="w-full glass rounded-2xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 outline-none focus:ring-2 focus:ring-rose-300 resize-none mb-3"
          rows={3}
        />

        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

        <div className="flex gap-2">
          <button onClick={() => fileRef.current.click()}
            className="flex-1 glass border border-rose-200 text-rose-500 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5">
            <FiCamera className="text-sm" />
            {t(lang, "uploadPhoto")}
          </button>
          <button onClick={handleSave} disabled={!imgData && !note.trim()}
            className="flex-1 bg-gradient-to-r from-rose-400 to-pink-500 text-white py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40">
            <FiSave className="text-sm" />
            {t(lang, "save")}
          </button>
        </div>
      </GlassCard>

      {/* Entries */}
      {entries.length === 0 ? (
        <GlassCard><p className="text-sm text-gray-400 text-center">{t(lang, "noEntries")}</p></GlassCard>
      ) : (
        <div className="space-y-4">
          {entries.map((entry, i) => (
            <GlassCard key={entry.id} delay={i * 0.05}>
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-400">{entry.date}</p>
                <button onClick={() => remove(entry.id)} className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FiX className="text-gray-400 text-xs" />
                </button>
              </div>
              {entry.img && <img src={entry.img} alt="" className="w-full rounded-2xl object-cover max-h-48 mb-2" />}
              {entry.note && <p className="text-sm text-gray-600 mb-2">{entry.note}</p>}
              <div className="bg-rose-50 rounded-2xl px-3 py-2 flex items-start gap-2">
                <FiCpu className="text-rose-400 text-sm mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-rose-500 mb-0.5">{t(lang, "aiInsight")}</p>
                  <p className="text-xs text-gray-600">{entry.insight}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </Layout>
  );
}
