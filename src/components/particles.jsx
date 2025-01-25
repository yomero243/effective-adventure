import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Particles = () => {
  const particlesRef = useRef(null);
  const mousePosition = useRef({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 2;

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    particlesRef.current.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);
    const velocities = new Float32Array(particlesCount * 3);
    const lifetimes = new Float32Array(particlesCount);

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      posArray[i3] = 0;
      posArray[i3 + 1] = 0;
      posArray[i3 + 2] = 0;
      
      velocities[i3] = (Math.random() - 0.5) * 0.2;
      velocities[i3 + 1] = Math.random() * 0.15;
      velocities[i3 + 2] = 0;
      
      lifetimes[i] = Math.random() * 30;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      sizeAttenuation: true,
      color: '#ffffff',
      transparent: true,
      opacity: 0.8,
      map: (() => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const context = canvas.getContext('2d');
        context.fillStyle = '#ffffff';
        context.fillRect(0, 0, 32, 32);
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
      })()
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      const vector = new THREE.Vector3(x, y, 0.5).unproject(camera);
      mousePosition.current = { x: vector.x, y: vector.y, z: vector.z };
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      const positions = particlesGeometry.attributes.position.array;

      for (let i = 0; i < particlesCount; i++) {
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

      particlesGeometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
    };
  }, []);

  return <div ref={particlesRef} style={{ width: '100%', height: '100%' }} />;
};

export default Particles;