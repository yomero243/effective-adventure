import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * @interface ParticlesData
 * @description Holds the data for the particle system.
 * @property {Float32Array} velocities - The velocities of the particles.
 * @property {Float32Array} lifetimes - The remaining lifetime of each particle.
 * @property {Float32Array} colors - The colors of the particles.
 * @property {Float32Array} sizes - The sizes of the particles.
 * @property {number} count - The total number of particles.
 */
interface ParticlesData {
  velocities: Float32Array;
  lifetimes: Float32Array;
  colors: Float32Array;
  sizes: Float32Array;
  count: number;
}

/**
 * @interface MousePosition
 * @description Represents the position of the mouse in 3D space.
 * @property {number} x - The x-coordinate.
 * @property {number} y - The y-coordinate.
 * @property {number} z - The z-coordinate.
 */
interface MousePosition {
  x: number;
  y: number;
  z: number;
}

/**
 * @component ParticlesInstance
 * @description Renders a dynamic particle system that reacts to mouse movement.
 * Particles are simulated with physics-like behavior, including velocity, gravity, and lifetimes.
 * They are respawned either around a central figure or at the mouse's position.
 * @returns {JSX.Element} The rendered Three.js points object.
 */
const ParticlesInstance: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);
  const mousePosition = useRef<MousePosition>({ x: 0, y: 0, z: 0 });

  // Particle animation variables
  const particlesData = useRef<ParticlesData>({
    velocities: new Float32Array(8000 * 3),
    lifetimes: new Float32Array(8000),
    colors: new Float32Array(8000 * 3),
    sizes: new Float32Array(8000),
    count: 8000
  });

  // Initialize particle data
  useEffect(() => {
    for (let i = 0; i < particlesData.current.count; i++) {
      const i3 = i * 3;

      // Varied velocities
      particlesData.current.velocities[i3] = (Math.random() - 0.5) * 0.3;
      particlesData.current.velocities[i3 + 1] = Math.random() * 0.2 + 0.05;
      particlesData.current.velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;

      // Dynamic colors (RGB)
      const hue = Math.random() * 360;
      const saturation = 0.7 + Math.random() * 0.3;
      const lightness = 0.5 + Math.random() * 0.5;
      const color = new THREE.Color().setHSL(hue / 360, saturation, lightness);

      particlesData.current.colors[i3] = color.r;
      particlesData.current.colors[i3 + 1] = color.g;
      particlesData.current.colors[i3 + 2] = color.b;

      // Varied sizes
      particlesData.current.sizes[i] = Math.random() * 0.8 + 0.2;

      particlesData.current.lifetimes[i] = Math.random() * 60 + 30;
    }
  }, []);

  // Create particle texture with a radial gradient
  const textureRef = useRef<THREE.Texture | null>(null);
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const context = canvas.getContext('2d');

    if (context) {
      const gradient = context.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 32, 32);

      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      textureRef.current = texture;
    }
  }, []);

  // Handle mouse movement to update particle spawn location
  const { viewport } = useThree();
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      mousePosition.current.x = x * viewport.width / 2;
      mousePosition.current.y = y * viewport.height / 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [viewport]);

  // Animation loop for particles using useFrame
  useFrame((state) => {
    if (!particlesRef.current) return;

    const time = state.clock.getElapsedTime();
    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const colors = particlesRef.current.geometry.attributes.color.array as Float32Array;
    const sizes = particlesRef.current.geometry.attributes.size.array as Float32Array;
    const { velocities, lifetimes, count } = particlesData.current;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Movement with sine waves for more fluidity
      positions[i3] += velocities[i3] + Math.sin(time + i * 0.01) * 0.001;
      positions[i3 + 1] += velocities[i3 + 1];
      positions[i3 + 2] += velocities[i3 + 2] + Math.cos(time + i * 0.01) * 0.001;

      // Gravity and air resistance
      velocities[i3] *= 0.999;
      velocities[i3 + 1] -= 0.003;
      velocities[i3 + 2] *= 0.999;

      // Color animation based on lifetime
      const lifeRatio = lifetimes[i] / 60;
      colors[i3] = particlesData.current.colors[i3] * lifeRatio;
      colors[i3 + 1] = particlesData.current.colors[i3 + 1] * lifeRatio;
      colors[i3 + 2] = particlesData.current.colors[i3 + 2] * lifeRatio;

      // Size animation
      sizes[i] = particlesData.current.sizes[i] * lifeRatio * (1 + Math.sin(time * 2 + i * 0.1) * 0.2);

      lifetimes[i]--;

      // Respawn particle if its lifetime is over or it's out of view
      if (lifetimes[i] <= 0 || positions[i3 + 1] < -viewport.height / 2 - 2) {
        // Spawn around the 3D figure and from the mouse
        const spawnFromFigure = Math.random() > 0.3; // 70% from figure, 30% from mouse

        if (spawnFromFigure) {
          // Spawn around the figure (central position)
          const radius = 2 + Math.random() * 3;
          const angle = Math.random() * Math.PI * 2;
          const height = Math.random() * 3 - 0.5;

          positions[i3] = Math.cos(angle) * radius;
          positions[i3 + 1] = height;
          positions[i3 + 2] = Math.sin(angle) * radius;
        } else {
          // Spawn from the mouse with dispersion
          const spread = 0.5;
          positions[i3] = mousePosition.current.x + (Math.random() - 0.5) * spread;
          positions[i3 + 1] = mousePosition.current.y + (Math.random() - 0.5) * spread;
          positions[i3 + 2] = mousePosition.current.z + (Math.random() - 0.5) * spread;
        }

        velocities[i3] = (Math.random() - 0.5) * 0.3;
        velocities[i3 + 1] = Math.random() * 0.2 + 0.05;
        velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;

        // New random color
        const hue = Math.random() * 360;
        const color = new THREE.Color().setHSL(hue / 360, 0.8, 0.7);
        particlesData.current.colors[i3] = color.r;
        particlesData.current.colors[i3 + 1] = color.g;
        particlesData.current.colors[i3 + 2] = color.b;

        lifetimes[i] = Math.random() * 60 + 30;
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
    particlesRef.current.geometry.attributes.color.needsUpdate = true;
    particlesRef.current.geometry.attributes.size.needsUpdate = true;
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
        <bufferAttribute
          attach="attributes-color"
          count={particlesData.current.count}
          array={particlesData.current.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particlesData.current.count}
          array={particlesData.current.sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.9}
        map={textureRef.current}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// Export the particle instance component, wrapped in memo for performance optimization.
const Particles = React.memo(ParticlesInstance);
Particles.displayName = 'Particles';

export default Particles; 