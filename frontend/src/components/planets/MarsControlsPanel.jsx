// src/components/planets/MarsControlsPanel.jsx
import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { COLONIES } from "../../data/colonies";
import { MISSIONS } from "../../data/missions";

const START_DATE = new Date("1960-01-01");
const END_DATE = new Date("2050-12-31");

export default function MarsControlsPanel({
  timelineDays,
  setTimelineDays,
  maxYears,
  playing,
  setPlaying,
  showColonies,
  setShowColonies,
  showMissions,
  setShowMissions,
}) {
  const [openSection, setOpenSection] = useState(null);
  const toggleSection = (section) =>
    setOpenSection(openSection === section ? null : section);

  // Parámetros base
  const efficiency = 0.35; // fracción de capacidad de WasteMars (0..1). Interpretado como "potencial de reducción"
  const baseRate = 1.6; // kg por persona por día (por defecto)

  // Energía estimada por tipo (kWh/kg)
  const energyPerKgDefault = {
    organics: 0.02,
    plastics: 0.08,
    metals: 0.15,
    hazardous: 0.6,
  };

  // Factor por tipo de misión (ajusta el wastePerPersonDay si no existe)
  const missionTypeFactors = {
    crew: 1.0,
    rover: 0.05,
    cargo: 0.2,
    habitat: 0.9,
    lander: 0.3,
    flyby: 0.0,
  };

  // Calcular fecha actual en la simulación
  const currentDate = new Date(
    START_DATE.getTime() + timelineDays * 24 * 60 * 60 * 1000
  );

  // --- Cálculos globales ---
  const {
    colonyWaste,
    missionWaste,
    accumulatedWithout,
    accumulatedWith,
    accumulatedHazardous,
    estimatedKwhWithout,
    estimatedKwhWith,
    weightedRecyclingRate,
  } = useMemo(() => {
    let totalColony = 0;
    let totalMission = 0;
    let totalHazardous = 0;
    let totalKwh = 0;
    let totalKwhIfProcessed = 0;
    let recyclingWeightedSum = 0;

    // Colonias (solo después de su fecha de established)
    COLONIES.forEach((col) => {
      const established = new Date(col.established);
      const colStartDays = Math.floor(
        (established - START_DATE) / (1000 * 60 * 60 * 24)
      );
      const activeDays = Math.max(timelineDays - colStartDays, 0);
      if (activeDays <= 0) return;

      const perPerson = col.wastePerPersonDay ?? baseRate;
      const populationWaste = col.population * perPerson * activeDays;

      // Basura desde tachos (simulador simple)
      const binsWaste = (col.bins || []).reduce((s, bin) => {
        return s + (bin.baseWaste + bin.rate * activeDays);
      }, 0);

      const colonyTotal = populationWaste + binsWaste;
      totalColony += colonyTotal;

      // breakdown por materiales
      const profile = col.materialProfile || {
        organics: 0.5,
        plastics: 0.3,
        metals: 0.15,
        hazardous: 0.05,
      };
      Object.keys(profile).forEach((mat) => {
        const kg = colonyTotal * (profile[mat] || 0);
        const kwhPerKg = energyPerKgDefault[mat] ?? 0.05;
        totalKwh += kg * kwhPerKg;
        // si se procesa realmente (por ejemplo incineración/reciclaje)
        totalKwhIfProcessed += kg * kwhPerKg;
        if (mat === "hazardous") totalHazardous += kg;
      });

      recyclingWeightedSum += colonyTotal * (col.recyclingRate ?? 0.5);
    });

    // Misiones (considerando start/end/duration)
    MISSIONS.forEach((mission) => {
      const start = new Date(mission.date || mission.startDate);
      const missionStartDays = Math.floor(
        (start - START_DATE) / (1000 * 60 * 60 * 24)
      );
      // si tiene endDate tomamos duración, si no asumimos duración corta (nave/rover)
      const end = mission.endDate ? new Date(mission.endDate) : null;
      const durationDays = end
        ? Math.max(Math.floor((end - start) / (1000 * 60 * 60 * 24)), 1)
        : null;

      // días activos en timeline: entre 0 y duration (si existe)
      let activeDays = Math.max(timelineDays - missionStartDays, 0);
      if (durationDays !== null) activeDays = Math.min(activeDays, durationDays);

      if (activeDays <= 0) {
        // tarea no activa o ya no llegará
      } else {
        // Tasa por persona o por tipo de misión
        let perPerson = mission.wastePerPersonDay;
        if (!perPerson) {
          const f = missionTypeFactors[mission.missionType] ?? 0.2;
          perPerson = baseRate * f;
        }

        // Si la misión es rover/cargo que define wastePerMissionTotal, usar ese valor (distribuido en toda la duración)
        let missionTotal = 0;
        if (mission.wastePerMissionTotal) {
          // si la misión tiene una puesta total, consideramos la fracción según activeDays/duración
          if (durationDays) {
            missionTotal =
              (mission.wastePerMissionTotal * activeDays) / Math.max(durationDays, 1);
          } else {
            // si no hay duración definida, asumimos toda la basura en el día de actividad
            missionTotal = mission.wastePerMissionTotal;
          }
        } else if (mission.members && mission.members.length > 0) {
          missionTotal = mission.members.length * perPerson * activeDays;
        } else if (mission.payloadKg) {
          // cargo puede generar residuos proporcionales a payload
          missionTotal = (mission.wastePerMissionTotal || mission.payloadKg * 0.15);
        }

        // fallback: si tenemos wastePerPersonDay + members
        if (!missionTotal && mission.members && mission.members.length > 0) {
          missionTotal = mission.members.length * perPerson * activeDays;
        }

        totalMission += missionTotal;

        const profile = mission.materialProfile || {
          organics: 0.1,
          plastics: 0.5,
          metals: 0.3,
          hazardous: 0.1,
        };

        Object.keys(profile).forEach((mat) => {
          const kg = missionTotal * (profile[mat] || 0);
          const kwhPerKg =
            (mission.energyPerKg && mission.energyPerKg[mat]) ||
            energyPerKgDefault[mat] ||
            0.05;
          totalKwh += kg * kwhPerKg;
          totalKwhIfProcessed += kg * kwhPerKg;
          if (mat === "hazardous") totalHazardous += kg;
        });

        recyclingWeightedSum += missionTotal * (mission.recyclingRate ?? 0.25);
      }
    });

    const accumulated = totalColony + totalMission;
    const avgRecyclingRate = accumulated ? recyclingWeightedSum / accumulated : 0;

    // Aplicación de la "eficiencia" del sistema WasteMars:
    // interpreto 'efficiency' como potencia de reducción: accumulatedWith = accumulated * (1 - efficiency * avgRecyclingRate)
    const accumulatedWithImproved = Math.max(
      0,
      accumulated * (1 - efficiency * avgRecyclingRate)
    );

    const estimatedKwhWithout = totalKwh; // energía necesaria para tratarlo sin mejora
    const estimatedKwhWith = Math.max(0, totalKwhIfProcessed * (1 - efficiency * avgRecyclingRate));

    return {
      colonyWaste: totalColony,
      missionWaste: totalMission,
      accumulatedWithout: accumulated,
      accumulatedWith: accumulatedWithImproved,
      accumulatedHazardous: totalHazardous,
      estimatedKwhWithout,
      estimatedKwhWith,
      weightedRecyclingRate: avgRecyclingRate,
    };
  }, [timelineDays]);

  // === Data gráfica por años (para el mini-chart) ===
  const chartData = useMemo(() => {
    return Array.from({ length: maxYears + 1 }, (_, year) => {
      const days = year * 365;

      // calcular uso similar al principal pero por año (optimizado simplificado)
      let colonyY = 0;
      let missionY = 0;
      let recyclingWeighted = 0;

      COLONIES.forEach((col) => {
        const established = new Date(col.established);
        const colonyStartDays = Math.floor(
          (established - START_DATE) / (1000 * 60 * 60 * 24)
        );
        const activeDays = Math.max(days - colonyStartDays, 0);
        if (activeDays <= 0) return;
        const perPerson = col.wastePerPersonDay ?? baseRate;
        const populationWaste = col.population * perPerson * activeDays;
        const binsWaste = (col.bins || []).reduce((s, b) => {
          return s + (b.baseWaste + b.rate * activeDays);
        }, 0);
        const total = populationWaste + binsWaste;
        colonyY += total;
        recyclingWeighted += total * (col.recyclingRate ?? 0.5);
      });

      MISSIONS.forEach((mission) => {
        const start = new Date(mission.date || mission.startDate);
        const missionStartDays = Math.floor(
          (start - START_DATE) / (1000 * 60 * 60 * 24)
        );
        const end = mission.endDate ? new Date(mission.endDate) : null;
        const durationDays = end
          ? Math.max(Math.floor((end - start) / (1000 * 60 * 60 * 24)), 1)
          : null;
        let activeDays = Math.max(days - missionStartDays, 0);
        if (durationDays !== null) activeDays = Math.min(activeDays, durationDays);
        if (activeDays <= 0) return;

        let perPerson = mission.wastePerPersonDay;
        if (!perPerson) {
          const f = missionTypeFactors[mission.missionType] ?? 0.2;
          perPerson = baseRate * f;
        }

        let missionTotal = 0;
        if (mission.wastePerMissionTotal) {
          if (durationDays) {
            missionTotal =
              (mission.wastePerMissionTotal * activeDays) / Math.max(durationDays, 1);
          } else {
            missionTotal = mission.wastePerMissionTotal;
          }
        } else if (mission.members && mission.members.length > 0) {
          missionTotal = mission.members.length * perPerson * activeDays;
        } else if (mission.payloadKg) {
          missionTotal = (mission.wastePerMissionTotal || mission.payloadKg * 0.15);
        }

        missionY += missionTotal;
        recyclingWeighted += missionTotal * (mission.recyclingRate ?? 0.25);
      });

      const total = colonyY + missionY;
      const avgRec = total ? recyclingWeighted / total : 0;
      const totalEff = Math.max(0, total * (1 - efficiency * avgRec));

      return {
        year,
        colonias: Math.round(colonyY),
        misiones: Math.round(missionY),
        total: Math.round(total),
        totalEff: Math.round(totalEff),
      };
    });
  }, [maxYears]);

  // helpers UI
  function updateTimeline(newDate) {
    if (newDate > END_DATE) return;
    if (newDate < START_DATE) return;
    const newDays = Math.round((newDate - START_DATE) / (1000 * 60 * 60 * 24));
    setTimelineDays(newDays);
  }

  return (
    <div
      className="sticky top-[90px] self-start h-[calc(100vh-90px)] w-64 
                 bg-[#0f1113] border-r border-[#222] shadow-xl text-white 
                 overflow-y-auto z-50 pointer-events-auto"
    >
      <h2 className="text-xl font-bold text-center py-4 border-b border-[#222]">
        Mars Controls
      </h2>

      {/* Colonias */}
      <div className="border-b border-[#222]">
        <button
          onClick={() => toggleSection("colonies")}
          className="w-full text-left px-4 py-2 hover:bg-[#1a1d20] font-semibold"
        >
          Colonies
        </button>
        {openSection === "colonies" && (
          <div className="px-4 py-2 text-sm space-y-3">
            <div className="flex items-center justify-between">
              <span>Show</span>
              <button
                onClick={() => setShowColonies(!showColonies)}
                className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ${
                  showColonies ? "bg-[#34d399]" : "bg-gray-600"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                    showColonies ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Misiones */}
      <div className="border-b border-[#222]">
        <button
          onClick={() => toggleSection("missions")}
          className="w-full text-left px-4 py-2 hover:bg-[#1a1d20] font-semibold"
        >
          Missions
        </button>
        {openSection === "missions" && (
          <div className="px-4 py-2 text-sm space-y-3">
            <div className="flex items-center justify-between">
              <span>Show</span>
              <button
                onClick={() => setShowMissions(!showMissions)}
                className={`w-12 h-6 flex items-center rounded-full p-1 duration-300 ${
                  showMissions ? "bg-[#34d399]" : "bg-gray-600"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ${
                    showMissions ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="border-b border-[#222]">
        <button
          onClick={() => toggleSection("timeline")}
          className="w-full text-left px-4 py-2 hover:bg-[#1a1d20] font-semibold"
        >
          Timeline
        </button>
        {openSection === "timeline" && (
          <div className="px-4 py-3 text-sm space-y-3">
            <div>
              <label>Year: {currentDate.getFullYear()}</label>
              <input
                type="range"
                min="1960"
                max="2050"
                value={currentDate.getFullYear()}
                onChange={(e) => {
                  const newDate = new Date(currentDate);
                  newDate.setFullYear(Number(e.target.value));
                  updateTimeline(newDate);
                }}
                className="w-full"
              />
            </div>
            <div>
              <label>Month: {String(currentDate.getMonth() + 1).padStart(2, "0")}</label>
              <input
                type="range"
                min="1"
                max="12"
                value={currentDate.getMonth() + 1}
                onChange={(e) => {
                  const newDate = new Date(currentDate);
                  newDate.setMonth(Number(e.target.value) - 1);
                  updateTimeline(newDate);
                }}
                className="w-full"
              />
            </div>
            <div>
              <label>Day: {String(currentDate.getDate()).padStart(2, "0")}</label>
              <input
                type="range"
                min="1"
                max="31"
                value={currentDate.getDate()}
                onChange={(e) => {
                  const newDate = new Date(currentDate);
                  newDate.setDate(Number(e.target.value));
                  updateTimeline(newDate);
                }}
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPlaying(!playing)}
                className={`px-3 py-1 rounded ${playing ? "bg-red-500" : "bg-green-500"} text-black`}
              >
                {playing ? "Pause" : "Play"}
              </button>
              <button
                onClick={() => {
                  setTimelineDays(0);
                  setPlaying(false);
                }}
                className="px-3 py-1 rounded bg-gray-700"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>


      {/* Simulación */}
      <div className="border-b border-[#222]">
        <button
          onClick={() => toggleSection("sim")}
          className="w-full text-left px-4 py-2 hover:bg-[#1a1d20] font-semibold"
        >
          Simulation
        </button>
        {openSection === "sim" && (
          <div className="px-4 py-3 text-sm space-y-2">
            <p>
              Colony Waste:{" "}
              <b className="text-yellow-400">{Math.round(colonyWaste).toLocaleString()} kg</b>
            </p>
            <p>
              Mission Waste:{" "}
              <b className="text-blue-400">{Math.round(missionWaste).toLocaleString()} kg</b>
            </p>
            <p>
              Total (without upgrades):{" "}
              <b className="text-red-400">{Math.round(accumulatedWithout).toLocaleString()} kg</b>
            </p>
            <p>
              Total (with system):{" "}
              <b className="text-green-400">{Math.round(accumulatedWith).toLocaleString()} kg</b>
            </p>
            <p>
              Dangerous waste:{" "}
              <b className="text-pink-400">{Math.round(accumulatedHazardous).toLocaleString()} kg</b>
            </p>
            <p>
              Estimated energy (kWh):{" "}
              <b className="text-[#9bd8ff]">{Math.round(estimatedKwhWithout).toLocaleString()} kWh</b>
            </p>
            <p>
              Energy (optimized):{" "}
              <b className="text-[#7ee9b8]">{Math.round(estimatedKwhWith).toLocaleString()} kWh</b>
            </p>
            <p>
              Average recycling rate:{" "}
              <b className="text-[#34d399">
                {Math.round((weightedRecyclingRate || 0) * 100)}%
              </b>
            </p>

{/* Chart: Waste Evolution - With vs Without WasteMars (compact & clean) */}
<div className="mt-3 bg-[#071014] border border-[#222] rounded-xl p-2 shadow-lg">
  <h3 className="text-center text-[#E27B58] font-bold text-xs leading-tight mb-1">
    Waste Evolution (kg):<br /> Without vs With WasteMars
  </h3>

  <div style={{ width: "100%", height: 180 }}>
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 5, right: 6, left: -4, bottom: 0 }}
      >
        <defs>
          <linearGradient id="noWaste" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
          </linearGradient>
          <linearGradient id="yesWaste" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0.05} />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="year"
          tick={{ fill: "#888", fontSize: 9 }}
          stroke="#222"
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#888", fontSize: 9 }}
          stroke="#222"
          axisLine={false}
          tickLine={false}
          domain={[0, (dataMax) => dataMax * 1.1]} // start at 0, add 10% top padding
          allowDecimals={false}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: "#0B1A1F",
            border: "1px solid #222",
            borderRadius: "6px",
            color: "#fff",
            fontSize: "0.7rem",
          }}
        />
        <Legend
          wrapperStyle={{ color: "white", fontSize: "0.65rem" }}
          verticalAlign="top"
          height={20}
        />

        {/* Without WasteMars */}
        <Area
          type="monotone"
          dataKey="total"
          stroke="#ef4444"
          strokeWidth={1.8}
          fill="url(#noWaste)"
          name="Without WM"
          dot={{ r: 1.2 }}
          activeDot={{ r: 3 }}
          isAnimationActive={true}
          animationDuration={800}
        />

        {/* With WasteMars */}
        <Area
          type="monotone"
          dataKey="totalEff"
          stroke="#10b981"
          strokeWidth={1.8}
          fill="url(#yesWaste)"
          name="With WM"
          dot={{ r: 1.2 }}
          activeDot={{ r: 3 }}
          isAnimationActive={true}
          animationDuration={800}
        />
      </AreaChart>
    </ResponsiveContainer>
  </div>
</div>
          </div>
        )}
      </div>
  <div className="px-4 py-3 text-xs text-gray-400 text-center border-t border-[#222] mt-4">
    Data based on AI predictions
  </div>
    </div>
  );
}
