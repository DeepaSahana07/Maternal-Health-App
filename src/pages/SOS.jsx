import { useState } from "react";

export default function SOS() {
  const [msg, setMsg] = useState("");

  const send = () => {
    setMsg("🚨 Alert Sent!");
  };

  return (
    <div className="p-4 bg-red-100 min-h-screen text-center">
      <button onClick={send} className="bg-red-500 text-white p-6 rounded-full">
        SOS
      </button>

      <p className="mt-4">{msg}</p>
    </div>
  );
}