// src/components/planets/WaypointInfo.jsx
import React, { useMemo } from "react";
import { Trash2 } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const START_DATE = new Date("1960-01-01");

// Colores (paleta coherente con tu UI)
const COLORS = {
  bgCard: "#071014",
  accent: "#E27B58",
  yellow: "#facc15",
  blue: "#3b82f6",
  green: "#34d399",
  purple: "#9bd8ff",
  pink: "#ff9db0",
};

export default function WaypointInfo({ selected, onClose, timelineDays }) {
  if (!selected) return null;
  const { type, data } = selected;

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString();
    } catch {
      return d || "-";
    }
  };

  const excerpt = (text, n = 160) =>
    text ? (text.length > n ? text.slice(0, n).trim() + "…" : text) : "";

  // calcula métricas para una colonia en X días (timelineDays relativo a START_DATE)
  function calcColonyStatsAt(col, days) {
    const established = new Date(col.established);
    const startDays = Math.floor((established - START_DATE) / (1000 * 60 * 60 * 24));
    const activeDays = Math.max(days - startDays, 0);

    const perPerson = col.wastePerPersonDay ?? 1.6;
    const populationWaste = col.population * perPerson * activeDays;
    const binsWaste = (col.bins || []).reduce((s, b) => s + (b.baseWaste + b.rate * activeDays), 0);
    const total = populationWaste + binsWaste;

    const profile = col.materialProfile || {
      organics: 0.5,
      plastics: 0.3,
      metals: 0.15,
      hazardous: 0.05,
    };

    const energyMap = {
      organics: 0.02,
      plastics: 0.08,
      metals: 0.15,
      hazardous: 0.6,
    };

    const breakdown = {};
    Object.keys(profile).forEach((k) => {
      breakdown[k] = total * (profile[k] || 0);
    });

    const energy = Object.keys(breakdown).reduce((s, k) => s + breakdown[k] * (energyMap[k] || 0), 0);
    const hazardous = breakdown.hazardous || 0;

    const dailyWaste = activeDays > 0 ? total / activeDays : 0;
    const survivalEstimateDays = col.wasteCapacity ? Math.round(col.wasteCapacity / (dailyWaste || 1)) : null;

    return { total, breakdown, energy, hazardous, activeDays, dailyWaste, survivalEstimateDays };
  }

  // calcula métricas para una misión en X días
  function calcMissionStatsAt(mission, days) {
    const start = new Date(mission.date || mission.startDate);
    const missionStartDays = Math.floor((start - START_DATE) / (1000 * 60 * 60 * 24));
    const end = mission.endDate ? new Date(mission.endDate) : null;
    const duration = end ? Math.max(Math.floor((end - start) / (1000 * 60 * 60 * 24)), 1) : null;

    let activeDays = Math.max(days - missionStartDays, 0);
    if (duration !== null) activeDays = Math.min(activeDays, duration);
    if (activeDays <= 0) {
      return { total: 0, breakdown: {}, energy: 0, hazardous: 0, activeDays: 0, dailyWaste: 0, survivalEstimateDays: null };
    }

    // calcular total similar al control panel
    let missionTotal = 0;
    if (mission.wastePerMissionTotal) {
      if (duration) missionTotal = (mission.wastePerMissionTotal * activeDays) / Math.max(duration, 1);
      else missionTotal = mission.wastePerMissionTotal;
    } else if (mission.members && mission.members.length > 0) {
      const baseRate = mission.wastePerPersonDay ?? 1.6;
      missionTotal = mission.members.length * baseRate * activeDays;
    } else if (mission.payloadKg) {
      missionTotal = mission.wastePerMissionTotal || mission.payloadKg * 0.15;
    }

    const profile = mission.materialProfile || {
      organics: 0.1,
      plastics: 0.5,
      metals: 0.3,
      hazardous: 0.1,
    };
    const energyMap = mission.energyPerKg || {
      organics: 0.02,
      plastics: 0.08,
      metals: 0.15,
      hazardous: 0.6,
    };

    const breakdown = {};
    Object.keys(profile).forEach((k) => {
      breakdown[k] = missionTotal * (profile[k] || 0);
    });
    const energy = Object.keys(breakdown).reduce((s, k) => s + breakdown[k] * (energyMap[k] || 0), 0);
    const hazardous = breakdown.hazardous || 0;
    const dailyWaste = missionTotal / Math.max(activeDays, 1);

    return { total: missionTotal, breakdown, energy, hazardous, activeDays, dailyWaste, survivalEstimateDays: null };
  }

  // datos principales actuales según timelineDays
  const stats = useMemo(() => {
    if (type === "colony") return calcColonyStatsAt(data, timelineDays);
    if (type === "mission") {
      // incluimos start/end para la vista simplificada de misión
      const m = calcMissionStatsAt(data, timelineDays);
      const start = data.date || data.startDate ? new Date(data.date || data.startDate) : null;
      const end = data.endDate ? new Date(data.endDate) : null;
      return { ...m, start, end };
    }
    return null;
  }, [selected, timelineDays]);

  // preparar mini gráfico (línea) mostrando evolución desde creation->now en 6 puntos
