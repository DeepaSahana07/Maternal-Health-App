import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Triage from "./pages/Triage";
import Nutrition from "./pages/Nutrition";
import DailyPlan from "./pages/DailyPlan";
import Family from "./pages/Family";
import Journal from "./pages/Journal";
import SOS from "./pages/SOS";
import Health from "./pages/Health";
import Records from "./pages/Records";
import DeliveryKit from "./pages/DeliveryKit";
import Settings from "./pages/Settings";
import VoiceAssistant from "./pages/VoiceAssistant";
import Calendar from "./pages/Calendar";
import VideoGuide from "./pages/VideoGuide";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      {/* Keep /signup as alias for backward compat */}
      <Route path="/signup" element={<Register />} />
      <Route path="/home" element={<Dashboard />} />
      <Route path="/triage" element={<Triage />} />
      <Route path="/nutrition" element={<Nutrition />} />
      <Route path="/plan" element={<DailyPlan />} />
      <Route path="/family" element={<Family />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/sos" element={<SOS />} />
      <Route path="/health" element={<Health />} />
      <Route path="/records" element={<Records />} />
      <Route path="/kit" element={<DeliveryKit />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/assistant" element={<VoiceAssistant />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/video" element={<VideoGuide />} />
    </Routes>
  );
}
