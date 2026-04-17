import { useState } from "react";
import { motion } from "framer-motion";
import { FiCalendar, FiMinus, FiPlus, FiAward } from "react-icons/fi";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";
import { load, save, KEYS } from "../utils/storage";
import { t } from "../utils/i18n";

const PLANS = {
  1: {
    food: ["Folic acid-rich greens", "Lentil soup", "Fresh citrus fruits", "Whole grains"],
    activity: ["Light 15-min walks", "Gentle yoga", "Deep breathing"],
    precautions: ["Avoid raw fish & meat", "No alcohol or smoking", "Take prenatal vitamins daily"],
    avoid: ["Papaya", "Pineapple", "Raw eggs", "Unpasteurized dairy"],
  },
  2: {
    food: ["Ginger tea for nausea", "Small frequent meals", "Bananas", "Crackers"],
    activity: ["Short walks", "Prenatal yoga", "Light stretching"],
    precautions: ["Rest when tired", "Stay hydrated", "Avoid strong smells"],
    avoid: ["Spicy food", "Caffeine", "Processed foods"],
  },
  3: {
    food: ["Iron-rich spinach", "Ragi porridge", "Protein dal", "Nuts & seeds"],
    activity: ["30-min walks", "Swimming", "Prenatal yoga"],
    precautions: ["Sleep on left side", "Monitor BP weekly", "Avoid lying flat"],
    avoid: ["High-mercury fish", "Excess salt", "Junk food"],
  },
  4: {
    food: ["Calcium-rich ragi", "Milk & curd", "Sesame seeds", "Leafy greens"],
    activity: ["Swimming", "Prenatal yoga", "Walking 30 min"],
    precautions: ["Wear comfortable shoes", "Avoid standing too long", "Kegel exercises"],
    avoid: ["Raw sprouts", "Deli meats", "Excess sugar"],
  },
  5: {
    food: ["Omega-3 rich foods", "Walnuts", "Flaxseeds", "Salmon (cooked)"],
    activity: ["Prenatal yoga", "Walking", "Light strength training"],
    precautions: ["Track fetal movements", "Sleep with pillow support", "Stay cool"],
    avoid: ["Alcohol", "High-sodium foods", "Artificial sweeteners"],
  },
  6: {
    food: ["Iron-rich moringa", "Jaggery & sesame", "Dates", "Coconut water"],
    activity: ["Gentle walking", "Prenatal yoga", "Pelvic tilts"],
    precautions: ["Monitor swelling", "Elevate feet when resting", "Avoid heavy lifting"],
    avoid: ["Excess caffeine", "Raw shellfish", "Unpasteurized juice"],
  },
  7: {
    food: ["Small frequent meals", "Fiber-rich foods", "Prunes", "Whole wheat"],
    activity: ["Short walks", "Prenatal yoga", "Breathing exercises"],
    precautions: ["Pack hospital bag", "Know labor signs", "Rest frequently"],
    avoid: ["Gas-causing foods", "Excess spice", "Heavy meals at night"],
  },
  8: {
    food: ["Dates for labor prep", "Coconut water", "Light soups", "Fruits"],
    activity: ["Pelvic floor exercises", "Gentle walking", "Relaxation techniques"],
    precautions: ["Track contractions", "Stay near hospital", "Have emergency contacts ready"],
    avoid: ["Heavy meals", "Excess salt", "Strenuous activity"],
  },
  9: {
    food: ["Light easy-to-digest meals", "Dates", "Coconut water", "Herbal teas"],
    activity: ["Pelvic floor exercises", "Short walks", "Deep breathing"],
    precautions: ["Hospital bag ready", "Know your birth plan", "Rest as much as possible"],
    avoid: ["Heavy meals", "Long travel", "Stress"],
  },
};

const SECTIONS = [
  { key: "food", labelKey: "foodSuggestions", color: "from-green-400 to-emerald-400" },
  { key: "activity", labelKey: "activities", color: "from-sky-400 to-blue-400" },
  { key: "precautions", labelKey: "precautions", color: "from-amber-400 to-orange-400" },
  { key: "avoid", labelKey: "foodsToAvoid", color: "from-red-400 to-rose-400" },
];

export default function DailyPlan() {
  const lang = load(KEYS.LANG, "en");
  const profile = load(KEYS.PROFILE, {});
  const [month, setMonth] = useState(profile.month || 1);
  const [done, setDone] = useState({});
  const [score, setScore] = useState(() => load(KEYS.SCORE, 0));

  const plan = PLANS[Math.min(Math.max(month, 1), 9)];
  const week = month * 4;

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
      <PageHeader title={t(lang, "plan")} subtitle={`${t(lang, "month")} ${month} · ${t(lang, "week")} ${week}`} icon={FiCalendar} />

      {/* Month Selector */}
      <GlassCard className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-700">{t(lang, "pregnancyMonth")}</p>
          <div className="flex items-center gap-3">
            <button onClick={() => setMonth((m) => Math.max(1, m - 1))}
              className="w-8 h-8 glass rounded-xl text-rose-500 font-bold flex items-center justify-center">
              <FiMinus />
            </button>
            <span className="text-lg font-bold text-rose-500 w-6 text-center">{month}</span>
            <button onClick={() => setMonth((m) => Math.min(9, m + 1))}
              className="w-8 h-8 glass rounded-xl text-rose-500 font-bold flex items-center justify-center">
              <FiPlus />
            </button>
          </div>
        </div>
        <div className="bg-rose-100 rounded-2xl h-2 overflow-hidden">
          <motion.div animate={{ width: `${(month / 9) * 100}%` }}
            className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full" />
        </div>
        <p className="text-xs text-gray-400 mt-1 text-right">{Math.round((month / 9) * 100)}% {t(lang, "complete")}</p>
      </GlassCard>

      {/* Score */}
      <GlassCard className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">{t(lang, "partnerScore")}</p>
          <p className="text-2xl font-bold text-rose-500">{score} pts</p>
        </div>
        <FiAward className="text-4xl text-rose-300" />
      </GlassCard>

      {/* Plan Sections */}
      {SECTIONS.map((sec, si) => (
        <div key={sec.key} className="mb-4">
          <div className={`bg-gradient-to-r ${sec.color} rounded-3xl px-4 py-2 mb-2`}>
            <p className="text-sm font-semibold text-white">{t(lang, sec.labelKey)}</p>
          </div>
          <div className="space-y-2">
            {plan[sec.key].map((item, i) => {
              const id = `${sec.key}-${item}`;
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: si * 0.08 + i * 0.04 }}
                  className={`glass rounded-2xl px-4 py-3 flex items-center justify-between ${done[id] ? "opacity-60" : ""}`}>
                  <p className="text-sm text-gray-700">{item}</p>
                  <button onClick={() => markDone(sec.key, item)}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-sm transition ${done[id] ? "bg-green-400 text-white" : "glass border border-gray-200 text-gray-300"}`}>
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
