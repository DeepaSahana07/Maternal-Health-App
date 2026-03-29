export async function getDailyPlan(week) {
  const res = await fetch(`http://localhost:5000/plan/${week}`);
  return res.json();
}