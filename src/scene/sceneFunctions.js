import { camera } from '../components/Escene'; // Asegúrate de exportar la cámara desde Escene.jsx

export const focusCameraOnPoint = (section) => {
  console.log(`Focusing camera on section: ${section}`);
  
  switch (section) {
    case 'inicio':
      camera.position.set(0, 2, 20);
      break;
    case 'sobre-mi':
      camera.position.set(0, 2, 10);
      break;
    case 'proyectos':
      camera.position.set(0, 2, 5);
      break;
    case 'habilidades':
      camera.position.set(0, 2, 0);
      break;
    case 'contacto':
      camera.position.set(0, 2, -5);
      break;
    case 'cv':
      camera.position.set(0, 2, -10);
      break;
    default:
      camera.position.set(0, 2, 20);
  }
  camera.lookAt(0, 0, 0); // Asegúrate de que la cámara mire hacia el centro de la escena
};