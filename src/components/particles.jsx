import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Particles = ({ count = 1000 }) => {
  const particlesRef = useRef();
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count);

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10; // x
      positions[i * 3 + 1] = Math.random() * 5; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z

      velocities[i] = Math.random() * 0.02 + 0.01; // Velocidad hacia arriba
    }

    particlesRef.current.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
  }, [count]);

  useFrame(() => {
    const positionArray = particlesRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      positionArray[i * 3 + 1] += velocities[i]; // Incrementar posición en Y
      if (positionArray[i * 3 + 1] > 5) {
        positionArray[i * 3 + 1] = 0; // Reiniciar posición Y
      }
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry />
      <pointsMaterial 
        size={0.1} 
        color={"orange"} 
        transparent 
        opacity={0.8} 
        blending={THREE.AdditiveBlending} 
      />
    </points>
  );
};

export default Particles;
