import { useState } from "react";

export default function Journal() {
  const [imgs, setImgs] = useState([]);

  return (
    <div className="p-4 bg-pink-100 min-h-screen">
      <input type="file" onChange={e => {
        const url = URL.createObjectURL(e.target.files[0]);
        setImgs([...imgs, url]);
      }} />

      {imgs.map((i, idx) => <img key={idx} src={i} className="mt-2" />)}
    </div>
  );
}