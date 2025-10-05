import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Game from "./pages/Game";
import RequestForm from "./pages/Request";
import MarsProSimulatorPage from "./pages/MarsSimulator";
import NewsDetail from "./pages/NewsDetail";

// importa al bot
import AssistantWidget from "./components/AssistantWidget";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/request" element={<RequestForm />} />
          <Route path="/mars-simulator" element={<MarsProSimulatorPage />} />
          <Route path="/news/:id" element={<NewsDetail />} /> {/* detalle de noticias */}
        </Routes>
      </main>

      {/* Bot :V */}
      <AssistantWidget />
    </div>
  );
}
