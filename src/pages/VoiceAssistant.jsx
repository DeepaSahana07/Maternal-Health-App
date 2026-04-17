import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMic, FiMicOff, FiVolume2, FiMessageCircle,
  FiAlertCircle, FiCheckCircle, FiAlertTriangle,
  FiSend, FiLoader, FiGlobe,
} from "react-icons/fi";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";
import { LANGUAGES, t } from "../utils/i18n";
import { load, KEYS } from "../utils/storage";
import {
  translateText, textToSpeech, playBase64Audio,
  speakText, detectSymptomsFromText, LANG_CODES,
} from "../utils/sarvamAI";
import { analyzeSymptoms } from "../utils/triageEngine";

const RISK_ICON = { HIGH: FiAlertCircle, MEDIUM: FiAlertTriangle, LOW: FiCheckCircle };
const RISK_COLOR = {
  HIGH: "from-red-500 to-rose-500",
  MEDIUM: "from-amber-400 to-orange-400",
  LOW: "from-green-400 to-emerald-400",
};

// Dynamic response builder natively handling multiple languages
function buildResponse(input, symptoms, risk, profile, lang) {
  const week = profile?.week || 0;

  if (lang === "hi") {
    if (risk?.level === "HIGH") return `मैंने गंभीर लक्षण पाए हैं: ${symptoms.join(", ")}. यह उच्च जोखिम है। कृपया तुरंत डॉक्टर से संपर्क करें।`;
    if (risk?.level === "MEDIUM") return `मैंने देखा: ${symptoms.join(", ")}. कृपया निगरानी रखें और डॉक्टर से संपर्क करें।`;
    if (symptoms.length > 0) return `मैंने ${symptoms.join(", ")} के बारे में सुना। सामान्य देखभाल जारी रखें।`;
    return "मैं आपकी गर्भावस्था यात्रा में मदद के लिए यहां हूं। आप लक्षण, पोषण या व्यायाम के बारे में पूछ सकते हैं।";
  }

  if (lang === "ta") {
    if (risk?.level === "HIGH") return `கடுமையான அறிகுறிகள்: ${symptoms.join(", ")}. இது அதிக ஆபத்து. உடனடியாக மருத்துவரை அணுகவும்.`;
    if (risk?.level === "MEDIUM") return `கவனிக்கப்பட்டவை: ${symptoms.join(", ")}. கண்காணிக்கவும், மருத்துவரை அழைக்கவும்.`;
    if (symptoms.length > 0) return `${symptoms.join(", ")} பற்றி கேட்டேன். சாதாரண பராமரிப்பை தொடரவும்.`;
    return "உங்கள் கர்ப்பப் பயணத்தில் உதவ நான் இங்கே இருக்கிறேன். அறிகுறிகள் அல்லது ஊட்டச்சத்து பற்றி கேட்கலாம்.";
  }

  // English fallback
  if (risk?.level === "HIGH") return `I detected serious symptoms: ${symptoms.join(", ")}. This is HIGH risk. Please seek medical help immediately.`;
  if (risk?.level === "MEDIUM") return `I noticed: ${symptoms.join(", ")}. Please monitor closely and contact your doctor.`;
  if (symptoms.length > 0) return `I heard about ${symptoms.join(", ")}. Continue normal care.`;

  const lower = input.toLowerCase();
  if (lower.includes("week") || lower.includes("month")) {
    return week > 0
      ? `You are currently at week ${week}. ${40 - week} weeks remaining. Your baby is growing well!`
      : "Please update your pregnancy week in Settings.";
  }
  if (lower.includes("food") || lower.includes("eat")) return "Focus on iron-rich foods like spinach, calcium from ragi, and protein. Avoid raw papaya.";
  if (lower.includes("exercise") || lower.includes("walk")) return "Gentle walking and prenatal yoga are excellent during pregnancy.";
  
  return "I'm here to help with your pregnancy journey. You can ask me about symptoms, nutrition, exercise, or any concerns you have.";
}

