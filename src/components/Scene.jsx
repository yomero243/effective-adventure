/* eslint-disable react/no-unknown-property */
import React, { useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Center, 
  PerspectiveCamera,
} from '@react-three/drei';
import Particles from './Particles';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Precargar el modelo
useGLTF.preload('./Template.glb');

// Componente para el modelo 3D
const ModelComponent = () => {
  const { scene } = useGLTF('./Template.glb');
  
  React.useEffect(() => {
    // Escalar el modelo
    scene.scale.set(0.3, 0.3, 0.3);
  }, [scene]);
  
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
};

const Model = React.memo(ModelComponent);
Model.displayName = 'Model';

// Componente para las luces
const LightsComponent = () => {
  return (
    <>
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={1} />
      <ambientLight intensity={0.3} />
    </>
  );
};

const Lights = React.memo(LightsComponent);
Lights.displayName = 'Lights';

// Posiciones de la cámara para diferentes secciones - Acercadas
const cameraPositions = {
  inicio: { x: 0, y: 1.5, z: 10 }, // Más cerca
  "sobre-mi": { x: 10, y: 1.5, z: 0 }, // Más cerca
  proyectos: { x: -10, y: 1.5, z: 0 }, // Más cerca
  habilidades: { x: 0, y: 10, z: 0 }, // Más cerca
  contacto: { x: 0, y: 1.5, z: -10 }, // Más cerca
  cv: { x: 0, y: -5, z: 5 } // Más cerca
};

// Componente que escucha los eventos de navegación y mueve la cámara
const CameraControllerComponent = () => {
  const { camera } = useThree();
  const controlsRef = useRef();

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
        duration: 1.5, // Duración ligeramente reducida para la nueva distancia
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
      makeDefault
    />
  );
};

const CameraController = React.memo(CameraControllerComponent);
CameraController.displayName = 'CameraController';

const Scene = () => {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas 
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <color attach="background" args={[0x111111]} /> {/* Fondo oscuro */}
        <PerspectiveCamera makeDefault position={[0, 1.5, 10]} fov={75} near={0.1} far={1000} /> {/* Posición inicial actualizada */}
        <Lights />
        <Model />
        <CameraController />
        <Particles />
      </Canvas>
    </div>
  );
};

export default Scene;
