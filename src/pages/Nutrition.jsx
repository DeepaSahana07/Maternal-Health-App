import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiShoppingBag, FiUpload, FiCheckCircle, FiXCircle } from "react-icons/fi";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";
import GlassCard from "../components/GlassCard";
import { load, KEYS } from "../utils/storage";
import { t } from "../utils/i18n";
import { analyzeFoodImageBase64, getSymptomBasedFoods } from "../services/nutritionService";

const NUTRITION_BY_MONTH = {
  1: {
    safe: [
      { name: "Moringa (Drumstick)", benefit: "25x more iron than spinach. Boosts hemoglobin.", tag: "Iron" },
      { name: "Lentils (Dal)", benefit: "Complete protein + folate for neural development.", tag: "Protein" },
      { name: "Folic acid greens", benefit: "Prevents neural tube defects.", tag: "Folate" },
    ],
    avoid: ["Papaya", "Pineapple", "Raw eggs", "Alcohol"],
  },
  3: {
    safe: [
      { name: "Ragi (Finger Millet)", benefit: "Highest calcium among cereals. Strengthens bones.", tag: "Calcium" },
      { name: "Spinach", benefit: "Rich in iron & folate. Prevents anemia.", tag: "Iron" },
      { name: "Banana", benefit: "Instant energy, potassium, reduces cramps.", tag: "Energy" },
    ],
    avoid: ["High-mercury fish", "Excess salt", "Junk food"],
  },
  6: {
    safe: [
      { name: "Jaggery (Gur)", benefit: "Natural iron + energy. Better than refined sugar.", tag: "Iron" },
      { name: "Dates", benefit: "Natural iron source. Aids labor preparation.", tag: "Iron" },
      { name: "Coconut water", benefit: "Electrolytes, hydration, reduces fatigue.", tag: "Hydration" },
    ],
    avoid: ["Raw shellfish", "Excess caffeine", "Unpasteurized dairy"],
  },
  9: {
    safe: [
      { name: "Dates", benefit: "Helps ripen cervix, reduces labor time.", tag: "Labor Prep" },
      { name: "Coconut water", benefit: "Hydration and electrolytes for labor.", tag: "Hydration" },
      { name: "Light soups", benefit: "Easy to digest, keeps energy up.", tag: "Energy" },
    ],
    avoid: ["Heavy meals", "Excess spice", "Gas-causing foods"],
  },
};

const getNutritionForMonth = (month) => {
  const keys = Object.keys(NUTRITION_BY_MONTH).map(Number).sort((a, b) => a - b);
  const closest = keys.reduce((prev, curr) => (Math.abs(curr - month) < Math.abs(prev - month) ? curr : prev));
  return NUTRITION_BY_MONTH[closest];
};

// Simulated food analysis results
const FOOD_ANALYSIS = [
  { safe: true, name: "Ragi Porridge", benefit: "High calcium, iron, and fiber. Excellent for pregnancy.", nutrients: "Calcium 344mg, Iron 3.9mg, Protein 7.3g per 100g" },
  { safe: true, name: "Spinach Curry", benefit: "Rich in folate and iron. Prevents anemia.", nutrients: "Folate 194mcg, Iron 2.7mg, Vitamin C 28mg per 100g" },
  { safe: false, name: "Raw Papaya", benefit: "Contains latex that can trigger contractions.", nutrients: "Avoid during pregnancy — especially raw/unripe" },
  { safe: true, name: "Dal (Lentils)", benefit: "Complete protein and folate source.", nutrients: "Protein 9g, Folate 181mcg, Iron 3.3mg per 100g" },
];

