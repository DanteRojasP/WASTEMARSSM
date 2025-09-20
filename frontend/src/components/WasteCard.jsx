export default function WasteCard({waste, onCollect}){
  return (
    <div className="bg-slate-800 p-4 rounded shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{waste.name}</h3>
          <p className="text-sm text-slate-300">{waste.type} • {waste.percentage}%</p>
        </div>
        <button onClick={() => onCollect(waste)} className="px-3 py-1 bg-emerald-500 text-black rounded">Collect</button>
      </div>
      <p className="mt-2 text-slate-300 text-sm">{waste.description}</p>
      <div className="mt-3 text-xs text-slate-400">
        <strong>Reciclaje:</strong> {Array.isArray(waste.recycling) ? waste.recycling.join(", ") : waste.recycling}
      </div>
    </div>
  );
}
