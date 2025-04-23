import React from 'react';
import Scene from './components/Scene';
import Buttons from './components/Buttons';
import MouseEffect from './components/MouseEffect';
import './App.css';

/**
 * Componente principal de la aplicación con estructura para secciones y escena fija.
 * @returns {JSX.Element} Componente App
 */
const App = () => {
  return (
    <div className="relative min-h-screen bg-white"> {/* Contenedor principal relativo */}

      {/* 1. Escena 3D Fija en el Fondo */}
      {/* z-0: Capa base */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <Scene />
      </div>

      {/* Efecto de Mouse (si es 2D global, puede ir aquí, sobre la escena) */}
      {/* z-10: Sobre la escena */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-10">
        <MouseEffect />
      </div>


      {/* 2. Botones Fijos (ej: a la izquierda) */}
      {/* Ajustar 'w-64' al ancho real MÁXIMO de tus botones/barra lateral */}
      {/* z-30: Capa superior para interacción */}
      <div className="fixed top-0 left-0 h-screen z-30"> {/* w-xx se maneja dentro de Buttons */}
        <Buttons />
      </div>

      {/* 3. Contenido Principal Desplazable */}
      {/* ml-xx debe coincidir con el ancho MÍNIMO de Buttons (cuando está colapsado) */}
      {/* Ajustar 'ml-16' al ancho MÍNIMO de Buttons (cuando solo muestra emojis) */}
      {/* z-20: Sobre la escena, debajo de los botones */}
      <main className="relative z-20 ml-16"> {/* O ajusta el margen según el ancho colapsado de Buttons */}
        {/* Añadir las secciones requeridas por Buttons y ScrollTrigger */}
        {/* Usar clases de Tailwind para dar estilo y altura */}
        <section id="inicio" className="min-h-screen flex items-center justify-center text-center p-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Sección Inicio</h1>
            <p className="text-gray-600 mt-2">Contenido de la sección inicial.</p>
          </div>
        </section>
        <section id="sobre-mi" className="min-h-screen flex items-center justify-center text-center p-4 bg-gray-50">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Sección Sobre Mí</h1>
            <p className="text-gray-600 mt-2">Información sobre mí.</p>
           </div>
        </section>
        <section id="proyectos" className="min-h-screen flex items-center justify-center text-center p-4">
           <div>
            <h1 className="text-4xl font-bold text-gray-800">Sección Proyectos</h1>
            <p className="text-gray-600 mt-2">Mis proyectos destacados.</p>
           </div>
        </section>
        <section id="habilidades" className="min-h-screen flex items-center justify-center text-center p-4 bg-gray-50">
           <div>
            <h1 className="text-4xl font-bold text-gray-800">Sección Habilidades</h1>
            <p className="text-gray-600 mt-2">Mis habilidades técnicas.</p>
           </div>
        </section>
        <section id="contacto" className="min-h-screen flex items-center justify-center text-center p-4">
           <div>
            <h1 className="text-4xl font-bold text-gray-800">Sección Contacto</h1>
            <p className="text-gray-600 mt-2">Formulario o información de contacto.</p>
           </div>
        </section>
        <section id="cv" className="min-h-screen flex items-center justify-center text-center p-4 bg-gray-50">
           <div>
            <h1 className="text-4xl font-bold text-gray-800">Sección CV</h1>
            <p className="text-gray-600 mt-2">Enlace o visualización del CV.</p>
           </div>
        </section>
      </main>

    </div>
  );
};

export default React.memo(App);