export default function Nutrition() {
  const lang = load(KEYS.LANG, "en");
  const profile = load(KEYS.PROFILE, {});
  // Use recent logged symptoms if any, or default to some common ones to showcase dynamic UI
  const recentSymptoms = load("mh_symptoms", ["Nausea", "Fatigue"]); 
  const month = profile.month || 3;
  const nutrition = getNutritionForMonth(month);
  const symptomFoods = getSymptomBasedFoods(recentSymptoms);
  
  const [foodAnalysis, setFoodAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [foodPreview, setFoodPreview] = useState(null);
  const fileRef = useRef();

  const handleFoodUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFoodPreview(ev.target.result);
      setAnalyzing(true);
      analyzeFoodImageBase64(ev.target.result).then((result) => {
        setFoodAnalysis(result);
        setAnalyzing(false);
      });
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <Layout>
      <PageHeader title={t(lang, "nutrition")} subtitle={`${t(lang, "month")} ${month} recommendations`} icon={FiShoppingBag} />

      {/* Food Image Analyzer */}
      <GlassCard className="mb-4">
        <p className="text-xs font-semibold text-gray-500 mb-3">{t(lang, "uploadFoodImage")}</p>
        {foodPreview && (
          <img src={foodPreview} alt="" className="w-full rounded-2xl object-cover max-h-36 mb-3" />
        )}
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFoodUpload} className="hidden" />
        <button onClick={() => fileRef.current.click()}
          className="w-full glass border border-rose-200 text-rose-500 py-2.5 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2">
          <FiUpload className="text-sm" />
          {analyzing ? t(lang, "processing") : t(lang, "analyzeFood")}
        </button>

        <AnimatePresence>
          {foodAnalysis && !analyzing && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`mt-3 rounded-2xl p-3 ${foodAnalysis.safe ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
              <div className="flex items-center gap-2 mb-1">
                {foodAnalysis.safe
                  ? <FiCheckCircle className="text-green-500 text-base" />
                  : <FiXCircle className="text-red-500 text-base" />}
                <p className={`text-sm font-bold ${foodAnalysis.safe ? "text-green-700" : "text-red-700"}`}>
                  {foodAnalysis.safe ? t(lang, "canEat") : t(lang, "avoid")}: {foodAnalysis.name}
                </p>
              </div>
              <p className="text-xs text-gray-600 mb-1">{foodAnalysis.benefit}</p>
              <p className="text-xs text-gray-400">{foodAnalysis.nutrients}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>

      {/* Safe Foods */}
      <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">{t(lang, "canEat")}</p>
      <div className="space-y-3 mb-4">
        {nutrition.safe.map((food, i) => (
          <GlassCard key={i} delay={i * 0.06}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <FiCheckCircle className="text-green-500 text-sm flex-shrink-0" />
                  <p className="text-sm font-semibold text-gray-800">{food.name}</p>
                  <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">{food.tag}</span>
                </div>
                <p className="text-xs text-gray-500">{food.benefit}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Symptom Based Recommendations */}
      {symptomFoods.length > 0 && (
        <>
          <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Based on Your Symptoms</p>
          <div className="space-y-3 mb-4">
            {symptomFoods.map((food, i) => (
              <GlassCard key={i} delay={i * 0.05} className="border border-blue-100 bg-blue-50/30">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-blue-800">{food.name}</p>
                      <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">{food.tag}</span>
                    </div>
                    <p className="text-xs text-blue-600">{food.benefit}</p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </>
      )}

      {/* Avoid */}
      <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">{t(lang, "avoid")}</p>
      <GlassCard className="mb-4">
        <div className="flex flex-wrap gap-2">
          {nutrition.avoid.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 bg-red-50 border border-red-100 px-3 py-1.5 rounded-2xl">
              <FiXCircle className="text-red-400 text-xs" />
              <span className="text-xs text-red-600 font-medium">{item}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Tip */}
      <GlassCard>
        <p className="text-xs font-semibold text-gray-500 mb-1">Tip for Month {month}</p>
        <p className="text-sm text-gray-600">
          Ragi has <span className="font-bold text-rose-500">344mg calcium per 100g</span> — more than milk. A superfood for pregnant women.
        </p>
      </GlassCard>
    </Layout>
  );
}
