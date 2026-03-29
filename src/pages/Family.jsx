import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";
import Input from "../components/Input";
import Btn from "../components/Btn";
import { load, save, KEYS } from "../utils/storage";

const ROLES = ["Partner", "Mother", "Sister", "Doctor", "Friend"];

export default function Family() {
  const [members, setMembers] = useState(() => load(KEYS.FAMILY));
  const [name, setName] = useState("");
  const [role, setRole] = useState("Partner");
  const [alertedId, setAlertedId] = useState(null);

  const addMember = () => {
    if (!name.trim()) return;
    const m = { id: Date.now(), name, role, score: 0 };
    const updated = [...members, m];
    setMembers(updated);
    save(KEYS.FAMILY, updated);
    setName("");
  };

  const sendAlert = (id) => {
    setAlertedId(id);
    setTimeout(() => setAlertedId(null), 3000);
  };

  const addScore = (id) => {
    const updated = members.map((m) => m.id === id ? { ...m, score: (m.score || 0) + 10 } : m);
    setMembers(updated);
    save(KEYS.FAMILY, updated);
  };

  const remove = (id) => {
    const updated = members.filter((m) => m.id !== id);
    setMembers(updated);
    save(KEYS.FAMILY, updated);
  };

  return (
    <Layout>
      <PageHeader title="Family Dashboard" subtitle="Manage your support circle" emoji="👨‍👩‍👧" />

      <GlassCard className="mb-4">
        <p className="text-xs font-semibold text-gray-500 mb-3">Add Family Member</p>
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="flex gap-2 flex-wrap mb-3">
          {ROLES.map((r) => (
            <button key={r} onClick={() => setRole(r)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition ${role === r ? "bg-rose-500 text-white" : "glass text-gray-500"}`}>
              {r}
            </button>
          ))}
        </div>
        <Btn onClick={addMember}>+ Add Member</Btn>
      </GlassCard>

      {members.length === 0 ? (
        <GlassCard><p className="text-sm text-gray-400 text-center">No family members added yet</p></GlassCard>
      ) : (
        <div className="space-y-3">
          {members.map((m, i) => (
            <GlassCard key={m.id} delay={i * 0.05}>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-rose-300 to-pink-400 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                  {m.name[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{m.name}</p>
                  <p className="text-xs text-gray-400">{m.role} · 🏆 {m.score || 0} pts</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => sendAlert(m.id)}
                    className="w-8 h-8 bg-rose-100 text-rose-500 rounded-xl text-sm flex items-center justify-center">
                    📢
                  </button>
                  <button onClick={() => addScore(m.id)}
                    className="w-8 h-8 bg-green-100 text-green-600 rounded-xl text-sm flex items-center justify-center">
                    +
                  </button>
                  <button onClick={() => remove(m.id)}
                    className="w-8 h-8 bg-gray-100 text-gray-400 rounded-xl text-sm flex items-center justify-center">
                    ×
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {alertedId === m.id && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-xs text-rose-500 font-medium mt-2">
                    ✅ Alert sent to {m.name}!
                  </motion.p>
                )}
              </AnimatePresence>
            </GlassCard>
          ))}
        </div>
      )}
    </Layout>
  );
}
