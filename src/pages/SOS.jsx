import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertOctagon, FiMapPin, FiMessageSquare, FiPhone, FiNavigation, FiClock } from "react-icons/fi";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";
import { load, KEYS } from "../utils/storage";
import { t } from "../utils/i18n";

export default function SOS() {
  const lang = load(KEYS.LANG, "en");
  const family = load(KEYS.FAMILY, []);
  const [countdown, setCountdown] = useState(null);
  const [location, setLocation] = useState(null);
  const [alertSent, setAlertSent] = useState(false);
  const [sentTo, setSentTo] = useState([]);
  const [timestamp, setTimestamp] = useState("");

  const sendSOS = useCallback(() => {
    const ts = new Date().toLocaleString();
    setTimestamp(ts);
    const contacts = family.length > 0 ? family.map((m) => m.name) : ["Emergency Contact"];
    setSentTo(contacts);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(5);
          const lng = pos.coords.longitude.toFixed(5);
          setLocation({ lat, lng });
          setAlertSent(true);
          window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
        },
        () => { setLocation({ lat: "N/A", lng: "N/A" }); setAlertSent(true); }
      );
    } else {
      setAlertSent(true);
    }
  }, [family]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((p) => p - 1), 1000);
      return () => clearTimeout(timer);
    } else { sendSOS(); }
  }, [countdown, sendSOS]);

  const reset = () => { setCountdown(null); setAlertSent(false); setSentTo([]); setLocation(null); setTimestamp(""); };

  return (
    <Layout noNav>
      <PageHeader title={t(lang, "sos")} subtitle="Tap to send emergency alert" icon={FiAlertOctagon} />

      <div className="flex flex-col items-center justify-center min-h-[55vh] gap-6">
        {/* SOS Button */}
        <div className="relative">
          <motion.div
            animate={countdown !== null && countdown > 0 ? { scale: [1, 1.2, 1], opacity: [0.4, 0.1, 0.4] } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute inset-0 bg-red-400 rounded-full"
          />
          <motion.button whileTap={{ scale: 0.93 }}
            onClick={() => { if (!alertSent) setCountdown(3); }}
            disabled={alertSent}
            className="relative w-44 h-44 bg-gradient-to-br from-red-500 to-rose-600 rounded-full text-white shadow-glass flex flex-col items-center justify-center z-10">
            <FiAlertOctagon className="text-4xl mb-1" />
            <span className="text-xl font-bold">SOS</span>
            {countdown !== null && countdown > 0 && <span className="text-4xl font-black mt-1">{countdown}</span>}
          </motion.button>
        </div>

        <AnimatePresence>
          {countdown !== null && countdown > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
              <p className="text-red-600 font-semibold">{t(lang, "sending")} {countdown}...</p>
              <button onClick={reset} className="text-xs text-gray-400 mt-1 underline">Cancel</button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {alertSent && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-3">
              <GlassCard className="border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <FiAlertOctagon className="text-red-500 text-lg" />
                  <p className="text-sm font-bold text-red-600">{t(lang, "alertSent")}</p>
                </div>
                {location && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <FiMapPin className="text-rose-400" />
                    <span>{location.lat}, {location.lng}</span>
                  </div>
                )}
                {timestamp && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <FiClock className="text-rose-400" />
                    <span>{timestamp}</span>
                  </div>
                )}
              </GlassCard>

              {/* Contacts notified */}
              <GlassCard>
                <p className="text-xs font-semibold text-gray-600 mb-2">Contacts Notified</p>
                <div className="space-y-2">
                  {sentTo.map((name, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-rose-100 rounded-xl flex items-center justify-center">
                          <span className="text-rose-500 text-xs font-bold">{name[0]}</span>
                        </div>
                        <span className="text-sm text-gray-700">{name}</span>
                      </div>
                      <div className="flex gap-1.5">
                        <div className="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                          <FiMessageSquare className="text-xs" /> SMS
                        </div>
                        <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                          <FiPhone className="text-xs" /> Call
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Simulated — integrates with Twilio in production</p>
              </GlassCard>

              <button onClick={reset} className="w-full text-center text-sm text-rose-500 font-semibold py-2">Reset</button>
            </motion.div>
          )}
        </AnimatePresence>

        {!alertSent && countdown === null && (
          <GlassCard className="w-full text-center">
            <p className="text-xs text-gray-500">
              Tap SOS to share your GPS location with {family.length > 0 ? `${family.length} family member(s)` : "emergency contacts"} and open Google Maps.
            </p>
          </GlassCard>
        )}
      </div>

      <GlassCard className="mt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FiNavigation className="text-rose-400" />
            <p className="text-sm font-semibold text-gray-700">{t(lang, "findHospital")}</p>
          </div>
          <button onClick={() => window.open("https://www.google.com/maps/search/hospital+near+me", "_blank")}
            className="bg-rose-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold">
            {t(lang, "openMaps")}
          </button>
        </div>
      </GlassCard>
    </Layout>
  );
}
