import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Particles from './particles';

export let camera; // Exporta la cámara

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
    controls.minDistance = 3;
    controls.maxDistance = 50;
    controls.target.set(0, 0, 0);
    controls.update();

    // Añadir luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    sceneRef.current.add(ambientLight);

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

        console.log('Modelo cargado y añadido a la escena');
      },
      undefined,
      (error) => {
        console.error('Error cargando el modelo:', error);
      }
    );

    // Añadir animación
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      rendererRef.current.render(sceneRef.current, camera);
      console.log('Renderizando escena');
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
    <>
      <div 
        ref={mountRef} 
        className="fixed inset-0 w-full h-full"
        style={{ 
          zIndex: 0,
          pointerEvents: 'auto', // Cambiar a auto para permitir interacción
          touchAction: 'none' // Importante para el funcionamiento del mouse
        }}
      />
      {sceneRef.current && rendererRef.current && (
        <SkyComponent scene={sceneRef.current} renderer={rendererRef.current} />
      )}
      <Particles /> {/* Añade el componente Particles aquí */}
    </>
  );
};

export default Scene;
