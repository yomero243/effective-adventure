import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getParticleSystem } from '../utils/getParticleSystem';

const Particles = () => {
  const particlesRef = useRef(null);
  const mouseEmitter = useRef(new THREE.Object3D());
  
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    particlesRef.current.appendChild(renderer.domElement);

    scene.add(mouseEmitter.current);

    const particleEffect = getParticleSystem({
      camera,
      emitter: mouseEmitter.current,
      parent: scene,
      rate: 50.0,
      texture: '/img/fire.png'
    });

    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      mouseEmitter.current.position.set(x * 3, y * 2, 0);
    };

    const animate = () => {
      requestAnimationFrame(animate);
      particleEffect.update(0.016);
      renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      if (particlesRef.current) {
        particlesRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={particlesRef} 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
};

export default Particles;