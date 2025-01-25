import gsap from "gsap";
import { camera } from "../components/Scene";

const cameraPositions = {
  inicio: { x: 0, y: 2, z: 20 },
  "sobre-mi": { x: 20, y: 2, z: 0 },
  proyectos: { x: -20, y: 2, z: 0 },
  habilidades: { x: 0, y: 20, z: 0 },
  contacto: { x: 0, y: 2, z: -20 },
  cv: { x: 0, y: -10, z: 10 }
};

export const focusCameraOnPoint = (section) => {
  if (!camera) return;
  
  const position = cameraPositions[section];
  if (!position) return;

  gsap.to(camera.position, {
    x: position.x,
    y: position.y,
    z: position.z,
    duration: 2,
    ease: "power2.inOut",
    onUpdate: () => {
      camera.lookAt(0, 0, 0);
    }
  });
};