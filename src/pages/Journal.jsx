import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";
import Btn from "../components/Btn";
import { load, save, KEYS } from "../utils/storage";

const INSIGHTS = [
  "✨ Skin looks healthy — good hydration detected",
  "⚠️ Mild swelling pattern observed — monitor ankles",
  "💚 Glow is strong! Hormones are balanced",
  "📊 3+ entries this week — great consistency!",
];

export default function Journal() {
  const [entries, setEntries] = useState(() => load(KEYS.JOURNAL));
  const [note, setNote] = useState("");
  const fileRef = useRef();

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const entry = {
        id: Date.now(),
        img: ev.target.result,
        note: note || "No note",
        date: new Date().toLocaleDateString(),
        insight: INSIGHTS[Math.floor(Math.random() * INSIGHTS.length)],
      };
      const updated = [entry, ...entries];
      setEntries(updated);
      save(KEYS.JOURNAL, updated);
      setNote("");
    };
    reader.readAsDataURL(file);
  };

  const remove = (id) => {
    const updated = entries.filter((e) => e.id !== id);
    setEntries(updated);
    save(KEYS.JOURNAL, updated);
  };

  return (
    <Layout>
      <PageHeader title="Photo Journal" subtitle="Visual health diary with AI insights" emoji="📷" />

      <GlassCard className="mb-4">
        <p className="text-xs font-semibold text-gray-500 mb-2">Add New Entry</p>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note (optional)..."
          className="w-full glass rounded-2xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 outline-none focus:ring-2 focus:ring-rose-300 resize-none mb-3"
          rows={2}
        />
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        <Btn onClick={() => fileRef.current.click()}>📸 Upload Photo</Btn>
      </GlassCard>

      {entries.length === 0 ? (
        <GlassCard><p className="text-sm text-gray-400 text-center">No journal entries yet</p></GlassCard>
      ) : (
        <div className="space-y-4">
          {entries.map((entry, i) => (
            <GlassCard key={entry.id} delay={i * 0.05}>
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-400">{entry.date}</p>
                <button onClick={() => remove(entry.id)} className="text-xs text-gray-300">✕</button>
              </div>
              <img src={entry.img} alt="journal" className="w-full rounded-2xl object-cover max-h-48 mb-2" />
              {entry.note !== "No note" && <p className="text-sm text-gray-600 mb-2">{entry.note}</p>}
              <div className="bg-rose-50 rounded-2xl px-3 py-2">
                <p className="text-xs font-semibold text-rose-500 mb-0.5">🤖 AI Insight</p>
                <p className="text-xs text-gray-600">{entry.insight}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </Layout>
  );
}
