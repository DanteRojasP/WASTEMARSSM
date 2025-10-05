import { useRef, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import Mars from "./Mars";

export default function SolarSystem({
  timelineDays,
  centerOnMars,
  showColonies,
  showMissions,
  onSelect,
}) {
  const controlsRef = useRef();
  const { camera } = useThree();

  // Cámara centrada en Marte
  useEffect(() => {
    if (!controlsRef.current) return;
    controlsRef.current.target.set(0, 0, 0);

    if (centerOnMars) {
      camera.position.set(0, 6, 14);
    } else {
      camera.position.set(0, 30, 60);
    }
  }, [centerOnMars, camera]);

  return (
    <group>
      <Mars
        timelineDays={timelineDays}
        showColonies={showColonies}
        showMissions={showMissions}
        centerOnMars={centerOnMars}
        onSelect={onSelect}
      />

      {/* Controles con límites de zoom */}
      <OrbitControls
        ref={controlsRef}
        enableZoom
        enablePan
        enableRotate
        minDistance={8}   // 🔴 acercamiento máximo
        maxDistance={80}  // 🔵 alejamiento máximo
      />
    </group>
  );
}
