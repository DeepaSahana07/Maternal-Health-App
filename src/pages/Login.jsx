import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { save, load, KEYS } from "../utils/storage";
import { FiHeart } from "react-icons/fi";

const field = "w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 outline-none focus:ring-2 focus:ring-rose-300 transition";

export default function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");
    if (!name || !password) { setError("Please fill in all fields."); return; }

    const users = load(KEYS.USERS, []);
    const match = users.find(
      (u) => u.name.toLowerCase() === name.trim().toLowerCase() && u.password === password
    );

    if (!match) { setError("Invalid name or password."); return; }

    save(KEYS.PROFILE, { name: match.name, age: match.age, month: match.month, week: match.week || match.month * 4 });
    navigate("/home");
  };

  return (
    <div className="min-h-dvh flex items-center justify-center px-6 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="w-full max-w-sm bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-8">
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-md">
            <FiHeart className="text-white text-xl" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">Welcome Back</h1>
        <p className="text-sm text-gray-400 text-center mb-7">Sign in to continue</p>

        {error && <p className="text-xs text-red-500 bg-red-50 rounded-2xl px-4 py-2 mb-4 text-center">{error}</p>}

        <div className="space-y-3 mb-5">
          <input className={field} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className={field} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
        </div>

        <button onClick={handleLogin} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold text-sm shadow-md active:scale-95 transition-transform mb-4">
          Login
        </button>
        <p className="text-center text-sm text-gray-400">
          New here?{" "}
          <button onClick={() => navigate("/register")} className="text-rose-500 font-semibold">Create Account</button>
        </p>
      </div>
    </div>
  );
}
