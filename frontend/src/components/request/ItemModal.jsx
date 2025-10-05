// frontend/src/components/request/ItemModal.jsx
import trashData from "../../data/trashData.js";

export default function ItemModal({
  item,
  setSelectedItem,
  form,
  setForm,
  addToCart,
  setStep,
}) {
  // SOLO trashData (no kits)
  const trashItem = trashData.find((t) => t.name === item.name);

  const handleAdd = () => {
    addToCart(item, Number(form.amount), form.unit);
    setSelectedItem(null);
    setStep(1); // volver a selección
  };

  if (!trashItem) {
    // si no es un item de trashData (p.ej. un kit), no mostramos modal
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-black border border-[#8E6A5A] p-6 rounded-2xl w-[700px] relative shadow-2xl">
        <button
          onClick={() => setSelectedItem(null)}
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <img
              src={trashItem.image || item.image}
              alt={item.name}
              className="w-28 h-28 mx-auto mb-4 rounded-lg bg-[#1c1c1c] p-2 object-cover"
            />
            <h3 className="text-xl font-bold mb-2 text-white text-center">{item.name}</h3>

            <p className="text-gray-400 text-center mb-4">
              Stock: {trashItem.stock ? `${trashItem.stock.kg} kg` : "—"}
            </p>

            <input
              type="number"
              min="1"
              placeholder="Cantidad"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full p-2 mb-4 bg-[#1c1c1c] text-white rounded-md border border-[#8E6A5A] focus:outline-none"
            />

            <select
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="w-full p-2 mb-4 bg-[#1c1c1c] text-white rounded-md border border-[#8E6A5A] focus:outline-none"
            >
              <option value="unid">Units</option>
              <option value="kg">Kilograms</option>
            </select>

            <button
              onClick={handleAdd}
              className="w-full bg-[#FF9D6F] py-2 rounded-lg hover:bg-[#ff8449] font-semibold text-black"
            >
              Add to cart 
            </button>
          </div>

          <div className="bg-[#1c1c1c] rounded-xl p-4 text-sm text-gray-300 space-y-3">
            <p>
              <span className="font-semibold text-white">Category: </span>
              {trashItem.category || "Uncategorized"}
            </p>
            <p>
              <span className="font-semibold text-white">Description: </span>
              {trashItem.description || "No description"}
            </p>
            {trashItem?.recycling && (
              <div>
                <span className="font-semibold text-white">Recycling: </span>
                <ul className="list-disc list-inside text-gray-400 mt-1 space-y-1">
                  {trashItem.recycling.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
