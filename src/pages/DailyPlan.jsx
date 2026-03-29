import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";
import Btn from "../components/Btn";
import { load, save, KEYS } from "../utils/storage";
import { getPlan } from "../utils/planEngine";

const sections = [
  { key: "food", emoji: "🍽️", label: "Nutrition", color: "from-green-400 to-emerald-400" },
  { key: "activity", emoji: "🏃‍♀️", label: "Activity", color: "from-sky-400 to-blue-400" },
  { key: "precautions", emoji: "⚠️", label: "Precautions", color: "from-amber-400 to-orange-400" },
];

export default function DailyPlan() {
  const profile = load(KEYS.PROFILE, { week: 24 });
  const [week, setWeek] = useState(profile.week || 24);
  const [done, setDone] = useState({});
  const [score, setScore] = useState(() => load(KEYS.SCORE, 0));
  const plan = getPlan(week);

  const markDone = (key, item) => {
    const id = `${key}-${item}`;
    if (done[id]) return;
    setDone((p) => ({ ...p, [id]: true }));
    const ns = score + 10;
    setScore(ns);
    save(KEYS.SCORE, ns);
  };

  return (
    <Layout>
      <PageHeader title="Daily Plan" subtitle={`Week ${week} personalized plan`} emoji="📅" />

      {/* Week Selector */}
      <GlassCard className="mb-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Pregnancy Week</p>
          <div className="flex items-center gap-3">
            <button onClick={() => setWeek((w) => Math.max(1, w - 1))} className="w-8 h-8 glass rounded-xl text-rose-500 font-bold">−</button>
            <span className="text-lg font-bold text-rose-500 w-8 text-center">{week}</span>
            <button onClick={() => setWeek((w) => Math.min(40, w + 1))} className="w-8 h-8 glass rounded-xl text-rose-500 font-bold">+</button>
          </div>
        </div>
        <div className="mt-2 bg-rose-100 rounded-2xl h-2 overflow-hidden">
          <motion.div
            animate={{ width: `${(week / 40) * 100}%` }}
            className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1 text-right">{Math.round((week / 40) * 100)}% complete</p>
      </GlassCard>

      {/* Score */}
      <GlassCard className="mb-4 flex-row flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">Partner Engagement Score 🏆</p>
          <p className="text-2xl font-bold text-rose-500">{score} pts</p>
        </div>
        <p className="text-3xl">🎖️</p>
      </GlassCard>

      {/* Plan Sections */}
      {sections.map((sec, si) => (
        <div key={sec.key} className="mb-4">
          <div className={`bg-gradient-to-r ${sec.color} rounded-3xl px-4 py-2 mb-2 flex items-center gap-2`}>
            <span className="text-lg">{sec.emoji}</span>
            <p className="text-sm font-semibold text-white">{sec.label}</p>
          </div>
          <div className="space-y-2">
            {plan[sec.key].map((item, i) => {
              const id = `${sec.key}-${item}`;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: si * 0.1 + i * 0.05 }}
                  className={`glass rounded-2xl px-4 py-3 flex items-center justify-between ${done[id] ? "opacity-60" : ""}`}
                >
                  <p className="text-sm text-gray-700">{item}</p>
                  <button
                    onClick={() => markDone(sec.key, item)}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-sm transition ${done[id] ? "bg-green-400 text-white" : "glass border border-gray-200 text-gray-300"}`}
                  >
                    {done[id] ? "✓" : "○"}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </Layout>
  );
}
