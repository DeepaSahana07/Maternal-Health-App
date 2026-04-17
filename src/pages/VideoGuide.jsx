import { useRef, useEffect } from "react";
import { FiVideo, FiPlay } from "react-icons/fi";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";
import { load, KEYS } from "../utils/storage";
import { t } from "../utils/i18n";

// Pregnancy milestone data
const MILESTONES = [
  { week: 4, label: "Heart starts beating" },
  { week: 8, label: "All major organs forming" },
  { week: 12, label: "End of 1st trimester" },
  { week: 16, label: "Baby can hear sounds" },
  { week: 20, label: "Halfway point — anatomy scan" },
  { week: 24, label: "Viability milestone" },
  { week: 28, label: "3rd trimester begins" },
  { week: 32, label: "Baby practices breathing" },
  { week: 36, label: "Baby is full-term soon" },
  { week: 40, label: "Due date" },
];

export default function VideoGuide() {
  const lang = load(KEYS.LANG, "en");
  const profile = load(KEYS.PROFILE, {});
  const videoRef = useRef();
  const week = profile.week || 0;
  const month = profile.month || 0;
  const days = week * 7;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <Layout>
      <PageHeader title={t(lang, "videoTitle")} subtitle={t(lang, "videoSubtitle")} icon={FiVideo} />

      {/* Video Player */}
      <GlassCard className="mb-4 p-0 overflow-hidden">
        <div className="relative bg-black rounded-3xl overflow-hidden" style={{ aspectRatio: "16/9" }}>
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            controls
            poster=""
          >
            {/* Replace src with actual video path when available */}
            <source src="/pregnancy-guide.mp4" type="video/mp4" />
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rose-400 to-pink-500">
              <div className="text-center text-white">
                <FiPlay className="text-5xl mx-auto mb-2 opacity-80" />
                <p className="text-sm font-medium opacity-80">Pregnancy Guide Video</p>
                <p className="text-xs opacity-60 mt-1">Add video file to /public/pregnancy-guide.mp4</p>
              </div>
            </div>
          </video>
        </div>
      </GlassCard>

      {/* Dynamic Timeline */}
      {week > 0 && (
        <>
          <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">{t(lang, "timelineTitle")}</p>
          <div className="flex gap-3 mb-4">
            {[
              { label: t(lang, "days"), value: days, color: "from-rose-400 to-pink-400" },
              { label: t(lang, "weeks"), value: week, color: "from-purple-400 to-violet-400" },
              { label: t(lang, "month"), value: month, color: "from-sky-400 to-blue-400" },
            ].map((item, i) => (
              <GlassCard key={i} delay={i * 0.06} className="flex-1 text-center py-4">
                <p className="text-2xl font-bold text-gray-800">{item.value}</p>
                <p className="text-[10px] text-gray-400 font-medium">{item.label}</p>
              </GlassCard>
            ))}
          </div>

          {/* Progress bar */}
          <GlassCard className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 mb-2">
              <span>Week 1</span>
              <span className="font-semibold text-rose-500">Week {week}</span>
              <span>Week 40</span>
            </div>
            <div className="bg-rose-100 rounded-full h-3 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all"
                style={{ width: `${(week / 40) * 100}%` }} />
            </div>
            <p className="text-xs text-gray-400 mt-1 text-center">{Math.round((week / 40) * 100)}% of pregnancy complete</p>
          </GlassCard>
        </>
      )}

      {/* Milestones */}
      <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">Key Milestones</p>
      <div className="space-y-2">
        {MILESTONES.map((m, i) => {
          const passed = week >= m.week;
          const current = week > 0 && Math.abs(week - m.week) <= 2;
          return (
            <GlassCard key={i} delay={i * 0.03}
              className={`flex items-center gap-3 ${current ? "border border-rose-300" : ""}`}>
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                passed ? "bg-rose-500 text-white" : "bg-gray-100 text-gray-400"
              }`}>
                {m.week}w
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${passed ? "text-gray-800" : "text-gray-400"}`}>{m.label}</p>
              </div>
              {current && <span className="text-xs bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full font-medium">Now</span>}
              {passed && !current && <div className="w-4 h-4 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-white text-[8px]">✓</span>
              </div>}
            </GlassCard>
          );
        })}
      </div>
    </Layout>
  );
}
