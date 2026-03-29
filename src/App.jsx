import { Routes, Route } from "react-router-dom";
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
import RiskMap from "./pages/RiskMap";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/triage" element={<Triage />} />
      <Route path="/nutrition" element={<Nutrition />} />
      <Route path="/plan" element={<DailyPlan />} />
      <Route path="/family" element={<Family />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/sos" element={<SOS />} />
      <Route path="/health" element={<Health />} />
      <Route path="/records" element={<Records />} />
      <Route path="/kit" element={<DeliveryKit />} />
      <Route path="/riskmap" element={<RiskMap />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}