export default function VoiceAssistant() {
  const lang = load(KEYS.LANG, "en");
  const profile = load(KEYS.PROFILE, {});
  const [activeLang, setActiveLang] = useState(lang);
  const [messages, setMessages] = useState([
    { id: 1, role: "ai", text: t(lang, "tapToSpeak"), risk: null },
  ]);
  const [listening, setListening] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [showLangPicker, setShowLangPicker] = useState(false);
  const recogRef = useRef(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = useCallback((msg) =>
    setMessages((p) => [...p, { id: Date.now() + Math.random(), ...msg }]), []);

  const processInput = useCallback(async (spokenText, inputLang) => {
    setProcessing(true);
    addMessage({ role: "user", text: spokenText, lang: inputLang });

    try {
      const symptoms = detectSymptomsFromText(spokenText);
      const risk = symptoms.length > 0 ? analyzeSymptoms(symptoms) : null;

      const responseFinal = buildResponse(spokenText, symptoms, risk, profile, inputLang);
      addMessage({ role: "ai", text: responseFinal, risk, symptoms });
      
      speakText(responseFinal, LANG_CODES[inputLang] || "en-IN");
    } catch {
      addMessage({ role: "ai", text: "Sorry, I had trouble processing that. Please try again." });
    } finally {
      setProcessing(false);
    }
  }, [addMessage, profile]);

  const handleVoiceInput = () => {
    if (listening) {
      recogRef.current?.stop();
      setListening(false);
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      addMessage({ role: "ai", text: "Voice not supported in this browser. Please use the text input below." });
      inputRef.current?.focus();
      return;
    }

    const r = new SR();
    r.lang = LANG_CODES[activeLang] || "en-IN";
    r.continuous = false;
    r.interimResults = false;
    recogRef.current = r;

    r.onstart = () => { setListening(true); };

    r.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setListening(false);
      processInput(text, activeLang);
    };

    r.onerror = (e) => {
      setListening(false);
      console.error("Speech API Error:", e.error);
      if (e.error === "no-speech") {
        addMessage({ role: "ai", text: "I didn't catch that. Please try speaking again." });
        return;
      }
      const msg = e.error === "not-allowed"
        ? "Microphone access denied. Please allow microphone in browser settings."
        : `Voice recognition error: ${e.error}. Please ensure you are online or try text input.`;
      addMessage({ role: "ai", text: msg });
    };

    r.onend = () => setListening(false);

    try { r.start(); } catch {
      setListening(false);
      addMessage({ role: "ai", text: "Could not start voice recognition. Please use text input." });
    }
  };

  const handleTextSend = () => {
    const text = textInput.trim();
    if (!text || processing) return;
    setTextInput("");
    processInput(text, activeLang);
  };

  const speakMessage = (text) => {
    speakText(text, LANG_CODES[activeLang] || "en-IN");
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-2">
        <PageHeader title={t(lang, "assistant")} subtitle="Multilingual AI companion" icon={FiMic} />
        <button onClick={() => setShowLangPicker(!showLangPicker)}
          className="w-9 h-9 glass rounded-2xl flex items-center justify-center shadow-card mb-6">
          <FiGlobe className="text-rose-500 text-base" />
        </button>
      </div>

      {/* Language Picker */}
      <AnimatePresence>
        {showLangPicker && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-3">
            <div className="flex gap-1.5 flex-wrap pb-1">
              {LANGUAGES.map((l) => (
                <button key={l.code} onClick={() => { setActiveLang(l.code); setShowLangPicker(false); }}
                  className={`px-3 py-1.5 rounded-2xl text-xs font-medium transition flex-shrink-0 ${
                    activeLang === l.code ? "bg-rose-500 text-white shadow-card" : "glass text-gray-500"
                  }`}>
                  {l.flag} {l.native}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active language indicator */}
      <div className="flex items-center gap-2 mb-3">
        <div className="glass rounded-2xl px-3 py-1.5 flex items-center gap-1.5">
          <span className="text-xs text-gray-500">Speaking in:</span>
          <span className="text-xs font-semibold text-rose-500">
            {LANGUAGES.find((l) => l.code === activeLang)?.native || "English"}
          </span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="space-y-3 mb-4 min-h-[45vh] max-h-[50vh] overflow-y-auto no-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div key={msg.id}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "ai" ? (
                <div className="max-w-[85%]">
                  <div className="glass rounded-3xl rounded-tl-lg p-4 shadow-card">
                    <div className="flex items-start gap-2">
                      <div className="w-7 h-7 bg-gradient-to-br from-rose-400 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FiMessageCircle className="text-white text-xs" />
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed flex-1">{msg.text}</p>
                      <button onClick={() => speakMessage(msg.text)}
                        className="w-7 h-7 bg-rose-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <FiVolume2 className="text-rose-400 text-xs" />
                      </button>
                    </div>
                    {msg.risk && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                        className={`mt-3 bg-gradient-to-br ${RISK_COLOR[msg.risk.level]} rounded-2xl p-3 text-white`}>
                        <div className="flex items-center gap-2 mb-1">
                          {(() => { const Icon = RISK_ICON[msg.risk.level]; return <Icon className="text-base" />; })()}
                          <span className="text-xs font-bold">{msg.risk.level} RISK</span>
                        </div>
                        <p className="text-xs opacity-90">{msg.risk.action}</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="max-w-[75%] bg-gradient-to-br from-rose-400 to-pink-500 rounded-3xl rounded-tr-lg px-4 py-3 shadow-card">
                  <p className="text-sm text-white">{msg.text}</p>
                  <p className="text-[10px] text-white/60 mt-0.5">
                    {LANGUAGES.find((l) => l.code === msg.lang)?.native || ""}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {processing && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="glass rounded-3xl rounded-tl-lg px-4 py-3 flex items-center gap-2">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                <FiLoader className="text-rose-400 text-sm" />
              </motion.div>
              <span className="text-xs text-gray-400">{t(lang, "processing")}</span>
            </div>
          </motion.div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="space-y-3">
        {/* Text Input */}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleTextSend()}
            placeholder={t(lang, "typeMessage")}
            className="flex-1 glass rounded-2xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 outline-none focus:ring-2 focus:ring-rose-300"
          />
          <motion.button whileTap={{ scale: 0.93 }} onClick={handleTextSend}
            disabled={!textInput.trim() || processing}
            className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-card disabled:opacity-40">
            <FiSend className="text-white text-base" />
          </motion.button>
        </div>

        {/* Mic Button */}
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            {listening && (
              <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="absolute inset-0 bg-rose-400 rounded-full" />
            )}
            <motion.button whileTap={{ scale: 0.93 }} onClick={handleVoiceInput} disabled={processing}
              className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-glass z-10 ${
                listening ? "bg-gradient-to-br from-red-500 to-rose-600" : "bg-gradient-to-br from-rose-400 to-pink-500"
              } ${processing ? "opacity-50" : ""}`}>
              {listening ? <FiMicOff className="text-white text-xl" /> : <FiMic className="text-white text-xl" />}
            </motion.button>
          </div>
          <GlassCard className="flex-1 py-2">
            <p className="text-xs text-gray-500 text-center">
              {listening ? t(lang, "listening") : processing ? t(lang, "processing") : t(lang, "tapToSpeak")}
            </p>
          </GlassCard>
        </div>
      </div>
    </Layout>
  );
}
