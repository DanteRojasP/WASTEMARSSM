import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import Game from "./pages/Game";
import TrashDetail from "./pages/TrashDetail";


export default function App(){
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/game" element={<Game />} />
          <Route path="/data/:id" element={<TrashDetail />} />
        </Routes>
      </main>
    </div>
  );
}
