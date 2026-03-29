export async function sendAlert(data) {
  await fetch("http://localhost:5000/family/alert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}