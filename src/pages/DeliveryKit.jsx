import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";
import { load, save, KEYS } from "../utils/storage";

const DEFAULT_ITEMS = [
  { id: 1, cat: "Documents", label: "Aadhar Card / ID Proof" },
  { id: 2, cat: "Documents", label: "Hospital Registration Card" },
  { id: 3, cat: "Documents", label: "Blood Group Certificate" },
  { id: 4, cat: "Documents", label: "Insurance Papers" },
  { id: 5, cat: "Baby", label: "Baby Clothes (3 sets)" },
  { id: 6, cat: "Baby", label: "Diapers (1 pack)" },
  { id: 7, cat: "Baby", label: "Baby Blanket" },
  { id: 8, cat: "Baby", label: "Baby Cap & Socks" },
  { id: 9, cat: "Mother", label: "Comfortable Nightwear" },
  { id: 10, cat: "Mother", label: "Sanitary Pads (heavy flow)" },
  { id: 11, cat: "Mother", label: "Nursing Bra" },
  { id: 12, cat: "Mother", label: "Toiletries" },
  { id: 13, cat: "Medical", label: "Prenatal Vitamins" },
  { id: 14, cat: "Medical", label: "Doctor's Contact Number" },
  { id: 15, cat: "Medical", label: "Previous Scan Reports" },
];

const CATS = ["Documents", "Baby", "Mother", "Medical"];
const CAT_EMOJI = { Documents: "📄", Baby: "👶", Mother: "🤱", Medical: "💊" };

export default function DeliveryKit() {
  const [checked, setChecked] = useState(() => load(KEYS.KIT, {}));

  const toggle = (id) => {
    const updated = { ...checked, [id]: !checked[id] };
    setChecked(updated);
    save(KEYS.KIT, updated);
  };

  const total = DEFAULT_ITEMS.length;
  const done = DEFAULT_ITEMS.filter((i) => checked[i.id]).length;
  const pct = Math.round((done / total) * 100);

  return (
    <Layout>
      <PageHeader title="Delivery Kit" subtitle="Hospital bag checklist" emoji="🎒" />

      {/* Progress */}
      <GlassCard className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-semibold text-gray-700">Packing Progress</p>
          <p className="text-sm font-bold text-rose-500">{done}/{total}</p>
        </div>
        <div className="bg-rose-100 rounded-full h-3 overflow-hidden">
          <motion.div
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full"
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">{pct}% packed {pct === 100 ? "🎉 You're ready!" : ""}</p>
      </GlassCard>

      {CATS.map((cat) => (
        <div key={cat} className="mb-4">
          <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">
            {CAT_EMOJI[cat]} {cat}
          </p>
          <div className="space-y-2">
            {DEFAULT_ITEMS.filter((i) => i.cat === cat).map((item, idx) => (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggle(item.id)}
                className={`w-full glass rounded-2xl px-4 py-3 flex items-center gap-3 text-left transition ${checked[item.id] ? "opacity-60" : ""}`}
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-sm transition ${checked[item.id] ? "bg-green-400 text-white" : "border-2 border-gray-200"}`}>
                  {checked[item.id] ? "✓" : ""}
                </div>
                <p className={`text-sm ${checked[item.id] ? "line-through text-gray-400" : "text-gray-700"}`}>
                  {item.label}
                </p>
              </motion.button>
            ))}
          </div>
        </div>
      ))}
    </Layout>
  );
}
