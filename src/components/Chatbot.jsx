import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageCircle, FiX, FiSend, FiMic, FiMicOff } from "react-icons/fi";
import { load, KEYS } from "../utils/storage";
import { t } from "../utils/i18n";
import { detectSymptomsFromText, speakText, LANG_CODES } from "../utils/sarvamAI";
import { analyzeSymptoms } from "../utils/triageEngine";

function buildResponse(input, symptoms, risk, profile, lang) {
  const week = profile?.week || 0;
  if (lang === "hi") {
    if (risk?.level === "HIGH") return `मैंने गंभीर लक्षण पाए हैं: ${symptoms.join(", ")}। यह उच्च जोखिम है।`;
    if (risk?.level === "MEDIUM") return `मैंने देखा: ${symptoms.join(", ")}। कृपया निगरानी रखें।`;
    if (symptoms.length > 0) return `मैंने ${symptoms.join(", ")} के बारे में सुना।`;
    return "मैं आपकी मदद के लिए यहां हूं।";
  }
  if (lang === "ta") {
    if (risk?.level === "HIGH") return `கடுமையான அறிகுறிகள்: ${symptoms.join(", ")}. இது அதிக ஆபத்து.`;
    if (risk?.level === "MEDIUM") return `கவனிக்கப்பட்டவை: ${symptoms.join(", ")}. கண்காணிக்கவும்.`;
    if (symptoms.length > 0) return `${symptoms.join(", ")} பற்றி கேட்டேன்.`;
    return "நான் உதவ இங்கே இருக்கிறேன்.";
  }
  if (risk?.level === "HIGH") return `Detected serious symptoms: ${symptoms.join(", ")}. HIGH risk.`;
  if (risk?.level === "MEDIUM") return `Noticed: ${symptoms.join(", ")}. Monitor closely.`;
  if (symptoms.length > 0) return `I heard about ${symptoms.join(", ")}.`;
  
  const lower = input.toLowerCase();
  if (lower.includes("week") || lower.includes("month")) {
    return week > 0 ? `You are at week ${week}.` : "Please update your pregnancy week.";
  }
  if (lower.includes("food")) return "Focus on iron-rich foods, calcium, and protein.";
  return "I'm here to help. You can ask me anything about your pregnancy.";
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const lang = load(KEYS.LANG, "en");
  const profile = load(KEYS.PROFILE, {});
  const [messages, setMessages] = useState([{ id: 1, role: "ai", text: t(lang, "tapToSpeak") }]);
  const [input, setInput] = useState("");
  const [listening, setListening] = useState(false);
  const recogRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);

  const addMsg = (msg) => setMessages((p) => [...p, { id: Date.now() + Math.random(), ...msg }]);

  const processInput = (text) => {
    addMsg({ role: "user", text });
    const symptoms = detectSymptomsFromText(text);
    const risk = symptoms.length > 0 ? analyzeSymptoms(symptoms) : null;
    const response = buildResponse(text, symptoms, risk, profile, lang);
    setTimeout(() => {
      addMsg({ role: "ai", text: response });
      speakText(response, LANG_CODES[lang] || "en-IN");
    }, 500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const txt = input.trim();
    setInput("");
    processInput(txt);
  };

  const handleVoice = () => {
    if (listening) {
      recogRef.current?.stop();
      setListening(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Voice not supported");
    const r = new SR();
    r.lang = LANG_CODES[lang] || "en-IN";
    r.onstart = () => setListening(true);
    r.onresult = (e) => {
      setListening(false);
      processInput(e.results[0][0].transcript);
    };
    r.onerror = (e) => {
      setListening(false);
      console.error("Chatbot Speech API Error:", e.error);
      if (e.error === "no-speech") {
        addMsg({ role: "ai", text: "I didn't catch that. Please speak again." });
      } else {
        addMsg({ role: "ai", text: `Voice error (${e.error}). Please type.` });
      }
    };
    r.onend = () => setListening(false);
    recogRef.current = r;
    r.start();
  };

  return (
    <>
      <button 
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-4 w-12 h-12 bg-rose-500 rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(244,63,94,0.4)] text-white z-40 transition-transform active:scale-95 hover:bg-rose-600"
      >
        {open ? <FiX size={20} /> : <FiMessageCircle size={24} />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-36 right-4 w-72 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col border border-rose-100/50"
            style={{ maxHeight: "60vh" }}
          >
            <div className="bg-gradient-to-r from-rose-400 to-pink-500 py-2.5 px-4 flex justify-between items-center shadow-sm">
              <span className="text-white font-semibold text-xs tracking-wide">Mama AI</span>
            </div>
            
            <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-slate-50">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-2.5 px-3.5 rounded-2xl text-xs max-w-[85%] shadow-sm ${m.role === 'user' ? 'bg-rose-500 text-white rounded-br-none' : 'bg-white border text-gray-700 rounded-bl-none'}`}>
                    {m.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="p-2 bg-white border-t border-gray-100 flex items-center gap-1.5 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
              <button 
                onClick={handleVoice}
                className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${listening ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-500 hover:bg-rose-100'}`}
              >
                {listening ? <FiMicOff size={16} /> : <FiMic size={16} />}
              </button>
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={t(lang, "typeMessage")}
                className="flex-1 text-xs bg-gray-50/50 border border-gray-100 rounded-full px-3 py-2 outline-none focus:ring-1 focus:ring-rose-300"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 transition-opacity"
              >
                <FiSend size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
