// frontend/src/components/request/KitCard.jsx
import { useState } from "react";

export default function KitCard({ kit, addToCart }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [lastQty, setLastQty] = useState(null);

  // stock disponible (en unidades de kit)
  const stockUnits = Number(kit.amount ?? 0);

  const safeQty = Math.max(1, Number(qty) || 1);

  const exceedsStock = safeQty > stockUnits;

  const isModified = added && lastQty !== null && safeQty !== lastQty;

  const handleAddOrUpdate = () => {
    if (stockUnits <= 0) {
      alert("⚠️ Sorry, this kit is out of stock.");
      return;
    }

    if (exceedsStock) {
      alert(`⚠️ Only ${stockUnits} units available.`);
      return;
    }

    const itemForRequest = { ...kit, amount: stockUnits };

    addToCart(itemForRequest, safeQty, "unit");

    setAdded(true);
    setLastQty(safeQty);
  };

  const handleIncrease = () => {
    if (safeQty >= stockUnits) return;
    setQty((p) => Number(p) + 1);
  };

  const handleDecrease = () => {
    setQty((p) => Math.max(1, Number(p) - 1));
  };

  return (
    <div className="bg-[#111] border border-[#663926]/30 rounded-lg p-6 flex flex-col md:flex-row gap-8 overflow-hidden">
      {/* izquierda: imagen + controles */}
      <div className="w-full md:w-52 flex flex-col items-center border-b md:border-b-0 md:border-r border-[#663926]/30 md:pr-6 pb-6 md:pb-0">
        <img
          src={kit.image}
          alt={kit.name}
          className="w-32 h-32 object-cover rounded bg-black"
        />

        {/* stock */}
        <div className="mt-3 text-sm text-[#99857A] text-center">
          {stockUnits > 0 ? (
            <span>
              Stock:{" "}
              <strong className="text-white">{stockUnits}</strong> Packages
            </span>
          ) : (
            <span className="text-red-400">Out of stock</span>
          )}
        </div>

        {/* controles */}
        <div className="mt-4 w-full flex items-center justify-center gap-2 flex-wrap">
          <button
            onClick={handleDecrease}
            className="px-3 py-1 bg-[#222] text-white rounded hover:bg-[#2b2b2b]"
          >
            −
          </button>

          <input
            type="number"
            min="1"
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))}
            className="w-16 text-center p-2 bg-[#1a1a1a] rounded border border-[#663926]/40 text-white"
          />

          <button
            onClick={handleIncrease}
            className="px-3 py-1 bg-[#222] text-white rounded hover:bg-[#2b2b2b]"
          >
            +
          </button>
        </div>

        {/* botón */}
        <button
          onClick={handleAddOrUpdate}
          disabled={stockUnits <= 0}
          className={`mt-4 w-full px-3 py-2 rounded font-semibold transition ${
            isModified
              ? "bg-yellow-400 text-black"
              : "bg-[#FF9D6F] text-black"
          } ${stockUnits <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isModified ? "Update" : "Add"}
        </button>

        {added && !isModified && (
          <p className="mt-2 text-green-400 text-sm font-medium">✓ Added</p>
        )}
      </div>

      {/* derecha: info */}
      <div className="flex-1 md:pl-6 text-left">
        <h4 className="font-bold text-lg text-white mb-2">{kit.name}</h4>
        <p className="text-sm text-gray-300 mb-4">{kit.description}</p>

        <p className="text-xs text-[#99857A] mb-4">
          Weight per package:{" "}
          <strong className="text-white">{kit.weight} kg</strong> •
          Difficulty:{" "}
          <strong className="text-white">{kit.difficulty}</strong>
        </p>

        <div className="text-sm">
          <p className="font-semibold text-white mb-1">Materials:</p>
          <ul className="list-disc list-inside text-gray-300 mt-1 space-y-1">
            {kit.materials.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>

          {kit.items && kit.items.length > 0 && (
            <div className="mt-4 text-sm">
              <p className="font-semibold text-white mb-1">Components:</p>
              <ul className="list-disc list-inside text-gray-300 mt-1 space-y-1">
                {kit.items.map((it, i) => (
                  <li key={i}>
                    {it.name} {it.qty ? `x${it.qty}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
