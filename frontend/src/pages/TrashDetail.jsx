import { useParams, Link } from "react-router-dom";
import trashData from "../data/trashData";

export default function TrashDetail() {
  const { id } = useParams();
  const item = trashData.find(obj => obj.id === parseInt(id));

  if (!item) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-2xl">Objeto no encontrado 🚀</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Botón volver */}
        <Link to="/" className="inline-block mb-6 text-gray-400 hover:text-white">← Volver al catálogo</Link>
        
        {/* Imagen grande */}
        <img src={item.image} alt={item.name} className="w-full h-96 object-cover rounded mb-6" />

        {/* Info */}
        <h1 className="text-4xl font-bold mb-2">{item.name}</h1>
        <p className="text-lg text-gray-400 mb-4">{item.category}</p>

        <p className="mb-4"><strong>Porcentaje en Marte:</strong> {item.percentage}</p>
        <p className="mb-6">{item.description}</p>

        <h2 className="text-2xl font-bold mb-3">Posibles reciclajes</h2>
        <ul className="list-disc list-inside text-gray-300">
          {item.recycling.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}