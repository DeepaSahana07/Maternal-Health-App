import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";
import Badge from "../components/Badge";
import { load, KEYS } from "../utils/storage";

const TABS = ["Health", "Family", "Journal"];

export default function Records() {
  const [tab, setTab] = useState("Health");
  const health = load(KEYS.HEALTH);
  const family = load(KEYS.FAMILY);
  const journal = load(KEYS.JOURNAL);

  const riskColor = { HIGH: "red", MEDIUM: "amber", LOW: "green" };

  return (
    <Layout>
      <PageHeader title="Digital Records" subtitle="All your health data, offline-first" emoji="📋" />

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-2xl text-xs font-semibold transition ${tab === t ? "bg-rose-500 text-white shadow-card" : "glass text-gray-500"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "Health" && (
        health.length === 0 ? <GlassCard><p className="text-sm text-gray-400 text-center">No health records</p></GlassCard> :
        <div className="space-y-3">
          {health.map((r, i) => (
            <GlassCard key={i} delay={i * 0.04}>
              <div className="flex justify-between mb-1">
                <p className="text-xs text-gray-400">{r.date}</p>
                <Badge label={r.risk || "LOW"} color={riskColor[r.risk] || "green"} />
              </div>
              <div className="flex gap-4 text-sm">
                <span><span className="text-gray-400 text-xs">BP </span><b>{r.bp || "—"}</b></span>
                <span><span className="text-gray-400 text-xs">Wt </span><b>{r.weight || "—"}</b></span>
              </div>
              {r.symptoms && <p className="text-xs text-gray-500 mt-1">{r.symptoms}</p>}
            </GlassCard>
          ))}
        </div>
      )}

      {tab === "Family" && (
        family.length === 0 ? <GlassCard><p className="text-sm text-gray-400 text-center">No family members</p></GlassCard> :
        <div className="space-y-3">
          {family.map((m, i) => (
            <GlassCard key={i} delay={i * 0.04}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-300 to-pink-400 rounded-2xl flex items-center justify-center text-white font-bold">
                  {m.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold">{m.name}</p>
                  <p className="text-xs text-gray-400">{m.role} · 🏆 {m.score || 0} pts</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {tab === "Journal" && (
        journal.length === 0 ? <GlassCard><p className="text-sm text-gray-400 text-center">No journal entries</p></GlassCard> :
        <div className="grid grid-cols-2 gap-3">
          {journal.map((e, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              className="glass rounded-3xl overflow-hidden shadow-card">
              <img src={e.img} alt="" className="w-full h-28 object-cover" />
              <div className="p-2">
                <p className="text-xs text-gray-400">{e.date}</p>
                <p className="text-xs text-gray-600 truncate">{e.note}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </Layout>
  );
}
