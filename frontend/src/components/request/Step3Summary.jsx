// frontend/src/components/request/Step3Summary.jsx
import trashData from "../../data/trashData.js";
import kitsData from "../../data/kitsData.js";

export default function Step3Summary({ cart, form, setStep, handleSubmit }) {
  // calcular total kilos aquí también (por claridad)
  const totalKilos = cart.reduce((acc, item) => {
    const trashItem = trashData.find((t) => t.name === item.name);
    const kitItem = kitsData.find((k) => k.name === item.name);
    if (item.unit === "kg") return acc + item.amount;
    if (item.unit === "unit") {
      if (trashItem?.weight) return acc + item.amount * trashItem.weight;
      if (kitItem?.weight) return acc + item.amount * kitItem.weight;
    }
    return acc;
  }, 0);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Your request summary 📦</h2>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Cart:</h3>

        {cart.length === 0 && <p className="text-gray-400">Your cart is empty.</p>}

        {cart.map((item, idx) => {
          const trashItem = trashData.find((t) => t.name === item.name);
          const kitItem = kitsData.find((k) => k.name === item.name);
          const source = trashItem || kitItem;

          return (
            <div key={idx} className="flex flex-col md:flex-row justify-between bg-[#151515] p-3 rounded mb-3">
              <div>
                <div className="flex items-center gap-4">
                  {source?.image && (
                    <img src={source.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  )}
                  <div>
                    <div className="font-semibold text-white">{item.name}</div>
                    <div className="text-sm text-[#99857A]">
                      {item.amount} {item.unit} • {source?.category || "Sin categoría"}
                    </div>
                  </div>
                </div>

                {kitItem && (
                 <div className="mt-2 text-sm text-gray-300">
                 <p className="font-semibold">Description:</p>
                 <p className="text-sm">{kitItem.description}</p>

                {/* Espacio extra entre descripción y materiales */}
                  <p className="font-semibold mt-4">Materials / Components:</p>
                 <ul className="list-disc list-inside text-gray-300 mt-1">
                 {kitItem.items.map((it, i) => (
                   <li key={i}>
                  {it.name} {it.qty ? `x${it.qty}` : ""}
                </li>
                ))}
                   </ul>

    <p className="mt-2 text-xs text-[#99857A]">Weight per package: {kitItem.weight} kg</p>
  </div>
)}


                {trashItem && trashItem.description && (
                  <p className="mt-2 text-sm text-gray-300">{trashItem.description}</p>
                )}
              </div>

              <div className="mt-3 md:mt-0 flex flex-col items-end justify-between">
                <div className="text-sm text-[#99857A]">
                  {item.unit === "unid"
                    ? `Peso estimado: ${
                        (trashItem?.weight ? trashItem.weight : kitItem?.weight ? kitItem.weight : 0) * item.amount
                      } kg`
                    : `Peso: ${item.amount} kg`}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Astronaut Information:</h3>
        <p>
          {form.firstName} {form.lastName}
        </p>
        <p>Country: {form.nationality}</p>
        <p>Code: {form.astronautCode}</p>
        <p>Delivery: {form.deliveryMethod}</p>
        <p>Waypoint: {form.waypoint}</p>
      </div>

      <div className="mb-6 text-sm text-[#99857A]">
        <div className="flex justify-between">
          <span>Estimated total (kg)</span>
          <span>{totalKilos.toFixed(2)} kg</span>
        </div>
      </div>

<div className="flex justify-between items-center">
  {/* Back */}
  <button
    onClick={() => setStep(2)}
    className="px-6 py-3 bg-[#1a1a1a] border border-[#663926]/40 text-[#99857A] rounded-lg hover:text-white hover:border-[#E27B58] transition-transform duration-300 hover:scale-105"
  >
    Back
  </button>

  {/* Confirm */}
  <button
    onClick={handleSubmit}
    className="px-6 py-3 bg-[#FF9D6F] text-black rounded-lg hover:bg-[#E27B58] transition-transform duration-300 hover:scale-105"
  >
    Confirm
  </button>
</div>
    </div>
  );
}
