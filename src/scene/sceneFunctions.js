import gsap from "gsap";

const cameraPositions = {
  inicio: { x: 0, y: 2, z: 20 },
  "sobre-mi": { x: 20, y: 2, z: 0 },
  proyectos: { x: -20, y: 2, z: 0 },
  habilidades: { x: 0, y: 20, z: 0 },
  contacto: { x: 0, y: 2, z: -20 },
  cv: { x: 0, y: -10, z: 10 }
};

// Función única para controlar la cámara, tanto para componentes react como para eventos personalizados
export const focusCameraOnPoint = (section) => {
  // Disparar un evento personalizado para que el CameraController lo maneje
  window.dispatchEvent(new CustomEvent('camera-navigation', { 
    detail: { section } 
  }));
};