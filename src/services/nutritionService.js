export async function getNutrition(type) {
  const res = await fetch(`http://localhost:5000/nutrition/${type}`);
  return res.json();
}