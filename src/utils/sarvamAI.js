export const LANG_CODES = {
  en: "en-IN",
  hi: "hi-IN",
  ta: "ta-IN",
  te: "te-IN",
  kn: "kn-IN",
  ml: "ml-IN",
  mr: "mr-IN",
  bn: "bn-IN",
  gu: "gu-IN",
  pa: "pa-IN",
};

export async function translateText(text, sourceLang = "hi", targetLang = "en") {
  return text; 
}

export async function speechToText(audioBlob, lang = "hi") {
  return null; 
}

export async function textToSpeech(text, lang = "hi") {
  return null; 
}

export function playBase64Audio(base64Audio) {}

export function speakText(text, lang = "en-IN") {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = lang;
  utt.rate = 0.9;
  window.speechSynthesis.speak(utt);
}

export function detectSymptomsFromText(text) {
  const lower = text.toLowerCase();
  const map = {
    // Severe Headache
    "headache": "Severe Headache", "सिरदर्द": "Severe Headache", "தலைவலி": "Severe Headache",
    "thala": "Severe Headache", "thala vali": "Severe Headache", "sir dard": "Severe Headache", "valikuthu": "Severe Headache",
    
    // Bleeding
    "bleed": "Bleeding", "खून": "Bleeding", "ரத்தம்": "Bleeding", "blood": "Bleeding", "khoon": "Bleeding", "ratham": "Bleeding",
    
    // Blurred Vision
    "vision": "Blurred Vision", "blur": "Blurred Vision", "धुंधला": "Blurred Vision", "mangal": "Blurred Vision", 
    
    // Swelling
    "swell": "Swelling", "सूजन": "Swelling", "வீக்கம்": "Swelling", "sujan": "Swelling", "veekam": "Swelling",
    
    // Dizziness
    "dizzy": "Dizziness", "चक्कर": "Dizziness", "மயக்கம்": "Dizziness", "chakkar": "Dizziness", "mayakkam": "Dizziness",
    
    // Nausea
    "nausea": "Nausea", "vomit": "Nausea", "उल्टी": "Nausea", "வாந்தி": "Nausea", "ulti": "Nausea", "vanthi": "Nausea",
    
    // Back Pain
    "back pain": "Back Pain", "कमर दर्द": "Back Pain", "முதுகு வலி": "Back Pain", "kamar": "Back Pain", "mudugu": "Back Pain",
    
    // Fever
    "fever": "Fever", "बुखार": "Fever", "காய்ச்சல்": "Fever", "bukhar": "Fever", "kaichal": "Fever", "jwaram": "Fever",
    
    // Chest Pain
    "chest": "Chest Pain", "छाती": "Chest Pain", "நெஞ்சு": "Chest Pain", "chhati": "Chest Pain", "nenju": "Chest Pain",
    
    // Movement
    "movement": "No Fetal Movement", "not moving": "No Fetal Movement", "हलचल": "No Fetal Movement", "நகரவில்லை": "No Fetal Movement", "halchal": "No Fetal Movement", "asaiyavillai": "No Fetal Movement",
    
    // Fatigue
    "fatigue": "Fatigue", "tired": "Fatigue", "थकान": "Fatigue", "சோர்வு": "Fatigue", "thakan": "Fatigue", "sorvu": "Fatigue",
    
    // Heartburn
    "heartburn": "Heartburn", "जलन": "Heartburn", "நெஞ்செரிச்சல்": "Heartburn", "jalan": "Heartburn", "erichal": "Heartburn",
    
    // Leg Cramps
    "cramp": "Leg Cramps", "ऐंठन": "Leg Cramps", "தசைப்பிடிப்பு": "Leg Cramps", "ainthan": "Leg Cramps", "pudippu": "Leg Cramps", "pain": "Pain"
  };
  const found = [];
  for (const [keyword, symptom] of Object.entries(map)) {
    if (lower.includes(keyword) && !found.includes(symptom)) found.push(symptom);
  }
  return found;
}
