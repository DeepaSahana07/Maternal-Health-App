import {
  FaMicrophone,
  FaCamera,
  FaUsers,
  FaHeartbeat,
} from "react-icons/fa";
import { MdEmergency, MdFoodBank } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";
import MiniCard from "../components/MiniCard";
import Header from "../components/Header";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-purple-100 p-4">

      <Header title="Hello Mummy 👋" subtitle="Week 24 of your journey" />

      {/* HERO */}
      <div className="relative bg-gradient-to-r from-pink-400 to-pink-300 rounded-3xl p-5 text-white shadow-lg">

        <p className="text-sm opacity-80">Pregnancy Timeline</p>

        <div className="flex justify-between items-center mt-3">
          <div>
            <h2 className="text-5xl font-bold">24</h2>
            <p className="text-sm">Weeks</p>
          </div>

          <div className="bg-white text-pink-500 px-3 py-1 rounded-xl text-sm shadow">
            Baby Growing 💕
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="flex gap-3 mt-4">
        <MiniCard title="Weight" value="300g" />
        <MiniCard title="Length" value="18cm" />
      </div>

      {/* FEATURES */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <FeatureCard icon={<FaMicrophone />} title="Voice" />
        <FeatureCard icon={<MdEmergency />} title="SOS" red onClick={() => navigate("/sos")} />
        <FeatureCard icon={<MdFoodBank />} title="Nutrition" onClick={() => navigate("/nutrition")} />
        <FeatureCard icon={<FaHeartbeat />} title="Health" onClick={() => navigate("/triage")} />
        <FeatureCard icon={<FaUsers />} title="Family" onClick={() => navigate("/family")} />
        <FeatureCard icon={<FaCamera />} title="Journal" onClick={() => navigate("/journal")} />
      </div>
    </div>
  );
}