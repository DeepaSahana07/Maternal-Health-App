import { useState } from "react";
import { motion } from "framer-motion";
import { FiPackage, FiPlus, FiCheck } from "react-icons/fi";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";
import { load, save, KEYS } from "../utils/storage";
import { t } from "../utils/i18n";

const DEFAULT_ITEMS = [
  { id: "d1", cat: "Documents", label: "Aadhar Card / ID Proof" },
  { id: "d2", cat: "Documents", label: "Hospital Registration Card" },
  { id: "d3", cat: "Documents", label: "Blood Group Certificate" },
  { id: "d4", cat: "Documents", label: "Insurance Papers" },
  { id: "b1", cat: "Baby", label: "Baby Clothes (3 sets)" },
  { id: "b2", cat: "Baby", label: "Diapers (1 pack)" },
  { id: "b3", cat: "Baby", label: "Baby Blanket" },
  { id: "b4", cat: "Baby", label: "Baby Cap & Socks" },
  { id: "m1", cat: "Mother", label: "Comfortable Nightwear" },
  { id: "m2", cat: "Mother", label: "Sanitary Pads (heavy flow)" },
  { id: "m3", cat: "Mother", label: "Nursing Bra" },
  { id: "m4", cat: "Mother", label: "Toiletries" },
  { id: "med1", cat: "Medical", label: "Prenatal Vitamins" },
  { id: "med2", cat: "Medical", label: "Doctor Contact Number" },
  { id: "med3", cat: "Medical", label: "Previous Scan Reports" },
];

const CATS = ["Documents", "Baby", "Mother", "Medical"];

export default function DeliveryKit() {
  const lang = load(KEYS.LANG, "en");
  const [checked, setChecked] = useState(() => load(KEYS.KIT, {}));
  const [customItems, setCustomItems] = useState(() => load(KEYS.KIT_CUSTOM, []));
  const [newItem, setNewItem] = useState("");
  const [newCat, setNewCat] = useState("Documents");

  const allItems = [...DEFAULT_ITEMS, ...customItems];
  const total = allItems.length;
  const done = allItems.filter((i) => checked[i.id]).length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const toggle = (id) => {
    const updated = { ...checked, [id]: !checked[id] };
    setChecked(updated);
    save(KEYS.KIT, updated);
  };

  const addCustom = () => {
    if (!newItem.trim()) return;
    const item = { id: `c_${Date.now()}`, cat: newCat, label: newItem.trim() };
    const updated = [...customItems, item];
    setCustomItems(updated);
    save(KEYS.KIT_CUSTOM, updated);
    setNewItem("");
  };

  return (
    <Layout>
      <PageHeader title={t(lang, "kit")} subtitle="Hospital bag checklist" icon={FiPackage} />

      {/* Progress */}
      <GlassCard className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-semibold text-gray-700">{t(lang, "packingProgress")}</p>
          <p className="text-sm font-bold text-rose-500">{done}/{total}</p>
        </div>
        <div className="bg-rose-100 rounded-full h-3 overflow-hidden">
          <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full" />
        </div>
        <p className="text-xs text-gray-400 mt-1">{pct}% {t(lang, "packed")} {pct === 100 ? "— Ready!" : ""}</p>
      </GlassCard>

      {/* Add Custom Item */}
      <GlassCard className="mb-4">
        <p className="text-xs font-semibold text-gray-500 mb-3">{t(lang, "addCustomItem")}</p>
        <div className="flex gap-2 flex-wrap mb-2">
          {CATS.map((c) => (
            <button key={c} onClick={() => setNewCat(c)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition ${newCat === c ? "bg-rose-500 text-white" : "glass text-gray-500"}`}>
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={newItem} onChange={(e) => setNewItem(e.target.value)}
            placeholder={t(lang, "customItemPlaceholder")}
            onKeyDown={(e) => e.key === "Enter" && addCustom()}
            className="flex-1 glass rounded-2xl px-3 py-2.5 text-sm text-gray-700 placeholder-gray-300 outline-none focus:ring-2 focus:ring-rose-300" />
          <button onClick={addCustom}
            className="w-10 h-10 bg-rose-500 text-white rounded-2xl flex items-center justify-center shadow-card">
            <FiPlus className="text-lg" />
          </button>
        </div>
      </GlassCard>

      {/* Items by Category */}
      {CATS.map((cat) => {
        const items = allItems.filter((i) => i.cat === cat);
        if (!items.length) return null;
        return (
          <div key={cat} className="mb-4">
            <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">{cat}</p>
            <div className="space-y-2">
              {items.map((item, idx) => (
                <motion.button key={item.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }} whileTap={{ scale: 0.98 }}
                  onClick={() => toggle(item.id)}
                  className={`w-full glass rounded-2xl px-4 py-3 flex items-center gap-3 text-left transition ${checked[item.id] ? "opacity-60" : ""}`}>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition flex-shrink-0 ${checked[item.id] ? "bg-green-400 text-white" : "border-2 border-gray-200"}`}>
                    {checked[item.id] && <FiCheck className="text-xs" />}
                  </div>
                  <p className={`text-sm ${checked[item.id] ? "line-through text-gray-400" : "text-gray-700"}`}>
                    {item.label}
                  </p>
                  {item.id.startsWith("c_") && (
                    <span className="ml-auto text-[10px] text-rose-400 font-medium">custom</span>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        );
      })}
    </Layout>
  );
}
