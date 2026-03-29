import { useState } from "react";
import { useNavigate } from "react-router-dom";

const symptomsList = ["Headache","Swelling","Blurred Vision","Dizziness","Bleeding"];

export default function Triage() {
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const toggle = (s) => {
    setSelected(prev =>
      prev.includes(s) ? prev.filter(i => i !== s) : [...prev, s]
    );
  };

  const checkRisk = () => {
    if (selected.includes("Bleeding") || selected.includes("Blurred Vision")) {
      setResult("HIGH");
    } else if (selected.includes("Swelling") || selected.includes("Dizziness")) {
      setResult("MEDIUM");
    } else {
      setResult("LOW");
    }
  };

  return (
    <div className="p-4 bg-pink-100 min-h-screen">
      <button onClick={() => navigate("/")}>← Back</button>
      <h1 className="text-xl font-bold mb-4">Symptom Checker</h1>

      <div className="grid grid-cols-2 gap-3">
        {symptomsList.map(s => (
          <button
            key={s}
            onClick={() => toggle(s)}
            className={`p-3 rounded-xl ${
              selected.includes(s) ? "bg-pink-400 text-white" : "bg-white"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <button onClick={checkRisk} className="mt-4 bg-pink-500 text-white p-3 rounded-xl w-full">
        Check Risk
      </button>

      {result && (
        <div className="mt-4 p-4 rounded-xl text-white bg-red-400">
          {result} Risk detected  
          <p className="text-sm mt-2">
            Explanation: Based on selected symptoms.
          </p>
        </div>
      )}
    </div>
  );
}