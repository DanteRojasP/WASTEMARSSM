import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, useTexture } from "@react-three/drei";

function Mars() {
  const texture = useTexture("/textures/mars.jpg");
  return (
    <mesh rotation={[0, Math.PI * 0.2, 0]}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export default function ThreeScene(){
  return (
    <div className="w-full h-[80vh]">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5,5,5]} intensity={1} />
        <Suspense fallback={<Html><div className="text-white">Cargando...</div></Html>}>
          <Mars />
        </Suspense>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}