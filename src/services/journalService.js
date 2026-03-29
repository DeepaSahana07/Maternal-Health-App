export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("http://localhost:5000/journal", {
    method: "POST",
    body: formData,
  });

  return res.json();
}