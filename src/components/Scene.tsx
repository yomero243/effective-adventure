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

// Interfaces
interface CameraNavigationEvent extends Event {
  detail: {
    section: string;
  };
}

interface CameraPosition {
  x: number;
  y: number;
  z: number;
}

interface CameraPositions {
  [key: string]: CameraPosition;
}

// Componente para el modelo 3D
const ModelComponent: React.FC = () => {
  const { scene } = useGLTF('./Template.glb');
  
  React.useEffect(() => {
    scene.scale.set(0.6, 0.6, 0.6);
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
const LightsComponent: React.FC = () => {
  return (
    <group>
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <directionalLight position={[-5, -5, -5]} intensity={1} />
      <ambientLight intensity={0.3} />
    </group>
  );
};

const Lights = React.memo(LightsComponent);
Lights.displayName = 'Lights';

// Posiciones de la cámara para diferentes secciones
const cameraPositions: CameraPositions = {
  inicio: { x: 0, y: 1.5, z: 10 },
  "sobre-mi": { x: 10, y: 1.5, z: 0 },
  proyectos: { x: -10, y: 1.5, z: 0 },
  habilidades: { x: 0, y: 10, z: 0 },
  contacto: { x: 0, y: 1.5, z: -10 },
  cv: { x: 0, y: -5, z: 5 }
};

// Componente que escucha los eventos de navegación y mueve la cámara
const CameraControllerComponent: React.FC = () => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const handleCameraNavigation = (event: Event) => {
      const customEvent = event as CameraNavigationEvent;
      const { section } = customEvent.detail;
      const position = cameraPositions[section];
      
      if (!position) return;

      gsap.to(camera.position, {
        x: position.x,
        y: position.y,
        z: position.z,
        duration: 1.5,
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

const Scene: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas style={{width: '100%',height: '100%'}}>
        <color attach="background" args={[0x111111]} />
        <PerspectiveCamera makeDefault position={[0, 1.5, 10]} fov={75} near={0.1} far={1000} />
        <Lights />
        <Model />
        <CameraController />
        <Particles />
      </Canvas>
    </div>
  );
};

export default Scene; 