import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Particles from './Particles'; // Ruta corregida

export let camera; // Exporta la cámara

const Scene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 2, 20);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    currentMount.appendChild(renderer.domElement);

    // Añadir luces para ver mejor el modelo
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);

    // Configurar OrbitControls antes de cargar el modelo
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.enableRotate = true;
    controls.minDistance = 3;
    controls.maxDistance = 50;
    controls.target.set(0, 0, 0);
    controls.update();

    const loader = new GLTFLoader();
    loader.load(
      './template.glb', 
      (gltf) => {
        const model = gltf.scene;
        
        // Escalar el modelo a un tamaño más pequeño
        model.scale.set(0.3, 0.3, 0.3); 

        scene.add(model);
        
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
        console.error('Error cargando el modelo:', error);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Manejar el resize
    const handleResize = () => {
      const width = currentMount.clientWidth;
      const height = currentMount.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Limpieza
    return () => {
      window.removeEventListener('resize', handleResize);
      currentMount.removeChild(renderer.domElement);
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="fixed inset-0 w-full h-full"
      style={{ 
        zIndex: 0,
        pointerEvents: 'auto', // Cambiar a auto para permitir interacción
        touchAction: 'none' // Importante para el funcionamiento del mouse
      }}
    >
      <Particles /> {/* Añade el componente Particles aquí */}
    </div>
  );
};

export default Scene;
