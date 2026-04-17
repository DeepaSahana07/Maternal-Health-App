import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBell, FiPlus, FiTrash2, FiEdit2, FiCheck,
  FiClock, FiX, FiAlertCircle,
} from "react-icons/fi";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";
import { load, save, KEYS } from "../utils/storage";
import { t } from "../utils/i18n";

const TYPE_COLORS = {
  medicine: "bg-rose-100 text-rose-600",
  checkup: "bg-blue-100 text-blue-600",
};

const TYPE_ICONS = {
  medicine: "💊",
  checkup: "🩺",
};

export default function Reminders() {
  const lang = load(KEYS.LANG, "en");
  const [reminders, setReminders] = useState(() => load(KEYS.REMINDERS, []));
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ title: "", time: "", type: "medicine" });

  const saveReminders = (updated) => {
    setReminders(updated);
    save(KEYS.REMINDERS, updated);
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.time) return;
    if (editId) {
      saveReminders(reminders.map((r) => r.id === editId ? { ...r, ...form } : r));
      setEditId(null);
    } else {
      saveReminders([...reminders, { id: Date.now(), ...form, active: true }]);
    }
    setForm({ title: "", time: "", type: "medicine" });
    setShowForm(false);
  };

  const deleteReminder = (id) => saveReminders(reminders.filter((r) => r.id !== id));

  const toggleActive = (id) =>
    saveReminders(reminders.map((r) => r.id === id ? { ...r, active: !r.active } : r));

  const startEdit = (r) => {
    setForm({ title: r.title, time: r.time, type: r.type });
    setEditId(r.id);
    setShowForm(true);
  };

  const inp = "w-full glass rounded-2xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 outline-none focus:ring-2 focus:ring-rose-300 transition mb-3";

  return (
    <Layout>
      <PageHeader title={t(lang, "reminders")} subtitle="Medicine & checkup alerts" icon={FiBell} />

      {/* Add Button */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{t(lang, "activeReminders")}</p>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ title: "", time: "", type: "medicine" }); }}
          className="w-8 h-8 bg-rose-500 text-white rounded-xl flex items-center justify-center shadow-card"
        >
          {showForm ? <FiX className="text-sm" /> : <FiPlus className="text-sm" />}
        </button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-4"
          >
            <GlassCard>
              <p className="text-xs font-semibold text-gray-500 mb-3">
                {editId ? t(lang, "editReminder") : t(lang, "addReminder")}
              </p>
              <input className={inp} placeholder={t(lang, "reminderTitle")}
                value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
              <input className={inp} type="time" value={form.time}
                onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))} />
              <div className="flex gap-2 mb-3">
                {["medicine", "checkup"].map((type) => (
                  <button key={type} onClick={() => setForm((p) => ({ ...p, type }))}
                    className={`flex-1 py-2 rounded-2xl text-xs font-semibold transition ${
                      form.type === type ? "bg-rose-500 text-white" : "glass text-gray-500"
                    }`}>
                    {t(lang, type)}
                  </button>
                ))}
              </div>
              <button onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-rose-400 to-pink-500 text-white py-3 rounded-2xl text-sm font-semibold">
                {editId ? t(lang, "save") : t(lang, "addReminder")}
              </button>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reminder List */}
      {reminders.length === 0 ? (
        <GlassCard>
          <p className="text-sm text-gray-400 text-center">{t(lang, "noReminders")}</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {reminders.map((r, i) => (
            <motion.div key={r.id}
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}>
              <GlassCard className={`${!r.active ? "opacity-50" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 ${TYPE_COLORS[r.type]}`}>
                    {TYPE_ICONS[r.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{r.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <FiClock className="text-gray-400 text-xs" />
                      <span className="text-xs text-gray-400">{r.time}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[r.type]}`}>
                        {t(lang, r.type)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => toggleActive(r.id)}
                      className={`w-7 h-7 rounded-xl flex items-center justify-center transition ${
                        r.active ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                      }`}>
                      <FiCheck className="text-xs" />
                    </button>
                    <button onClick={() => startEdit(r)}
                      className="w-7 h-7 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                      <FiEdit2 className="text-xs" />
                    </button>
                    <button onClick={() => deleteReminder(r.id)}
                      className="w-7 h-7 bg-red-50 text-red-400 rounded-xl flex items-center justify-center">
                      <FiTrash2 className="text-xs" />
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      )}
    </Layout>
  );
}
