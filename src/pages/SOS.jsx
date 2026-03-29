import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";

export default function SOS() {
  const [countdown, setCountdown] = useState(null);
  const [location, setLocation] = useState(null);
  const [alertSent, setAlertSent] = useState(false);
  const [smsSent, setSmsSent] = useState(false);

  const sendSOS = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(5);
          const lng = pos.coords.longitude.toFixed(5);
          setLocation({ lat, lng });
          setAlertSent(true);
          setSmsSent(true);
          window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
        },
        () => {
          setLocation({ lat: "N/A", lng: "N/A" });
          setAlertSent(true);
          setSmsSent(true);
        }
      );
    } else {
      setAlertSent(true);
      setSmsSent(true);
    }
  }, []);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown > 0) {
      const t = setTimeout(() => setCountdown((p) => p - 1), 1000);
      return () => clearTimeout(t);
    } else {
      sendSOS();
    }
  }, [countdown, sendSOS]);

  const reset = () => { setCountdown(null); setAlertSent(false); setSmsSent(false); setLocation(null); };

  return (
    <Layout noNav>
      <PageHeader title="SOS Emergency" subtitle="Tap to send emergency alert" emoji="🚨" />

      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        {/* SOS Button */}
        <div className="relative">
          <motion.div
            animate={countdown !== null && countdown > 0 ? { scale: [1, 1.15, 1], opacity: [0.4, 0.1, 0.4] } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
            className="absolute inset-0 bg-red-400 rounded-full"
          />
          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={() => { if (!alertSent) setCountdown(3); }}
            disabled={alertSent}
            className="relative w-44 h-44 bg-gradient-to-br from-red-500 to-rose-600 rounded-full text-white shadow-glass flex flex-col items-center justify-center z-10"
          >
            <span className="text-4xl">🆘</span>
            <span className="text-xl font-bold mt-1">SOS</span>
            {countdown !== null && countdown > 0 && (
              <span className="text-4xl font-black mt-1">{countdown}</span>
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {countdown !== null && countdown > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center">
              <p className="text-red-600 font-semibold">Sending emergency alert in {countdown}...</p>
              <button onClick={reset} className="text-xs text-gray-400 mt-1 underline">Cancel</button>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {alertSent && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full space-y-3">
              <GlassCard className="border border-red-200">
                <p className="text-sm font-bold text-red-600 mb-2">🚨 Emergency Alert Sent!</p>
                {location && (
                  <p className="text-xs text-gray-500">📍 Location: {location.lat}, {location.lng}</p>
                )}
              </GlassCard>
              {smsSent && (
                <GlassCard>
                  <p className="text-xs text-gray-600">📱 <span className="font-semibold">SMS Simulated</span> — Alert sent to emergency contacts</p>
                  <p className="text-xs text-gray-400 mt-1">In production, this integrates with Twilio / local SMS gateway</p>
                </GlassCard>
              )}
              <button onClick={reset} className="w-full text-center text-sm text-rose-500 font-semibold py-2">Reset</button>
            </motion.div>
          )}
        </AnimatePresence>

        {!alertSent && countdown === null && (
          <GlassCard className="w-full text-center">
            <p className="text-xs text-gray-500">Hold the SOS button to send your GPS location to emergency contacts and open Google Maps.</p>
          </GlassCard>
        )}
      </div>

      {/* Hospital Search */}
      <GlassCard className="mt-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">🏥 Find Nearest Hospital</p>
          <button
            onClick={() => window.open("https://www.google.com/maps/search/hospital+near+me", "_blank")}
            className="bg-rose-500 text-white px-3 py-1.5 rounded-xl text-xs font-semibold"
          >
            Open Maps
          </button>
        </div>
      </GlassCard>
    </Layout>
  );
}
