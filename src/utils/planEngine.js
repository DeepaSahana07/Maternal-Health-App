const plans = {
  default: {
    food: ["Ragi porridge", "Moringa soup", "Jaggery & sesame balls"],
    activity: ["30 min gentle walk", "Prenatal stretching"],
    precautions: ["Avoid heavy lifting", "Stay hydrated (2L water)", "Rest after meals"],
  },
  early: { // weeks 1-12
    food: ["Folic acid-rich greens", "Lentil soup", "Fresh fruits"],
    activity: ["Light yoga", "Short walks"],
    precautions: ["Avoid raw fish", "No alcohol", "Take prenatal vitamins"],
  },
  mid: { // weeks 13-27
    food: ["Iron-rich spinach", "Calcium-rich ragi", "Protein dal"],
    activity: ["Swimming", "Prenatal yoga", "Walking 20 min"],
    precautions: ["Sleep on left side", "Avoid lying flat", "Monitor BP"],
  },
  late: { // weeks 28+
    food: ["Small frequent meals", "Dates for labor prep", "Coconut water"],
    activity: ["Pelvic floor exercises", "Gentle walking"],
    precautions: ["Track fetal movements", "Pack hospital bag", "Rest frequently"],
  },
};

export const getPlan = (week) => {
  if (week <= 12) return plans.early;
  if (week <= 27) return plans.mid;
  if (week >= 28) return plans.late;
  return plans.default;
};
