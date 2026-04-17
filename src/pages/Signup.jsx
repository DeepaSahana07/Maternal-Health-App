import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { save, load } from "../utils/storage";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = () => {
    setError("");
    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const users = load("mh_users", []);
    const exists = users.find((u) => u.email === email.trim().toLowerCase());
    if (exists) {
      setError("An account with this email already exists.");
      return;
    }

    const newUser = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      week: 24,
    };

    save("mh_users", [...users, newUser]);
    save("mh_profile", { name: newUser.name, week: newUser.week });
    navigate("/home");
  };

  return (
    <div className="min-h-dvh flex items-center justify-center px-6 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="w-full max-w-sm bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl p-8">
        {/* Logo mark */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-md">
            <span className="text-white text-xl">🌸</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 text-center mb-1">Create account</h1>
        <p className="text-sm text-gray-400 text-center mb-7">Start your journey with MamaAI</p>

        {/* Error */}
        {error && (
          <p className="text-xs text-red-500 bg-red-50 rounded-2xl px-4 py-2 mb-4 text-center">
            {error}
          </p>
        )}

        {/* Inputs */}
        <div className="space-y-3 mb-5">
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 outline-none focus:ring-2 focus:ring-rose-300 transition"
          />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 outline-none focus:ring-2 focus:ring-rose-300 transition"
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSignup()}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 outline-none focus:ring-2 focus:ring-rose-300 transition"
          />
        </div>

        {/* Signup button */}
        <button
          onClick={handleSignup}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-400 to-pink-500 text-white font-semibold text-sm shadow-md active:scale-95 transition-transform mb-4"
        >
          Sign Up
        </button>

        {/* Login link */}
        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-rose-500 font-semibold"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
