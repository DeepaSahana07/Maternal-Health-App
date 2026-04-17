import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { t } from "../utils/i18n";

const WEEK_MARKERS = [12, 16, 20, 24, 28, 32, 36, 40];

const BABY_SIZE = {
  4: "poppy seed", 8: "raspberry", 12: "lime", 16: "avocado",
  20: "banana", 24: "ear of corn", 28: "eggplant", 32: "squash",
  36: "honeydew melon", 40: "watermelon",
};

const TRIMESTER_DATA = [
  {
    num: 1, label: "1st Trimester", weeks: "Weeks 1–12",
    desc: "Baby's organs form. Morning sickness common.",
    color: "from-rose-400 to-pink-400",
  },
  {
    num: 2, label: "2nd Trimester", weeks: "Weeks 13–27",
    desc: "Baby moves! Energy returns. Bump visible.",
    color: "from-purple-400 to-violet-400",
  },
  {
    num: 3, label: "3rd Trimester", weeks: "Weeks 28–40",
    desc: "Baby grows rapidly. Prepare for birth.",
    color: "from-sky-400 to-blue-400",
  },
];

const MONTH_DATA = [
  { m: 1, label: "Month 1", weeks: "1–4", desc: "Embryo forms, heart begins beating" },
  { m: 2, label: "Month 2", weeks: "5–8", desc: "Facial features develop" },
  { m: 3, label: "Month 3", weeks: "9–12", desc: "Fingers & toes form" },
  { m: 4, label: "Month 4", weeks: "13–16", desc: "Baby can suck thumb" },
  { m: 5, label: "Month 5", weeks: "17–20", desc: "You feel baby move!" },
  { m: 6, label: "Month 6", weeks: "21–24", desc: "Baby responds to sound" },
  { m: 7, label: "Month 7", weeks: "25–28", desc: "Eyes open, brain grows fast" },
  { m: 8, label: "Month 8", weeks: "29–32", desc: "Baby gains weight rapidly" },
  { m: 9, label: "Month 9", weeks: "33–36", desc: "Baby moves into position" },
];

const getBabySize = (week) => {
  const keys = Object.keys(BABY_SIZE).map(Number).sort((a, b) => a - b);
  const closest = keys.reduce((p, c) => (Math.abs(c - week) < Math.abs(p - week) ? c : p));
  return BABY_SIZE[closest];
};

const getCurrentTrimester = (week) => {
  if (week <= 12) return 1;
  if (week <= 27) return 2;
  return 3;
};

