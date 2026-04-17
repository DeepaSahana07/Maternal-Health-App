import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { save, load, KEYS } from "../utils/storage";
import { FiUser, FiLock, FiHeart } from "react-icons/fi";

const field = "w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 outline-none focus:ring-2 focus:ring-rose-300 transition";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", age: "", month: "", password: "" });
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleRegister = () => {
    setError("");
    const { name, age, month, password } = form;
    if (!name || !age || !month || !password) { setError("Please fill in all fields."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    const month_num = parseInt(month);
    if (month_num < 1 || month_num > 9) { setError("Pregnancy month must be 1–9."); return; }

    const users = load(KEYS.USERS, []);
    const newUser = {
      name: name.trim(),
      age: parseInt(age),
      month: month_num,
      week: month_num * 4,
      password,
      id: Date.now(),
    };
    save(KEYS.USERS, [...users, newUser]);
    save(KEYS.PROFILE, { name: newUser.name, age: newUser.age, month: newUser.month, week: newUser.week });
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
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">Create Account</h1>
        <p className="text-sm text-gray-400 text-center mb-6">Start your MamaAI journey</p>

        {error && <p className="text-xs text-red-500 bg-red-50 rounded-2xl px-4 py-2 mb-4 text-center">{error}</p>}

        <div className="space-y-3 mb-5">
          <input className={field} placeholder="Full name" value={form.name} onChange={set("name")} />
          <input className={field} type="number" placeholder="Your age" min="15" max="50" value={form.age} onChange={set("age")} />
          <input className={field} type="number" placeholder="Pregnancy month (1–9)" min="1" max="9" value={form.month} onChange={set("month")} />
          <input className={field} type="password" placeholder="Password (min 6 chars)" value={form.password} onChange={set("password")} onKeyDown={(e) => e.key === "Enter" && handleRegister()} />
        </div>

        <button onClick={handleRegister} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold text-sm shadow-md active:scale-95 transition-transform mb-4">
          Register
        </button>
        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="text-rose-500 font-semibold">Login</button>
        </p>
      </div>
    </div>
  );
}
