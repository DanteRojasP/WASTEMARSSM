import { useEffect, useState } from "react";
import api from "../services/api";

export default function Game(){
  const [wastes, setWastes] = useState([]);
  const [inventory, setInventory] = useState({});
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(()=>{
    api.get("/api/waste").then(r=>setWastes(r.data));
    fetchBoard();
  },[]);

  function collect(w){
    // incrementar localmente
    setInventory(prev=>{
      const next = {...prev};
      next[w.id] = (next[w.id] || 0) + 1;
      return next;
    });
    // notificar backend
    api.post("/api/collect", { userName: "player1", wasteId: w.id, qty: 1 }).catch(()=>{});
  }

  function craft(aId, bId){
    // Ejemplo simple: juntar dos items -> crear score (mock)
    // En versión real: reglas de crafting más complejas.
    api.post("/api/score", { userName: "player1", score: 10 }).then(()=> fetchBoard());
    alert("Craft realizado — ganas puntos (ejemplo).");
  }

  function fetchBoard(){
    api.get("/api/leaderboard").then(r=>setLeaderboard(r.data.slice(0,10)));
  }

  return (
    <div className="container mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Game — Recolecta y Crea</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <h2 className="font-semibold">Items disponibles</h2>
          <div className="mt-2 grid gap-2">
            {wastes.map(w=> (
              <div key={w.id} className="flex justify-between bg-slate-800 p-2 rounded">
                <div>
                  <div className="font-medium">{w.name}</div>
                  <div className="text-xs text-slate-400">{w.type}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>collect(w)} className="px-2 py-1 rounded bg-emerald-500 text-black">Collect</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-semibold">Inventario</h2>
          <div className="mt-2 bg-slate-800 p-3 rounded">
            {Object.keys(inventory).length === 0 && <div className="text-slate-400">Sin items</div>}
            {Object.entries(inventory).map(([id,qty])=>{
              const w = wastes.find(x=>x.id === id) || {name: id};
              return (
                <div key={id} className="flex justify-between py-1">
                  <div>{w.name}</div>
                  <div className="flex gap-2">
                    <div className="text-slate-300">{qty}</div>
                    <button onClick={()=>{ /* ejemplo craft: usar mismo item dos veces */ craft(id,id) }} className="px-2 py-0.5 bg-blue-600 rounded text-sm">Craft</button>
                  </div>
                </div>
              );
            })}
          </div>

          <h3 className="mt-4 font-semibold">Leaderboard</h3>
          <div className="mt-2 bg-slate-800 p-3 rounded">
            {leaderboard.map((s, i) => (
              <div key={s.id} className="flex justify-between">
                <div>{i+1}. {s.userName}</div>
                <div>{s.score}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
