import { useState } from "react";
import { ThumbsUp, Filter } from "lucide-react"; // 👍 en lugar de corazones

export default function Step1Select({
  inventory,
  search,
  setSearch,
  setSelectedItem,
  cart,
  setStep,
}) {
  const [likedCategories, setLikedCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);

  // categorías únicas
  const categories = [...new Set(inventory.map((i) => i.category || "Otros"))];

  // toggle like en categorías
  const toggleCategory = (cat) => {
    setLikedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  // filtrar inventario
  const filteredInventory = inventory.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      likedCategories.length === 0 || likedCategories.includes(i.category);
    return matchSearch && matchCategory;
  });

  // comprobar stock disponible en carrito (siempre en kg)
  const getRemainingStock = (item) => {
    const totalStockKg = item.stock.kg; // el stock real SIEMPRE está en kg
    const inCart = cart.filter((c) => c.name === item.name);

    if (inCart.length === 0) return totalStockKg;

    // calcular cuántos kilos ya están en carrito (conversión si es en unidades)
    const usedKg = inCart.reduce((acc, c) => {
      if (c.unit === "kg") return acc + c.amount;
      if (c.unit === "unid" && item.weight) return acc + c.amount * item.weight;
      return acc;
    }, 0);

    return totalStockKg - usedKg;
  };

  return (
    <div
      className="relative"
      style={{ fontFamily: "Orbitron, sans-serif" }}
    >
      <h2 className="text-xl font-semibold mb-6 text-[#FF9D6F] uppercase tracking-wide">
        Select your waste
      </h2>

      {/* Barra de búsqueda con botón de filtros */}
      <div className="flex items-center gap-2 mb-6 relative">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 p-2 bg-[#1c1c1c] text-white rounded-md border border-[#8E6A5A] focus:outline-none"
        />
        <div className="relative">
          <button
            onClick={() => setShowCategories(!showCategories)}
            className="p-2 bg-[#1c1c1c] border border-[#8E6A5A] rounded-md hover:bg-[#2c2c2c]"
          >
            <Filter className="text-[#E27B58]" size={20} />
          </button>

          {/* Lista desplegable justo debajo del botón */}
          {showCategories && (
            <div className="absolute right-0 mt-2 bg-[#111] border border-[#8E6A5A] rounded-lg p-4 shadow-xl w-56 z-20">
              <p className="text-sm font-semibold text-white mb-2">
                Filter by category
              </p>
              <div className="flex flex-col gap-2 max-h-48 overflow-y-auto cart-scroll pr-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition text-left ${
                      likedCategories.includes(cat)
                        ? "bg-[#E27B58] text-black"
                        : "bg-[#1c1c1c] text-white hover:bg-[#2c2c2c]"
                    }`}
                  >
                    <ThumbsUp
                      size={14}
                      className={
                        likedCategories.includes(cat)
                          ? "fill-black text-black"
                          : "text-[#E27B58]"
                      }
                    />
                    <span className="text-sm">{cat}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid de items */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredInventory.length > 0 ? (
          filteredInventory.map((item) => {
            const remainingKg = getRemainingStock(item);
            const outOfStock = remainingKg <= 0;

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (!outOfStock) setSelectedItem(item);
                }}
                className={`rounded-lg p-4 border shadow-md transition ${
                  outOfStock
                    ? "bg-[#2c2c2c] border-[#663926]/40 cursor-not-allowed opacity-50"
                    : "bg-[#1c1c1c] border-[#8E6A5A] cursor-pointer hover:bg-[#2c2c2c]"
                }`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 object-cover mb-2 mx-auto rounded-md bg-black"
                />
                <h3 className="text-lg font-semibold text-white text-center">
                  {item.name}
                </h3>
                <p className="text-sm text-gray-400 text-center">
                  {outOfStock
                    ? "❌ Out of stock"
                    : `Stock: ${remainingKg.toFixed(2)} kg`}
                </p>
              </div>
            );
          })
        ) : (
          <p className="col-span-full text-center text-gray-400">
            ❌ No items found
          </p>
        )}
      </div>
    </div>
  );
}
