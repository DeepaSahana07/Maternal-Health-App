import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCalendar, FiPlus, FiX } from "react-icons/fi";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";
import { load, save, KEYS } from "../utils/storage";
import { t } from "../utils/i18n";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function Calendar() {
  const lang = load(KEYS.LANG, "en");
  const profile = load(KEYS.PROFILE, {});
  const [events, setEvents] = useState(() => load(KEYS.EVENTS, {}));
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(today.toDateString());
  const [newEvent, setNewEvent] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const addEvent = () => {
    if (!newEvent.trim()) return;
    const updated = { ...events, [selected]: [...(events[selected] || []), newEvent.trim()] };
    setEvents(updated);
    save(KEYS.EVENTS, updated);
    setNewEvent("");
    setShowAdd(false);
  };

  const removeEvent = (dateKey, idx) => {
    const updated = { ...events, [dateKey]: events[dateKey].filter((_, i) => i !== idx) };
    setEvents(updated);
    save(KEYS.EVENTS, updated);
  };

  const selectedEvents = events[selected] || [];
  const week = profile.week || 0;
  const month_num = profile.month || 0;

  return (
    <Layout>
      <PageHeader title={t(lang, "calendarTitle")} subtitle="Track appointments & milestones" icon={FiCalendar} />

      {/* Pregnancy Timeline */}
      {week > 0 && (
        <GlassCard className="mb-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">{t(lang, "timelineTitle")}</p>
          <div className="flex gap-3">
            {[
              { label: t(lang, "days"), value: week * 7 },
              { label: t(lang, "weeks"), value: week },
              { label: t(lang, "month"), value: month_num },
            ].map((item, i) => (
              <div key={i} className="flex-1 bg-rose-50 rounded-2xl p-3 text-center">
                <p className="text-xl font-bold text-rose-500">{item.value}</p>
                <p className="text-[10px] text-gray-400">{item.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 bg-rose-100 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full" style={{ width: `${(week / 40) * 100}%` }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">{Math.round((week / 40) * 100)}% of pregnancy complete</p>
        </GlassCard>
      )}

      {/* Calendar */}
      <GlassCard className="mb-4">
        {/* Month Nav */}
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="w-8 h-8 glass rounded-xl text-rose-500 font-bold flex items-center justify-center">‹</button>
          <p className="text-sm font-semibold text-gray-700">{MONTHS[month]} {year}</p>
          <button onClick={nextMonth} className="w-8 h-8 glass rounded-xl text-rose-500 font-bold flex items-center justify-center">›</button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map((d) => (
            <p key={d} className="text-center text-[10px] font-semibold text-gray-400">{d}</p>
          ))}
        </div>

        {/* Date grid */}
        <div className="grid grid-cols-7 gap-1">
          {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
          {Array(daysInMonth).fill(null).map((_, i) => {
            const date = new Date(year, month, i + 1);
            const dateStr = date.toDateString();
            const isToday = dateStr === today.toDateString();
            const isSelected = dateStr === selected;
            const hasEvent = (events[dateStr] || []).length > 0;
            return (
              <motion.button key={i} whileTap={{ scale: 0.9 }}
                onClick={() => setSelected(dateStr)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-xs font-medium relative transition ${
                  isSelected ? "bg-rose-500 text-white shadow-card" :
                  isToday ? "bg-rose-100 text-rose-600" : "text-gray-600 hover:bg-rose-50"
                }`}>
                {i + 1}
                {hasEvent && <div className={`w-1 h-1 rounded-full mt-0.5 ${isSelected ? "bg-white" : "bg-rose-400"}`} />}
              </motion.button>
            );
          })}
        </div>
      </GlassCard>

      {/* Events for selected date */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {t(lang, "eventsOn")} {new Date(selected).toLocaleDateString()}
        </p>
        <button onClick={() => setShowAdd(!showAdd)}
          className="w-7 h-7 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-card">
          <FiPlus className="text-sm" />
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-3">
            <div className="flex gap-2">
              <input value={newEvent} onChange={(e) => setNewEvent(e.target.value)}
                placeholder={t(lang, "eventTitle")}
                onKeyDown={(e) => e.key === "Enter" && addEvent()}
                className="flex-1 glass rounded-2xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 outline-none focus:ring-2 focus:ring-rose-300" />
              <button onClick={addEvent} className="bg-rose-500 text-white px-4 rounded-2xl text-xs font-semibold">{t(lang, "addEvent")}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {selectedEvents.length === 0 ? (
        <GlassCard><p className="text-sm text-gray-400 text-center">{t(lang, "noEvents")}</p></GlassCard>
      ) : (
        <div className="space-y-2">
          {selectedEvents.map((ev, i) => (
            <GlassCard key={i}>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700">{ev}</p>
                <button onClick={() => removeEvent(selected, i)} className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FiX className="text-gray-400 text-xs" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </Layout>
  );
}
