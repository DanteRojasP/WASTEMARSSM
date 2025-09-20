export default function TrashModal({ item, onClose }) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white text-black p-6 rounded-lg max-w-lg w-full relative">
        {/* Botón cerrar */}
        <button 
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>

        <img src={item.image} alt={item.name} className="h-48 w-full object-cover rounded mb-4" />
        <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
        <p className="text-sm text-gray-600 mb-2">Categoría: {item.category}</p>
        <p className="mb-3"><strong>Porcentaje en Marte:</strong> {item.percentage}</p>
        <p className="mb-3">{item.description}</p>
        <h3 className="font-bold mb-2">Posibles reciclajes:</h3>
        <ul className="list-disc list-inside">
          {item.recycling.map((r, i) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
