import React, { useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import Particles from './Particles';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Buttons from './Buttons';

gsap.registerPlugin(ScrollTrigger);

// Componente para el modelo 3D
const Model = () => {
  const { scene } = useGLTF('./Template.glb');
  
  React.useEffect(() => {
    // Escalar el modelo
    scene.scale.set(0.3, 0.3, 0.3);
    
    // Centrar el modelo
    const box = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    scene.position.sub(center);
    
    return () => {
      // Limpieza
      useGLTF.preload('./Template.glb');
    };
  }, [scene]);
  
  return <primitive object={scene} />;
};

// Componente para las luces
const Lights = () => {
  return (
    <>
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={1} />
    </>
  );
};

// Componente que escucha los eventos de navegación y mueve la cámara
const CameraController = () => {
  const { camera } = useThree();
  const controlsRef = useRef();

  // Posiciones de la cámara para diferentes secciones
  const cameraPositions = {
    inicio: { x: 0, y: 2, z: 20 },
    "sobre-mi": { x: 20, y: 2, z: 0 },
    proyectos: { x: -20, y: 2, z: 0 },
    habilidades: { x: 0, y: 20, z: 0 },
    contacto: { x: 0, y: 2, z: -20 },
    cv: { x: 0, y: -10, z: 10 }
  };

  // Escuchar eventos de navegación
  useEffect(() => {
    const handleCameraNavigation = (event) => {
      const { section } = event.detail;
      const position = cameraPositions[section];
      
      if (!position) return;

      gsap.to(camera.position, {
        x: position.x,
        y: position.y,
        z: position.z,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          camera.lookAt(0, 0, 0);
          if (controlsRef.current) {
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
          }
        }
      });
    };

    window.addEventListener('camera-navigation', handleCameraNavigation);
    
    return () => {
      window.removeEventListener('camera-navigation', handleCameraNavigation);
    };
  }, [camera]);

  // Actualizar los controles en cada frame
  useFrame(() => {
    if (controlsRef.current) {
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls 
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      enableZoom
      enablePan
      enableRotate
    />
  );
};

const Scene = () => {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas 
        style={{
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'auto',
          touchAction: 'none'
        }}
        camera={{ position: [0, 2, 20], fov: 75, near: 0.1, far: 1000 }}
      >
        <color attach="background" args={[0xf8fafc]} />
        <Lights />
        <Model />
        <CameraController />
      </Canvas>
      <Particles />
      <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
        <Buttons />
      </div>
    </div>
  );
};

export default Scene;
