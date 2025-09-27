/* eslint-disable react/no-unknown-property */
import React, { useEffect, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Center, 
  PerspectiveCamera,
} from '@react-three/drei';
import * as THREE from 'three';
import Particles from './Particles';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Preload the model
useGLTF.preload('./Template.glb');

/**
 * @interface CameraNavigationEvent
 * @description Defines the custom event dispatched for camera navigation.
 * @extends Event
 * @property {object} detail - The detail object containing the section ID.
 * @property {string} detail.section - The ID of the section to navigate to.
 */
interface CameraNavigationEvent extends Event {
  detail: {
    section: string;
  };
}

/**
 * @interface CameraPosition
 * @description Represents a 3D camera position.
 * @property {number} x - The x-coordinate.
 * @property {number} y - The y-coordinate.
 * @property {number} z - The z-coordinate.
 */
interface CameraPosition {
  x: number;
  y: number;
  z: number;
}

/**
 * @interface CameraPositions
 * @description A map of section IDs to their corresponding camera positions.
 */
interface CameraPositions {
  [key: string]: CameraPosition;
}

/**
 * @component ModelComponent
 * @description Loads, positions, and animates the main 3D model in the scene.
 * It includes a subtle breathing and rotation animation.
 * @returns {JSX.Element} The centered 3D model.
 */
const ModelComponent: React.FC = () => {
  const { scene } = useGLTF('./Template.glb');
  const modelRef = useRef<THREE.Group>(null);

  React.useEffect(() => {
    // Set appropriate scale for a person
    scene.scale.set(1, 1, 1);

    // Center the model on the ground
    scene.position.set(0, 0, 0);
  }, [scene]);

  // Subtle breathing/natural movement animation
  useFrame((state) => {
    if (modelRef.current) {
      const time = state.clock.getElapsedTime();
      // Subtle breathing movement
      modelRef.current.position.y = Math.sin(time * 0.8) * 0.02;
      // Very subtle rotation to show different angles
      modelRef.current.rotation.y = Math.sin(time * 0.1) * 0.05;
    }
  });

  return (
    <Center>
      <group ref={modelRef}>
        <primitive object={scene} />
      </group>
    </Center>
  );
};

const Model = React.memo(ModelComponent);
Model.displayName = 'Model';

/**
 * @component LightsComponent
 * @description Sets up and animates the lighting for the 3D scene,
 * including key, fill, rim, and spot lights to create a dynamic and dramatic effect.
 * @returns {JSX.Element} A group of animated lights.
 */
const LightsComponent: React.FC = () => {
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Main light that follows the figure
    if (keyLightRef.current) {
      keyLightRef.current.position.x = 3 + Math.sin(time * 0.3) * 1;
      keyLightRef.current.position.y = 4;
      keyLightRef.current.position.z = 5 + Math.cos(time * 0.3) * 0.5;
      keyLightRef.current.intensity = 1.2 + Math.sin(time * 1.5) * 0.2;
    }

    // Soft fill light
    if (fillLightRef.current) {
      fillLightRef.current.intensity = 0.4 + Math.sin(time * 0.8) * 0.1;
    }

    // Rim light to create a dramatic silhouette
    if (rimLightRef.current) {
      rimLightRef.current.position.x = -4 + Math.cos(time * 0.4) * 0.5;
      rimLightRef.current.intensity = 0.8 + Math.sin(time * 2) * 0.3;
    }

    // Dynamic spotlight from above
    if (spotLightRef.current) {
      spotLightRef.current.intensity = 0.6 + Math.sin(time * 1.2) * 0.2;
      spotLightRef.current.position.y = 6 + Math.sin(time * 0.5) * 0.5;
    }
  });

  return (
    <group>
      {/* Key Light */}
      <directionalLight
        ref={keyLightRef}
        position={[3, 4, 5]}
        intensity={1.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Fill Light */}
      <directionalLight
        ref={fillLightRef}
        position={[-2, 2, 3]}
        intensity={0.4}
        color="#e0e7ff"
      />

      {/* Rim Light */}
      <directionalLight
        ref={rimLightRef}
        position={[-4, 3, -2]}
        intensity={0.8}
        color="#fbbf24"
      />

      {/* Spotlight from above */}
      <spotLight
        ref={spotLightRef}
        position={[0, 6, 2]}
        target-position={[0, 0, 0]}
        intensity={0.6}
        color="#a855f7"
        angle={Math.PI / 6}
        penumbra={0.5}
        distance={20}
      />

      {/* Soft ambient light */}
      <ambientLight intensity={0.15} color="#4c1d95" />

      {/* Hemisphere light for natural ambiance */}
      <hemisphereLight
        args={["#ddd6fe", "#1e1b4b", 0.2]}
      />
    </group>
  );
};

