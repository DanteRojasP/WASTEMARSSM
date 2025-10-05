// frontend/src/components/request/CartSidebar.jsx
import trashData from "../../data/trashData.js";
import kitsData from "../../data/kitsData.js";

export default function CartSidebar({ cart, removeFromCart, updateQuantity, setStep, step }) {
  // Subtotal en unidades
  const subtotalUnits = cart.reduce((acc, item) => (item.unit === "unid" ? acc + item.amount : acc), 0);
  // Subtotal en kilos
  const subtotalKilos = cart.reduce((acc, item) => (item.unit === "kg" ? acc + item.amount : acc), 0);

  // Total en kilos (convertir todo a kg)
  const totalKilos = cart.reduce((acc, item) => {
    const trashItem = trashData.find((t) => t.name === item.name);
    const kitItem = kitsData.find((k) => k.name === item.name);
    if (!trashItem && !kitItem) return acc;
    if (item.unit === "kg") return acc + item.amount;
    if (item.unit === "unid") {
      if (trashItem?.weight) return acc + item.amount * trashItem.weight;
      if (kitItem?.weight) return acc + item.amount * kitItem.weight;
    }
    return acc;
  }, 0);

  return (
    <div className="w-96 self-start ml-6">
      <aside
        className="sticky top-24 bg-[#111] p-5 rounded-2xl h-fit shadow-2xl border border-[#8E6A5A]
                   max-h-[calc(100vh-6rem)] flex flex-col"
        style={{ fontFamily: "Orbitron, sans-serif" }}
      >
        <h3 className="text-xl font-bold uppercase tracking-wider mb-4 border-b border-[#8E6A5A] pb-2 text-[#FF9D6F] flex items-center gap-2">
          🛒 Order summary
        </h3>

        {cart.length === 0 ? (
          <p className="text-[#99857A] italic">Your cart is empty</p>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 cart-scroll max-h-64">
              {cart.map((item, idx) => {
                const trashItem = trashData.find((t) => t.name === item.name);
                const kitItem = kitsData.find((k) => k.name === item.name);
                const source = trashItem || kitItem;
                return (
                  <div
                    key={idx}
                    className="flex items-center bg-[#1c1c1c] rounded-xl p-3 shadow-md border border-[#663926]/30"
                  >
                    {source?.image && (
                      <img
                        src={source.image}
                        alt={item.name}
                        className="w-14 h-14 object-contain mr-3 rounded-lg bg-[#2c2c2c]"
                      />
                    )}

                    <div className="flex-1">
                      <p className="font-semibold text-white tracking-wide">{item.name}</p>
                      <p className="text-xs text-[#99857A]">{source?.category || "Sin categoría"}</p>

                      <div className="flex items-center mt-2 space-x-2">
                        <button
                          onClick={() => updateQuantity(idx, item.amount - 1)}
                          disabled={item.amount <= 1}
                          className="px-2 py-1 bg-[#2c2c2c] rounded hover:bg-[#3a3a3a] text-white disabled:opacity-40"
                        >
                          -
                        </button>
                        <span className="px-3 text-sm text-white">{item.amount}</span>
                        <button
                          onClick={() => updateQuantity(idx, item.amount + 1)}
                          className="px-2 py-1 bg-[#2c2c2c] rounded hover:bg-[#3a3a3a] text-white"
                        >
                          +
                        </button>
                        <span className="ml-2 text-sm text-[#99857A]">{item.unit}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => removeFromCart(idx)}
                      className="ml-3 text-red-400 hover:text-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 border-t border-[#8E6A5A] pt-4 space-y-2 text-sm">
              {subtotalUnits > 0 && (
                <div className="flex justify-between text-[#99857A]">
                  <span className="uppercase tracking-wide">Subtotal (units)</span>
                  <span>{subtotalUnits} unid</span>
                </div>
              )}

              {subtotalKilos > 0 && (
                <div className="flex justify-between text-[#99857A]">
                  <span className="uppercase tracking-wide">Subtotal (kilograms)</span>
                  <span>{subtotalKilos} kg</span>
                </div>
              )}

              <div className="flex justify-between text-lg font-bold text-[#FF9D6F] uppercase tracking-wider">
                <span>Total</span>
                <span>{totalKilos.toFixed(2)} kg</span>
              </div>

              {totalKilos > 50 && (
                <p className="text-[11px] text-[#99857A] mt-1 italic">
                  ⚠️ It is recommended to request delivery, your order is too heavy.
                </p>
              )}
            </div>

            {step === 1 && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setStep(2)}
                  className="mt-4 w-full px-6 py-3 border border-[#E27B58] text-[#E27B58] hover:bg-[#E27B58] hover:text-black transition font-semibold rounded-lg uppercase tracking-wide"
                >
                  Next 
                </button>
              </div>
            )}
          </>
        )}
      </aside>
    </div>
  );
}
