// frontend/src/components/request/Step1Kits.jsx
import { useState } from "react";
import kitsData from "../../data/kitsData";
import KitCard from "./KitCard";

export default function Step1Kits({ addToCart, setStep }) {
  const [filters, setFilters] = useState({
    theme: "",
    difficulty: "",
    material: "",
  });
  const [results, setResults] = useState([]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    let filtered = kitsData;

    if (filters.theme) {
      filtered = filtered.filter(
        (k) =>
          k.theme &&
          k.theme.toLowerCase() === filters.theme.toLowerCase()
      );
    }
    if (filters.difficulty) {
      filtered = filtered.filter(
        (k) =>
          k.difficulty &&
          k.difficulty.toLowerCase() === filters.difficulty.toLowerCase()
      );
    }
    if (filters.material) {
      filtered = filtered.filter(
        (k) =>
          k.primaryMaterial &&
          k.primaryMaterial.toLowerCase() === filters.material.toLowerCase()
      );
    }

    setResults(filtered);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center">
        Search Available Packages
      </h2>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Tema */}
        <select
          name="theme"
          value={filters.theme}
          onChange={handleChange}
          className="p-2 bg-[#1a1a1a] rounded border border-[#663926]/40"
        >
          <option value="">Topic...</option>
          <option value="Garden">Garden</option>
          <option value="Deco">Deco</option>
          <option value="Fashion">Fashion</option>
          <option value="Tool">Tool</option>
          <option value="School">School</option>
          <option value="Manufacturing">Manufacturing</option>
          <option value="Party">Party</option>
        </select>

        {/* Dificultad */}
        <select
          name="difficulty"
          value={filters.difficulty}
          onChange={handleChange}
          className="p-2 bg-[#1a1a1a] rounded border border-[#663926]/40"
        >
          <option value="">Difficulty...</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        {/* Material principal */}
        <select
          name="material"
          value={filters.material}
          onChange={handleChange}
          className="p-2 bg-[#1a1a1a] rounded border border-[#663926]/40"
        >
          <option value="">Main material...</option>
          <option value="Plastic">Plastic</option>
          <option value="Metal">Metal</option>
          <option value="Cardboard">Cardboard</option>
          <option value="Textile">Textile</option>
          <option value="Composite">Composite</option>
          <option value="Foam">Foam</option>
          <option value="Polymer">Polymer</option>
          <option value="Drink-Pouch">Drink-Pouch</option>
          <option value="Antistatic-Bubble-Bags">Antistatic-Bubble-Bags</option>
          <option value="Food-Wrappers-Multilayer">Food-Wrappers-Multilayer</option>
          <option value="Polyethylene">Polyethylene</option>
        </select>
      </div>

      <button
        onClick={handleSearch}
        className="mb-8 px-6 py-3 bg-[#FF9D6F] text-black font-semibold rounded shadow hover:bg-[#ffb08a]"
      >
        Search
      </button>

      {/* Resultados */}
      <div className="space-y-6">
        {results.length === 0 ? (
          <p className="text-gray-400">
            No results found, try using different filters.
          </p>
        ) : (
          results.map((kit) => (
            <KitCard key={kit.id} kit={kit} addToCart={addToCart} />
          ))
        )}
      </div>

      {/* Botones abajo */}
      {results.length > 0 && (
  <div className="mt-12 flex justify-between items-start">
    {/* Back */}
    <button
      onClick={() => setStep(0)}
      className="px-6 py-3 bg-[#1a1a1a] border border-[#663926]/40 text-[#99857A] rounded-lg hover:text-white hover:border-[#E27B58] transition-transform duration-300 hover:scale-105"
    >
      Back
    </button>

    <div className="flex flex-col gap-3">
      <button
        onClick={() => setStep(2)}
        className="px-6 py-3 bg-[#FF9D6F] text-black rounded-lg hover:bg-[#E27B58] transition-transform duration-300 hover:scale-105"
      >
        Place order
      </button>
      <button
        onClick={() => setStep(1)}
        className="px-6 py-3 bg-[#1a1a1a] border border-[#663926]/40 text-[#99857A] rounded-lg hover:text-white hover:border-[#E27B58] transition-transform duration-300 hover:scale-105"
      >
        Continue ordering
      </button>
    </div>
  </div>
)}
    </div>
  );
}