// preparar mini gráfico (línea) mostrando evolución desde creación -> ahora en 6 puntos
const trendData = useMemo(() => {
  if (!data) return [];

  const points = 50; // 6 puntos en total: 0,1,2,3,4,5

  // Día de inicio real (desde START_DATE)
  const startDays =
    type === "colony"
      ? Math.floor((new Date(data.established) - START_DATE) / (1000 * 60 * 60 * 24))
      : Math.floor((new Date(data.date || data.startDate) - START_DATE) / (1000 * 60 * 60 * 24));

  // Valor inicial en el primer día
  const baseValue =
    type === "colony"
      ? calcColonyStatsAt(data, startDays).total
      : calcMissionStatsAt(data, startDays).total;

  const arr = Array.from({ length: points + 1 }, (_, i) => {
    // Día relativo a START_DATE
    const day = startDays + Math.round((timelineDays - startDays) * (i / points));

    const val =
      type === "colony"
        ? calcColonyStatsAt(data, day).total
        : calcMissionStatsAt(data, day).total;

    // Garantiza que empiece en 0
    return { x: i, waste: Math.max(0, Math.round(val - baseValue)) };
  });

  return arr;
}, [selected, timelineDays, type, data]);


  // preparar pie chart de materiales (actual)
  const pieData = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.breakdown || {}).map(([name, value]) => ({
      name,
      value: Math.round(value),
    }));
  }, [stats]);

  // Colores para el pie
  const PIE_COLORS = [COLORS.yellow, COLORS.blue, COLORS.purple, COLORS.pink];

  // Labels auxiliares
  const membersLabel =
    data.members && Array.isArray(data.members) ? `${data.members.length} — ${data.members.join(", ")}` : data.members || null;

  // imagen a mostrar: preferir data.image, si no data.map
  const heroImage = data.image || data.map || null;

  // Tooltip personalizado para el Pie (muestra color del sector para cada item)
  const CustomPieTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div
        style={{
          backgroundColor: COLORS.bgCard,
          padding: 8,
          borderRadius: 8,
          border: "1px solid #222",
          minWidth: 140,
        }}
      >
        {payload.map((p, i) => {
          const percent =
            typeof p.payload?.percent === "number" ? Math.round(p.payload.percent * 100) : null;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 8,
                marginBottom: 6,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 6,
                    backgroundColor: p.color || PIE_COLORS[i % PIE_COLORS.length],
                    display: "inline-block",
                  }}
                />
                <span style={{ color: "#cfe6eb", fontSize: 13, textTransform: "capitalize" }}>
                  {p.name}
                  {percent !== null ? ` • ${percent}%` : ""}
                </span>
              </div>

              <div style={{ color: COLORS.accent, fontWeight: 700, fontSize: 13 }}>
                {p.value?.toLocaleString ? `${p.value.toLocaleString()} kg` : `${p.value} kg`}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <aside
      className="fixed right-6 top-[80px] w-[540px] max-w-[92vw] max-h-[84vh] overflow-auto bg-[#071014] border border-[#333] rounded-xl p-0 z-60 shadow-lg"
      role="dialog"
      aria-modal="true"
    >
      {/* Hero: imagen + título */}
      <div className="w-full">
        {heroImage ? (
          <div className="relative w-full h-44 md:h-48 overflow-hidden rounded-t-xl">
            <img src={heroImage} alt={`${data.name} preview`} className="w-full h-full object-cover" />
            <div className="absolute left-4 bottom-3 bg-black bg-opacity-50 px-3 py-1 rounded">
              <h3 className="text-lg font-bold text-[#E27B58]">{data.name}</h3>
              <div className="text-xs text-[#cfe6eb]">
                {type === "colony" ? `Colony • ${data.population?.toLocaleString() ?? "—"} members` : `${data.missionType ?? "Mission"}`}
              </div>
            </div>
            <button
              onClick={onClose}
              className="absolute right-3 top-3 bg-black bg-opacity-40 p-1 rounded text-white hover:bg-opacity-60"
              aria-label="Cerrar"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#222] rounded-t-xl">
            <div>
              <h3 className="text-lg font-bold text-[#E27B58]">{data.name}</h3>
              <div className="text-xs text-[#cfe6eb]">
                {type === "colony" ? `Colonia • ${data.population?.toLocaleString() ?? "—"} pax` : `${data.missionType ?? "Misión"}`}
              </div>
            </div>
            <button onClick={onClose} className="text-white">✕</button>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3 text-sm text-[#d0cfcf]">
        {/* breve descripcion */}
        {data.description && (
          <div className="bg-[#0b1417] border border-[#222] rounded-lg p-3">
            <div className="text-xs uppercase text-[#98b3bd] mb-1">Description</div>
            <div className="text-sm text-[#cfe6eb]">{excerpt(data.description, 220)}</div>
          </div>
        )}

        {/* Top stats cards: si es colonia, renderiza EXACTAMENTE como tenías; si es misión, muestra solo lo pedido */}
        {type === "colony" ? (
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#0b1417] border border-[#222] rounded-lg p-3">
              <div className="text-xs uppercase text-[#98b3bd]">Date</div>
              <div className="font-semibold text-white">{data.date ? formatDate(data.date) : data.established ? formatDate(data.established) : "-"}</div>
            </div>

            <div className="bg-[#0b1417] border border-[#222] rounded-lg p-3">
              <div className="text-xs uppercase text-[#98b3bd]">Waste</div>
              <div className="font-semibold text-white">{stats ? `${Math.round(stats.total).toLocaleString()} kg` : "—"}</div>
              <div className="text-xs text-[#9fb7c0] mt-1">{stats ? `${Math.round(stats.dailyWaste)} kg/day` : ""}</div>
            </div>

            <div className="bg-[#0b1417] border border-[#222] rounded-lg p-3">
              <div className="text-xs uppercase text-[#98b3bd]">Estimated energy</div>
              <div className="font-semibold text-[#9bd8ff]">{stats ? `${Math.round(stats.energy).toLocaleString()} kWh` : "—"}</div>
            </div>

            <div className="bg-[#0b1417] border border-[#222] rounded-lg p-3">
              <div className="text-xs uppercase text-[#98b3bd]">Dangerous</div>
              <div className="font-semibold text-pink-400">{stats ? `${Math.round(stats.hazardous).toLocaleString()} kg` : "—"}</div>
            </div>
          </div>
        ) : (
          // Misión: versión simplificada
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#0b1417] border border-[#222] rounded-lg p-3">
              <div className="text-xs uppercase text-[#98b3bd]">Start</div>
              <div className="font-semibold text-white">
                {stats?.start ? formatDate(stats.start) : (data.date ? formatDate(data.date) : "-")}
              </div>
            </div>

            <div className="bg-[#0b1417] border border-[#222] rounded-lg p-3">
              <div className="text-xs uppercase text-[#98b3bd]">End</div>
              <div className="font-semibold text-white">
                {stats?.end ? formatDate(stats.end) : (data.endDate ? formatDate(data.endDate) : "—")}
              </div>
            </div>

            <div className="bg-[#0b1417] border border-[#222] rounded-lg p-3 col-span-2">
              <div className="text-xs uppercase text-[#98b3bd]">Total Waste</div>
              <div className="font-semibold text-white text-lg">
                {stats ? `${Math.round(stats.total).toLocaleString()} kg` : "—"}
              </div>
            </div>

          </div>
        )}

{/* centro: grafico + pie + detalles (SE MUESTRA SOLO PARA COLONIAS, idéntico a tu bloque original) */}
{type === "colony" && (
  <div className="bg-[#071014] border border-[#222] rounded-xl p-3">
    <div className="flex gap-3">
      {/* mini line chart */}
      <div style={{ width: 200, height: 100 }}>
        <ResponsiveContainer width="100%" height="100%">
  <LineChart data={trendData} margin={{ top: 10, right: 5, bottom: 0, left: -20 }}>
    <XAxis
      dataKey="x"
      axisLine={false}
      tickLine={false}
      tick={false}
      tickFormatter={() => ""}
    />
    <YAxis
      axisLine={false}
      tickLine={false}
      tick={false}
      tickFormatter={() => ""}
      domain={["auto", "auto"]}
    />
    <Tooltip
      contentStyle={{
        backgroundColor: COLORS.bgCard,
        border: "none",
        color: "white",
        fontSize: 11,
      }}
      labelStyle={{ display: "none" }}
    />
    <Line
      type="monotone"
      dataKey="waste"
      stroke={COLORS.accent}
      strokeWidth={2}
      dot={false}
      isAnimationActive={false}
    />
  </LineChart>
</ResponsiveContainer>

      </div>

      {/* pie */}
      <div style={{ width: 120, height: 100 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius={28}
              outerRadius={45}
              paddingAngle={3}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex-1">
        <div className="text-sm text-[#cfe6eb]">
          <strong>Total waste:</strong>{" "}
          <span className="text-white text-lg font-bold">{stats ? `${Math.round(stats.total).toLocaleString()} kg` : "-"}</span>
        </div>
        {type === "colony" && (
          <div className="mt-1 text-sm text-[#d0cfcf]">
            <strong>Population:</strong> {data.population?.toLocaleString() ?? "-"}
          </div>
        )}
        {type === "mission" && data.members && (
          <div className="mt-1 text-sm text-[#d0cfcf]">
            <strong>Members:</strong> {membersLabel}
          </div>
        )}
      </div>
    </div>
  </div>
)}
        

        {/* mapa interactivo para colonias (imagen + tachos) */}
        {type === "colony" && data.map && data.bins && (
          <div className="mt-2">
            <div className="relative w-full h-56 border border-[#333] rounded-lg overflow-hidden">
              <img src={data.map} alt={`${data.name} map`} className="w-full h-full object-cover" />
              {data.bins.map((bin) => {
                // calcular basura por tacho
                const established = new Date(data.established);
                const startDays = Math.floor((established - START_DATE) / (1000 * 60 * 60 * 24));
                const activeDays = Math.max(timelineDays - startDays, 0);
                const waste = Math.round(bin.baseWaste + bin.rate * activeDays);
                return (
                  <div
                    key={bin.id}
                    className="absolute flex flex-col items-center cursor-pointer group"
                    style={{
                      left: bin.x,
                      top: bin.y,
                      transform: "translate(-50%, -50%)",
                    }}
                    title={`${bin.description} — ${waste} kg`}
                  >
                    <span className="text-[10px] bg-black bg-opacity-70 px-1 rounded mb-0.5 opacity-0 group-hover:opacity-100 transition">
                      {bin.description}
                    </span>
                    <Trash2 className="w-6 h-6 text-black" />
                    <span className="text-[11px] bg-black bg-opacity-70 px-1 rounded mt-0.5 opacity-0 group-hover:opacity-100 transition">
                      {waste} kg
                    </span>
                  </div>
                );
              })}
            </div>

            <p className="mt-2 text-sm font-semibold text-white text-center">
              Total Waste: {stats ? Math.round(stats.total).toLocaleString() + " kg" : "-"}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
