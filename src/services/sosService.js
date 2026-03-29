export async function sendSOS(location) {
  await fetch("http://localhost:5000/sos", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ location }),
  });
}