export default function PregnancyTimeline({ week = 0, lang = "en" }) {
  const [tab, setTab] = useState("weeks");
  const sliderRef = useRef();

  const pct = week > 0 ? Math.min((week / 40) * 100, 100) : 0;
  const currentTrimester = getCurrentTrimester(week);
  const currentMonth = week > 0 ? Math.ceil(week / 4) : 0;
  const weeksLeft = week > 0 ? Math.max(0, 40 - week) : null;

  const TABS = [
    { key: "weeks", label: t(lang, "weeksTab") },
    { key: "months", label: t(lang, "monthsTab") },
    { key: "trimesters", label: t(lang, "trimestersTab") },
  ];

  return (
    <div className="glass rounded-3xl overflow-hidden shadow-card mb-4">
      {/* Header gradient */}
      <div className="bg-gradient-to-br from-rose-400 via-pink-400 to-fuchsia-400 p-5 relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/10 rounded-full" />
        <div className="absolute right-4 bottom-2 w-20 h-20 bg-white/10 rounded-full" />

        <div className="relative z-10">
          {week > 0 ? (
            <>
              <p className="text-white/70 text-xs font-medium mb-1">
                {currentTrimester === 1 ? "1st" : currentTrimester === 2 ? "2nd" : "3rd"} {t(lang, "trimester")}
              </p>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-white text-5xl font-bold leading-none">{week}</span>
                <span className="text-white/80 text-base mb-1">{t(lang, "weeks")}</span>
              </div>
              <p className="text-white/70 text-xs">
                {t(lang, "babyNow")}: {getBabySize(week)}
              </p>
              <div className="flex gap-2 mt-3 flex-wrap">
                <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                  {week * 7} {t(lang, "days")}
                </span>
                {weeksLeft !== null && (
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                    {weeksLeft} {t(lang, "weeksLeft")}
                  </span>
                )}
                {currentMonth > 0 && (
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                    {t(lang, "month")} {currentMonth}
                  </span>
                )}
              </div>
            </>
          ) : (
            <p className="text-white/80 text-sm">{t(lang, "noDataYet")}</p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-white/40">
        {TABS.map((tb) => (
          <button
            key={tb.key}
            onClick={() => setTab(tb.key)}
            className={`flex-1 py-2.5 text-xs font-semibold transition relative ${
              tab === tb.key ? "text-rose-500" : "text-gray-400"
            }`}
          >
            {tb.label}
            {tab === tb.key && (
              <motion.div
                layoutId="timeline-tab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500 rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {tab === "weeks" && (
            <motion.div key="weeks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {/* Progress bar with week markers */}
              <div className="relative mb-4" ref={sliderRef}>
                <div className="h-2 bg-rose-100 rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"
                  />
                </div>
                {/* Week marker dots */}
                <div className="relative mt-2">
                  {WEEK_MARKERS.map((w) => {
                    const pos = ((w - 1) / 39) * 100;
                    const isPast = week >= w;
                    const isCurrent = week > 0 && Math.abs(week - w) <= 2;
                    return (
                      <div
                        key={w}
                        className="absolute flex flex-col items-center"
                        style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
                      >
                        <div className={`w-2 h-2 rounded-full mb-1 ${
                          isCurrent ? "bg-rose-500 ring-2 ring-rose-200" :
                          isPast ? "bg-rose-400" : "bg-gray-200"
                        }`} />
                        <span className={`text-[9px] font-medium ${
                          isCurrent ? "text-rose-500" : isPast ? "text-rose-300" : "text-gray-300"
                        }`}>{w}W</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-6 flex justify-between text-xs text-gray-400">
                <span>{t(lang, "currentWeek")}: <span className="font-bold text-rose-500">{week || "—"}</span></span>
                <span>{t(lang, "dueDate")}: <span className="font-semibold text-gray-600">Week 40</span></span>
              </div>
            </motion.div>
          )}

          {tab === "months" && (
            <motion.div key="months" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="space-y-2">
                {MONTH_DATA.map((m) => {
                  const active = currentMonth === m.m;
                  const past = currentMonth > m.m;
                  return (
                    <div key={m.m}
                      className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 transition ${
                        active ? "bg-rose-50 border border-rose-200" : "bg-white/30"
                      }`}>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                        active ? "bg-rose-500 text-white" :
                        past ? "bg-rose-200 text-rose-600" : "bg-gray-100 text-gray-400"
                      }`}>
                        {m.m}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold ${active ? "text-rose-600" : past ? "text-gray-700" : "text-gray-400"}`}>
                          {m.label} <span className="font-normal opacity-60">· Wk {m.weeks}</span>
                        </p>
                        <p className="text-[10px] text-gray-400 truncate">{m.desc}</p>
                      </div>
                      {active && <span className="text-[10px] bg-rose-500 text-white px-2 py-0.5 rounded-full font-medium flex-shrink-0">Now</span>}
                      {past && <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-[8px]">✓</span>
                      </div>}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {tab === "trimesters" && (
            <motion.div key="trimesters" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="space-y-3">
                {TRIMESTER_DATA.map((tr) => {
                  const active = currentTrimester === tr.num && week > 0;
                  const past = currentTrimester > tr.num && week > 0;
                  return (
                    <div key={tr.num}
                      className={`rounded-2xl p-4 transition ${
                        active ? `bg-gradient-to-r ${tr.color} text-white` :
                        past ? "bg-gray-50 border border-gray-100" : "bg-white/30"
                      }`}>
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-sm font-bold ${active ? "text-white" : past ? "text-gray-700" : "text-gray-400"}`}>
                          {tr.label}
                        </p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          active ? "bg-white/20 text-white" :
                          past ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                        }`}>
                          {active ? "Current" : past ? "Done ✓" : tr.weeks}
                        </span>
                      </div>
                      <p className={`text-xs ${active ? "text-white/80" : "text-gray-400"}`}>{tr.desc}</p>
                      {active && (
                        <div className="mt-2 bg-white/20 rounded-xl h-1.5 overflow-hidden">
                          <div className="h-full bg-white/60 rounded-full"
                            style={{ width: `${tr.num === 1 ? (week / 12) * 100 : tr.num === 2 ? ((week - 12) / 15) * 100 : ((week - 27) / 13) * 100}%` }} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