const Lights = React.memo(LightsComponent);
Lights.displayName = 'Lights';

/**
 * @constant cameraPositions
 * @description Defines the camera positions for each section of the portfolio, focused on the 3D model.
 */
const cameraPositions: CameraPositions = {
  inicio: { x: 0, y: 1, z: 8 },        // Frontal presentation view
  "sobre-mi": { x: 4, y: 1.5, z: 6 },   // Slightly lateral view to show profile
  proyectos: { x: -5, y: 2, z: 7 },     // Left lateral view, showing creativity
  habilidades: { x: 2, y: 3, z: 5 },    // Elevated view to show skills
  contacto: { x: -3, y: 0.5, z: 6 },    // Closer and more intimate view
  cv: { x: 0, y: -1, z: 9 }              // Full body view
};

/**
 * @component CameraControllerComponent
 * @description Manages camera movement, animating it between predefined positions based on navigation events.
 * It also integrates OrbitControls for manual camera manipulation.
 * @returns {JSX.Element} The OrbitControls component.
 */
const CameraControllerComponent: React.FC = () => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    const handleCameraNavigation = (event: Event) => {
      const customEvent = event as CameraNavigationEvent;
      const { section } = customEvent.detail;
      const position = cameraPositions[section];

      if (!position) return;

      // Dramatic animation with camera rotation
      const timeline = gsap.timeline();

      // First, zoom out slightly
      timeline.to(camera.position, {
        z: camera.position.z + 5,
        duration: 0.3,
        ease: "power1.out"
      })
      // Then, main movement with a curve
      .to(camera.position, {
        x: position.x,
        y: position.y,
        z: position.z,
        duration: 2,
        ease: "power3.inOut",
        onUpdate: () => {
          // Dynamic rotation towards the model
          camera.lookAt(
            Math.sin(Date.now() * 0.001) * 0.5,
            Math.cos(Date.now() * 0.0008) * 0.3,
            0
          );
          if (controlsRef.current) {
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.update();
          }
        }
      })
      // "Settle" effect at the end
      .to(camera.position, {
        x: position.x + Math.sin(Date.now() * 0.01) * 0.1,
        y: position.y + Math.cos(Date.now() * 0.01) * 0.1,
        duration: 0.5,
        ease: "elastic.out(1, 0.5)"
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

/**
 * @component AnimatedBackground
 * @description Creates a dynamic, animated background using a custom shader material.
 * The shader generates a vibrant, waving gradient.
 * @returns {JSX.Element} A mesh with the animated shader material.
 */
const AnimatedBackground: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    if (meshRef.current) {
      // Slow rotation of the background
      meshRef.current.rotation.z = time * 0.02;
      meshRef.current.rotation.x = Math.sin(time * 0.01) * 0.1;
    }

    if (materialRef.current) {
      materialRef.current.uniforms.time.value = time;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -50]} scale={[100, 100, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={{
          time: { value: 0 },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float time;
          varying vec2 vUv;
          
          void main() {
            vec2 uv = vUv;
            
            // Base gradient with vibrant colors
            vec3 color1 = vec3(0.15, 0.1, 0.35);
            vec3 color2 = vec3(0.3, 0.15, 0.6);
            vec3 color3 = vec3(0.1, 0.2, 0.5);
            
            // More complex wave effects
            float wave1 = sin(uv.x * 8.0 + time * 0.8) * 0.15;
            float wave2 = cos(uv.y * 6.0 + time * 0.6) * 0.15;
            float wave3 = sin((uv.x + uv.y) * 4.0 + time * 0.4) * 0.1;
            
            vec3 color = mix(color1, color2, uv.y + wave1);
            color = mix(color, color3, uv.x + wave2 + wave3);
            
            // Add subtle shimmer
            color += vec3(0.05) * sin(time * 2.0 + uv.x * 20.0) * sin(time * 1.5 + uv.y * 15.0);
            
            gl_FragColor = vec4(color, 1.0);
          }
        `}
      />
    </mesh>
  );
};

/**
 * @component Scene
 * @description The main component that assembles the entire 3D scene,
 * including the background, camera, lights, model, particles, and post-processing effects.
 * @returns {JSX.Element} The main canvas containing the 3D scene.
 */
const Scene: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh' }}>
      <Canvas style={{width: '100%',height: '100%'}}>
        <AnimatedBackground />
        <PerspectiveCamera makeDefault position={[0, 2, 12]} fov={75} near={0.1} far={1000} />
        <Lights />
        <Model />
        <CameraController />
        <Particles />
        {/* Post-processing effects */}
        <fog attach="fog" args={['#1a1a2e', 20, 100]} />
      </Canvas>
    </div>
  );
};

export default Scene; 