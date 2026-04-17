// Mock API implementation for Nutrition Vision & Benefits
// In a real app, this would hit Edamam or Cloud Vision API

export async function analyzeFoodImageBase64(base64Data) {
  // Simulate network delay
  await new Promise(r => setTimeout(r, 1500));
  
  // Use length of base64 to pseudo-randomize determination consistently for the same image
  const hash = base64Data.length;
  
  if (hash % 3 === 0) {
    return {
      safe: true,
      name: "Green Leafy Vegetable / Spinach",
      benefit: "Rich in folate and iron. Prevents anemia and supports neural tube development.",
      nutrients: "Folate 194mcg, Iron 2.7mg, Vitamin C 28mg per 100g"
    };
  } else if (hash % 3 === 1) {
    return {
      safe: false,
      name: "Raw Papaya / Processed Food",
      benefit: "Contains compounds that can trigger contractions or excess sodium.",
      nutrients: "High in sodium or latex compounds — avoid during pregnancy."
    };
  } else {
    return {
      safe: true,
      name: "Dal / Lentils / Grains",
      benefit: "Excellent source of complete protein, fiber, and complex carbohydrates.",
      nutrients: "Protein 9g, Folate 181mcg, Iron 3.3mg per 100g"
    };
  }
}

export function getSymptomBasedFoods(symptoms = []) {
  const recommendations = [];
  const add = (food) => { if (!recommendations.some(f => f.name === food.name)) recommendations.push(food); };

  if (symptoms.includes("Nausea") || symptoms.includes("उल्टी")) {
    add({ name: "Ginger Tea", benefit: "Clinically proven to reduce nausea and morning sickness.", tag: "Soothes Stomach" });
    add({ name: "Crackers", benefit: "Easily digestible carbs settle the stomach.", tag: "Energy" });
  }
  if (symptoms.includes("Swelling") || symptoms.includes("सूजन")) {
    add({ name: "Watermelon", benefit: "Natural diuretic, helps flush out excess fluids.", tag: "Hydration" });
    add({ name: "Cucumber", benefit: "High water content reduces edema.", tag: "Cooling" });
  }
  if (symptoms.includes("Fatigue") || symptoms.includes("थकान")) {
    add({ name: "Dates", benefit: "Rich in natural sugars and iron for instant energy.", tag: "Iron" });
  }
  if (symptoms.includes("Leg Cramps") || symptoms.includes("ऐंठन")) {
    add({ name: "Banana", benefit: "High in potassium to stop muscle cramps.", tag: "Potassium" });
  }
  if (symptoms.includes("Heartburn") || symptoms.includes("जलन")) {
    add({ name: "Cold Milk", benefit: "Neutralizes stomach acid instantly.", tag: "Calcium" });
    add({ name: "Almonds", benefit: "Alkaline nuts help balance stomach acids.", tag: "Protein" });
  }
  
  return recommendations;
}