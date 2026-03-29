export default function DailyPlan() {
  const plan = {
    food: "Ragi & Greens",
    activity: "Walking",
    avoid: "Stress"
  };

  return (
    <div className="p-4 bg-pink-100 min-h-screen">
      <h1 className="text-xl font-bold">Today's Plan</h1>

      <div className="bg-white p-4 mt-4 rounded">🍽 {plan.food}</div>
      <div className="bg-white p-4 mt-2 rounded">🚶 {plan.activity}</div>
      <div className="bg-white p-4 mt-2 rounded">⚠ {plan.avoid}</div>
    </div>
  );
}