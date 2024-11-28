import { useEffect } from 'react';
import * as THREE from 'three';

const App = () => {
  useEffect(() => {
    // Crear la escena
    const scene = new THREE.Scene();

    // Crear una cámara
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Crear un renderizador
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Crear una geometría y un material, y luego un cubo
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Función para actualizar la escena
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotar el cubo
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;

      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return null;
};

export default App;
