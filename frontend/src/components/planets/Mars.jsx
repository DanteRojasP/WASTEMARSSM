import { useRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { COLONIES } from "../../data/colonies";
import { MISSIONS } from "../../data/missions";

const marsTexture = "/textures/mars/mars_color.jpg";
const deimosTexture = "/textures/moons/deimos.jpg";

const MARS = {
  name: "Marte",
  radius: 3389,
  orbit: 227.9e6,
  period: 687, 
  glbPath: null, 
};

const DIST_SCALE = 1 / 5e5;
const SIZE_SCALE = 1 / 1000;

const PHOBOS = {
  glbPath: "/models/phobos.glb",
  radius: 22.6,
  distance: 9376,
  period: 0.3189,
};

const DEIMOS = {
  glbPath: "/models/deimos.glb",
  radius: 12.4,
  distance: 23463,
  period: 1.263,
};

const START_DATE = new Date("1960-01-01");

function latLongToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function SpaceBackground({ starCount = 7000 }) {
  const starsRef = useRef();

  const starsPositions = useMemo(() => {
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;
    }
    return positions;
  }, [starCount]);

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0005;
      starsRef.current.rotation.x += 0.0002;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starsPositions.length / 3}
          array={starsPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={0xffffff}
        size={0.8}
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  );
}

export default function Mars({
  timelineDays,
  showOrbit,
  showLabel,
  centerOnMars,
  showColonies,
  showMissions,
  onSelect,
}) {
  const marsGroupRef = useRef();
  const marsMeshRef = useRef();
  const phobosRef = useRef();
  const deimosRef = useRef();

  const marsDistance = MARS.orbit * DIST_SCALE;
  const marsSize = Math.max(MARS.radius * SIZE_SCALE, 0.6);

  const phobosSize = Math.max(PHOBOS.radius * SIZE_SCALE * 0.2, 0.05);
  const deimosSize = Math.max(DEIMOS.radius * SIZE_SCALE * 0.2, 0.04);

  const phobosDist = (MARS.radius + PHOBOS.distance) * SIZE_SCALE;
  const deimosDist = (MARS.radius + DEIMOS.distance) * SIZE_SCALE;

  const [colorMap, deimosMap] = useLoader(THREE.TextureLoader, [
    marsTexture,
    deimosTexture,
  ]);

  const phobosGLB = PHOBOS.glbPath ? useGLTF(PHOBOS.glbPath).scene : null;
  const deimosGLB = DEIMOS.glbPath ? useGLTF(DEIMOS.glbPath).scene : null;
  const marsGLB = MARS.glbPath ? useGLTF(MARS.glbPath).scene : null;

  const currentDate = new Date(
    START_DATE.getTime() + timelineDays * 24 * 60 * 60 * 1000
  );

  const shouldShowColonies =
    typeof showColonies !== "undefined" ? showColonies : !!showLabel;
  const shouldShowMissions =
    typeof showMissions !== "undefined" ? showMissions : !!showLabel;

  useFrame(({ clock }) => {
    const elapsedDays = timelineDays + clock.getElapsedTime() / 86400;

    if (marsGroupRef.current) {
      if (centerOnMars) {
        marsGroupRef.current.position.set(0, 0, 0);
      } else {
        const angle = ((2 * Math.PI) / MARS.period) * timelineDays;
        const x = marsDistance * Math.cos(angle);
        const z = marsDistance * Math.sin(angle);
        marsGroupRef.current.position.set(x, 0, z);
      }
    }

    if (phobosRef.current) {
      const angle = ((2 * Math.PI) / PHOBOS.period) * elapsedDays * 300;
      const x = phobosDist * Math.cos(angle);
      const z = phobosDist * Math.sin(angle);
      phobosRef.current.position.set(x, 0, z);
    }

    if (deimosRef.current) {
      const angle = ((2 * Math.PI) / DEIMOS.period) * elapsedDays * 300;
      const x = deimosDist * Math.cos(angle);
      const z = deimosDist * Math.sin(angle);
      deimosRef.current.position.set(x, 0, z);
    }
  });

  return (
    <>
      <SpaceBackground />

      <group ref={marsGroupRef}>
        {marsGLB ? (
          <primitive object={marsGLB} scale={[marsSize, marsSize, marsSize]} />
        ) : (
          <mesh ref={marsMeshRef}>
            <sphereGeometry args={[marsSize, 64, 64]} />
            <meshStandardMaterial map={colorMap} />
          </mesh>
        )}

        {phobosGLB ? (
          <primitive
            ref={phobosRef}
            object={phobosGLB}
            scale={[phobosSize, phobosSize, phobosSize]}
          />
        ) : (
          <mesh ref={phobosRef}>
            <sphereGeometry args={[phobosSize, 32, 32]} />
            <meshStandardMaterial map={deimosMap} />
          </mesh>
        )}

        {deimosGLB ? (
          <primitive
            ref={deimosRef}
            object={deimosGLB}
            scale={[deimosSize, deimosSize, deimosSize]}
          />
        ) : (
          <mesh ref={deimosRef}>
            <sphereGeometry args={[deimosSize, 32, 32]} />
            <meshStandardMaterial map={deimosMap} />
          </mesh>
        )}

        {!centerOnMars && showOrbit && (
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[marsDistance - 0.02, marsDistance + 0.02, 128]} />
            <meshBasicMaterial
              color="red"
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}

        {shouldShowColonies &&
          COLONIES.filter((c) => new Date(c.established) <= currentDate).map(
            (colony, i) => {
              const basePos = latLongToVector3(
                colony.lat,
                colony.lon,
                marsSize + 0.05
              );
              const offset = new THREE.Vector3(0, i * 0.15, 0);

              return (
                <Html
                  key={colony.id}
                  position={basePos.add(offset).toArray()}
                  distanceFactor={8}
                  zIndexRange={[0, 5]} 
                >
                  <div
                    className="colony-marker marker-3d cursor-pointer"
                    role="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelect) onSelect({ type: "colony", data: colony });
                    }}
                  >
                    <svg viewBox="0 0 100 100" className="hexagon-icon">
                      <polygon
                        points="50,5 95,27 95,73 50,95 5,73 5,27"
                        transform="scale(0.8,1) translate(12.5,0)"
                        stroke="#e27b58"
                        fill="none"
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="label" style={{ color: "#e27b58" }}>
                      {colony.name}
                    </div>
                  </div>
                </Html>
              );
            }
          )}

        {shouldShowMissions &&
          MISSIONS.filter((m) => new Date(m.date) <= currentDate).map(
            (mission, i) => {
              const posVec = latLongToVector3(
                mission.lat,
                mission.lon,
                marsSize + 0.12 + i * 0.02
              );
              return (
                <Html
                  key={mission.id}
                  position={posVec.toArray()}
                  distanceFactor={8}
                  zIndexRange={[0, 5]} 
                >
                  <div
                    className="colony-marker marker-3d cursor-pointer"
                    role="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onSelect)
                        onSelect({ type: "mission", data: mission });
                    }}
                  >
                    <svg viewBox="0 0 100 100" className="hexagon-icon">
                      <polygon
                        points="50,5 95,27 95,73 50,95 5,73 5,27"
                        transform="scale(0.8,1) translate(12.5,0)"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="label">{mission.name}</div>
                  </div>
                </Html>
              );
            }
          )}
      </group>
    </>
  );
}
