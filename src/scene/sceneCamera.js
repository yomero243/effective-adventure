import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Exportar la cámara para que pueda ser utilizada en otros componentes
export let camera = null;

// Crea un hook personalizado para acceder y manejar la cámara de R3F
export const useSceneCamera = () => {
  const { camera } = useThree();
  
  const focusCameraOnPosition = (position) => {
    if (!camera) return;
    
    // Usar los métodos de three para posicionar la cámara
    camera.position.set(position.x, position.y, position.z);
    camera.lookAt(0, 0, 0);
    
    // Notificar a R3F que se ha actualizado la cámara
    camera.updateProjectionMatrix();
  };
  
  return { camera, focusCameraOnPosition };
};

// Función para crear una cámara de referencia (para ser utilizada fuera de React Three Fiber si es necesario)
export const createReferenceCamera = (width, height) => {
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(0, 2, 20);
  return camera;
};

// Inicializar la cámara
export const initializeCamera = (width, height) => {
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(0, 2, 20);
  return camera;
}; 