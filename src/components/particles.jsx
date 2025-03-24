import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Componente que renderiza un efecto de partículas que siguen al cursor
 * @returns {JSX.Element} Componente de partículas
 */
const ParticlesEffect = () => {
  const particlesRef = useRef();
  const mousePosition = useRef({ x: 0, y: 0, z: 0 });
  
  // Variables para animación de partículas
  const particlesData = useRef({
    velocities: new Float32Array(5000 * 3),
    lifetimes: new Float32Array(5000),
    count: 5000
  });

  // Inicializar datos de partículas
  React.useEffect(() => {
    for (let i = 0; i < particlesData.current.count; i++) {
      const i3 = i * 3;
      particlesData.current.velocities[i3] = (Math.random() - 0.5) * 0.2;
      particlesData.current.velocities[i3 + 1] = Math.random() * 0.15;
      particlesData.current.velocities[i3 + 2] = 0;
      
      particlesData.current.lifetimes[i] = Math.random() * 30;
    }
  }, []);

  // Crear partícula con degradado radial (textura)
  const textureRef = useRef();
  React.useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d');
    
    const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 32, 32);
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    textureRef.current = texture;
  }, []);

  // Manejar movimiento del mouse
  const { viewport } = useThree();
  React.useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Convertir coordenadas de pantalla a coordenadas del mundo
      mousePosition.current.x = x * viewport.width / 2;
      mousePosition.current.y = y * viewport.height / 2;
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [viewport]);

  // Bucle de animación para partículas con useFrame
  useFrame(() => {
    if (!particlesRef.current) return;
    
    const positions = particlesRef.current.geometry.attributes.position.array;
    const { velocities, lifetimes, count } = particlesData.current;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      positions[i3] += velocities[i3];
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2];

      velocities[i3 + 1] -= 0.002;

      lifetimes[i]--;

      if (lifetimes[i] <= 0 || positions[i3 + 1] < -2) {
        positions[i3] = mousePosition.current.x;
        positions[i3 + 1] = mousePosition.current.y;
        positions[i3 + 2] = mousePosition.current.z;
        
        velocities[i3] = (Math.random() - 0.5) * 0.2;
        velocities[i3 + 1] = Math.random() * 0.15;
        velocities[i3 + 2] = 0;
        
        lifetimes[i] = Math.random() * 30;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesData.current.count}
          array={new Float32Array(particlesData.current.count * 3)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        sizeAttenuation
        color="#ffffff"
        transparent
        opacity={0.8}
        map={textureRef.current}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const Particles = () => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
      <Canvas
        style={{ width: '100%', height: '100%' }}
        camera={{ position: [0, 0, 2], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ParticlesEffect />
      </Canvas>
    </div>
  );
};

export default React.memo(Particles);