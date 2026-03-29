const HIGH = ["Bleeding", "Blurred Vision", "Severe Headache", "Chest Pain", "No Fetal Movement"];
const MEDIUM = ["Swelling", "Dizziness", "Nausea", "Back Pain", "Fever"];

export const analyzeSymptoms = (symptoms = []) => {
  const high = symptoms.filter((s) => HIGH.includes(s));
  const medium = symptoms.filter((s) => MEDIUM.includes(s));

  if (high.length > 0) {
    return {
      level: "HIGH",
      color: "red",
      reason: `Critical symptom(s) detected: ${high.join(", ")}`,
      action: "Go to the nearest hospital immediately. Call emergency services.",
      icon: "🚨",
    };
  }
  if (medium.length > 0) {
    return {
      level: "MEDIUM",
      color: "amber",
      reason: `Moderate symptom(s) detected: ${medium.join(", ")}`,
      action: "Contact your doctor within 24 hours and rest.",
      icon: "⚠️",
    };
  }
  if (symptoms.length > 0) {
    return {
      level: "LOW",
      color: "green",
      reason: "Mild symptoms — no immediate danger detected.",
      action: "Continue normal care, stay hydrated, and monitor.",
      icon: "✅",
    };
  }
  return null;
};

export const ALL_SYMPTOMS = [...HIGH, ...MEDIUM, "Fatigue", "Heartburn", "Leg Cramps"];
