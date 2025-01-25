import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Particles from './Particles';
import { focusCameraOnPoint } from "../scene/sceneFunctions";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Buttons from './Buttons';

gsap.registerPlugin(ScrollTrigger);

export let camera;

const Scene = () => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    sceneRef.current = new THREE.Scene();
    sceneRef.current.background = new THREE.Color(0xf8fafc);
    rendererRef.current = new THREE.WebGLRenderer({ antialias: true });

    // Configurar cámara
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 2, 20);

    rendererRef.current.setSize(width, height);
    currentMount.appendChild(rendererRef.current.domElement);

    // Configurar controles
    const controls = new OrbitControls(camera, rendererRef.current.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableRotate = true;

    // Añadir luces
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(5, 5, 5);
    sceneRef.current.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(-5, -5, -5);
    sceneRef.current.add(directionalLight2);

    // Añadir modelo
    const loader = new GLTFLoader();
    loader.load(
      './Template.glb', 
      (gltf) => {
        const model = gltf.scene;
        
        // Escalar el modelo a un tamaño más pequeño
        model.scale.set(0.3, 0.3, 0.3); 

        sceneRef.current.add(model);
        
        // Centrar el modelo
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);
        
        // Actualizar controles después de cargar el modelo
        controls.target.copy(center);
        controls.update();
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );

    // Añadir animación
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      rendererRef.current.render(sceneRef.current, camera);
    };

    animate();

    // Manejar el resize
    const handleResize = () => {
      const width = currentMount.clientWidth;
      const height = currentMount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      currentMount.removeChild(rendererRef.current.domElement);
      controls.dispose();
      rendererRef.current.dispose();
    };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <div
        ref={mountRef}
        style={{
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'auto',
          touchAction: 'none'
        }}
      />
      <Particles />
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
        <Buttons />
      </div>
    </div>
  );
};

export default Scene;
