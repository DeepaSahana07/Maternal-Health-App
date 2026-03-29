import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Triage from "./pages/Triage";
import Nutrition from "./pages/Nutrition";
import DailyPlan from "./pages/DailyPlan";
import Family from "./pages/Family";
import Journal from "./pages/Journal";
import SOS from "./pages/SOS";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/triage" element={<Triage />} />
      <Route path="/nutrition" element={<Nutrition />} />
      <Route path="/plan" element={<DailyPlan />} />
      <Route path="/family" element={<Family />} />
      <Route path="/journal" element={<Journal />} />
      <Route path="/sos" element={<SOS />} />
    </Routes>
  );
}

export default App;