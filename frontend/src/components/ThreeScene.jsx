// frontend/src/components/ThreeScene.jsx
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default function ThreeScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentRef = mountRef.current;

    // === Escena, cámara y renderer ===
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      currentRef.clientWidth / currentRef.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 4);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setSize(currentRef.clientWidth, currentRef.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
    currentRef.appendChild(renderer.domElement);

    // === Luz ===
    const light = new THREE.DirectionalLight(0xffffff, 1.1);
    light.position.set(5, 5, 5);
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 20;
    light.shadow.camera.left = -5;
    light.shadow.camera.right = 5;
    light.shadow.camera.top = 5;
    light.shadow.camera.bottom = -5;
    scene.add(light);

    scene.add(new THREE.AmbientLight(0x404040, 0.6));

    // === Texturas ===
    const textureLoader = new THREE.TextureLoader();
    const marsTexture = textureLoader.load("/textures/mars.jpg");

    // === Cargar GLB de las lunas ===
    const gltfLoader = new GLTFLoader();
    let phobosGLB = null;
    let deimosGLB = null;

    const phobosPromise = new Promise((resolve) => {
      gltfLoader.load("/models/phobos.glb", (gltf) => {
        phobosGLB = gltf.scene;
        resolve();
      }, undefined, () => resolve());
    });

    const deimosPromise = new Promise((resolve) => {
      gltfLoader.load("/models/deimos.glb", (gltf) => {
        deimosGLB = gltf.scene;
        resolve();
      }, undefined, () => resolve());
    });

    // === Marte (solo textura base) ===
    const mars = new THREE.Mesh(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.MeshStandardMaterial({ map: marsTexture })
    );
    mars.castShadow = true;
    mars.receiveShadow = true;
    scene.add(mars);

    // === Lunas (fallback esfera si GLB no carga) ===
    const phobosTexture = textureLoader.load("/textures/moons/phobos.jpg");
    const deimosTexture = textureLoader.load("/textures/moons/deimos.jpg");

    const phobos = phobosGLB || new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 32, 32),
      new THREE.MeshStandardMaterial({ map: phobosTexture })
    );
    phobos.position.set(1.8, 0.3, 0);
    scene.add(phobos);

    const deimos = deimosGLB || new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 32, 32),
      new THREE.MeshStandardMaterial({ map: deimosTexture })
    );
    deimos.position.set(-2.5, -0.2, 0);
    scene.add(deimos);

    // === Reemplazar con GLB si cargan ===
    Promise.all([phobosPromise, deimosPromise]).then(() => {
      if (phobosGLB) {
        phobosGLB.scale.set(0.01, 0.01, 0.01);
        phobosGLB.position.copy(phobos.position);
        scene.remove(phobos);
        scene.add(phobosGLB);
      }
      if (deimosGLB) {
        deimosGLB.scale.set(0.008, 0.008, 0.008);
        deimosGLB.position.copy(deimos.position);
        scene.remove(deimos);
        scene.add(deimosGLB);
      }
    });

    // === OrbitControls ===
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 2.7;
    controls.maxDistance = 8;

    // === Animación ===
    const animate = () => {
      requestAnimationFrame(animate);

      mars.rotation.y += 0.002;

      const time = Date.now() * 0.0005;
      const currentPhobos = phobosGLB || phobos;
      const currentDeimos = deimosGLB || deimos;

      currentPhobos.position.x = Math.cos(time * 3) * 1.8;
      currentPhobos.position.z = Math.sin(time * 3) * 1.8;
      currentPhobos.position.y = Math.sin(time * 2) * 0.2;

      currentDeimos.position.x = Math.cos(time * 1.5) * 2.5;
      currentDeimos.position.z = Math.sin(time * 1.5) * 2.5;
      currentDeimos.position.y = Math.sin(time) * 0.1;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      currentRef.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full" />;
}
