import { motion } from "framer-motion";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";

const areas = [
  { name: "Your Area", risk: "HIGH", cases: 12, color: "from-red-500 to-rose-500", pulse: true },
  { name: "District Hospital Zone", risk: "MEDIUM", cases: 6, color: "from-amber-400 to-orange-400", pulse: false },
  { name: "Urban Health Center", risk: "LOW", cases: 2, color: "from-green-400 to-emerald-400", pulse: false },
  { name: "Rural Outpost", risk: "HIGH", cases: 9, color: "from-red-400 to-rose-400", pulse: true },
];

const tips = [
  "🏥 Nearest hospital: 3.2 km away",
  "🚑 Emergency response time: ~12 min",
  "👩⚕️ 2 ANM workers active in your area",
  "📊 Maternal risk index: Moderate",
];

export default function RiskMap() {
  return (
    <Layout>
      <PageHeader title="Risk Heatmap" subtitle="Community maternal health overview" emoji="🗺️" />

      <GlassCard className="mb-4">
        <p className="text-xs font-semibold text-gray-500 mb-1">⚠️ Demo Mode</p>
        <p className="text-xs text-gray-400">In production, this integrates with real-time health worker data and government APIs.</p>
      </GlassCard>

      {/* Map Placeholder */}
      <div className="relative bg-gradient-to-br from-rose-100 to-purple-100 rounded-3xl h-44 mb-4 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-20">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute border border-rose-300 rounded-full"
              style={{ width: `${(i + 1) * 60}px`, height: `${(i + 1) * 60}px`, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
          ))}
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.4, 0.8] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-6 bg-red-500 rounded-full shadow-lg z-10"
        />
        <p className="absolute bottom-3 text-xs text-gray-400">📍 Your location (simulated)</p>
      </div>

      {/* Area Cards */}
      <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Area Risk Levels</p>
      <div className="space-y-3 mb-4">
        {areas.map((a, i) => (
          <GlassCard key={i} delay={i * 0.06}>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className={`w-10 h-10 bg-gradient-to-br ${a.color} rounded-2xl flex items-center justify-center text-white text-xs font-bold`}>
                  {a.risk[0]}
                </div>
                {a.pulse && (
                  <motion.div
                    animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="absolute inset-0 bg-red-400 rounded-2xl"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{a.name}</p>
                <p className="text-xs text-gray-400">{a.cases} high-risk cases reported</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-xl ${
                a.risk === "HIGH" ? "bg-red-100 text-red-600" :
                a.risk === "MEDIUM" ? "bg-amber-100 text-amber-600" : "bg-green-100 text-green-600"
              }`}>{a.risk}</span>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Tips */}
      <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Local Intelligence</p>
      <div className="space-y-2">
        {tips.map((tip, i) => (
          <GlassCard key={i} delay={i * 0.05}>
            <p className="text-sm text-gray-600">{tip}</p>
          </GlassCard>
        ))}
      </div>
    </Layout>
  );
}
