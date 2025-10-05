import { useState, useEffect, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

import MarsControlsPanel from "../components/planets/MarsControlsPanel";
import SolarSystem from "../components/planets/SolarSystem";
import WaypointInfo from "../components/planets/WaypointInfo";

const START_DATE = new Date("1960-01-01");
const END_DATE = new Date("2050-12-31");
const MAX_DAYS = Math.round((END_DATE - START_DATE) / (1000 * 60 * 60 * 24));
const MAX_YEARS = Math.floor(MAX_DAYS / 365);

export default function MarsProSimulatorPage() {
  const [centerOnMars, setCenterOnMars] = useState(true);
  const [timelineDays, setTimelineDays] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [showColonies, setShowColonies] = useState(true);
  const [showMissions, setShowMissions] = useState(true);

  const [selectedWaypoint, setSelectedWaypoint] = useState(null);

  const simulatedYears = useMemo(() => timelineDays / 365, [timelineDays]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setTimelineDays((prev) => {
        if (prev >= MAX_DAYS) {
          setPlaying(false);
          return MAX_DAYS;
        }
        return prev + 5;
      });
    }, 50);
    return () => clearInterval(id);
  }, [playing]);

  return (
    <div className="w-full min-h-screen bg-black text-white font-[Orbitron, sans-serif] p-6 pt-24 relative">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-extrabold text-[#FF9D6F]">
          WasteSimulator - Mars
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <MarsControlsPanel
          timelineDays={timelineDays}
          setTimelineDays={setTimelineDays}
          simulatedYears={simulatedYears}
          playing={playing}
          setPlaying={setPlaying}
          centerOnMars={centerOnMars}
          setCenterOnMars={setCenterOnMars}
          showColonies={showColonies}
          setShowColonies={setShowColonies}
          showMissions={showMissions}
          setShowMissions={setShowMissions}
          maxDays={MAX_DAYS}
          maxYears={MAX_YEARS}
        />

        <div className="flex-1 h-[720px] rounded-2xl overflow-hidden shadow-xl">
          <Canvas camera={{ position: [0, 6, 14], fov: 50 }}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[10, 10, 10]} intensity={1} />

            <SolarSystem
              timelineDays={timelineDays}
              centerOnMars={centerOnMars}
              showColonies={showColonies}
              showMissions={showMissions}
              onSelect={(selection) => setSelectedWaypoint(selection)}
            />
          </Canvas>
        </div>
      </div>

      <WaypointInfo
        selected={selectedWaypoint}
        onClose={() => setSelectedWaypoint(null)}
        timelineDays={timelineDays} // 🔑 lo pasamos aquí
      />

      {/* 📜 Footer tipo copyright */}
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          width: "100%",
          textAlign: "center",
          fontSize: "12px",
          color: "white",
          opacity: 0.7,
          fontFamily: "sans-serif",
          pointerEvents: "none",
        }}
      >
        The data was based on simulations and analog missions.
      </div>
    </div>
  );
}
