import { useState } from "react";

export default function Family() {
  const [list, setList] = useState([]);

  return (
    <div className="p-4 bg-pink-100 min-h-screen">
      <h1 className="text-xl font-bold">Family</h1>

      <button
        onClick={() => setList([...list, "Member"])}
        className="bg-pink-500 text-white p-2 rounded mt-2"
      >
        Add Member
      </button>

      {list.map((m, i) => <p key={i}>{m}</p>)}
    </div>
  );
}