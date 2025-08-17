import React from 'react';
import Scene from './components/Scene';
import Buttons from './components/Buttons';
import MouseEffect from './components/MouseEffect';
import './App.css';

/**
 * Componente principal de la aplicación con estructura para secciones y escena fija.
 */
const App: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gray-30"> {/* Contenedor principal relativo */}

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
      {/* z-30: Capa superior para interacción */}
      <div className="fixed top-0 left-0 h-screen z-30">
        <Buttons />
      </div>

      {/* 3. Contenido Principal Desplazable */}
      {/* z-20: Sobre la escena, debajo de los botones */}
      <main className="relative z-20 ml-16">
        <section id="inicio" className="min-h-screen flex items-center justify-center text-center p-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Bienvenido
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 backdrop-blur-sm bg-black/20 rounded-lg p-6">
              Desarrollador Frontend especializado en experiencias web inmersivas
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
                Ver Proyectos
              </button>
              <button className="px-8 py-3 border border-white/30 rounded-full text-white backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                Contacto
              </button>
            </div>
          </div>
        </section>
        
        <section id="sobre-mi" className="min-h-screen flex items-center justify-center text-center p-4">
          <div className="max-w-4xl mx-auto backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/20">
            <h1 className="text-5xl font-bold text-white mb-6">Sobre Mí</h1>
            <p className="text-lg text-white/90 leading-relaxed mb-6">
              Desarrollador apasionado por crear experiencias web únicas que combinan tecnología y arte. 
              Especializado en React, Three.js y animaciones avanzadas.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-sm text-white/80">Rendimiento</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl mb-2">🎨</div>
                <div className="text-sm text-white/80">Diseño</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl mb-2">📱</div>
                <div className="text-sm text-white/80">Responsive</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl mb-2">🚀</div>
                <div className="text-sm text-white/80">Innovación</div>
              </div>
            </div>
          </div>
        </section>
        
        <section id="proyectos" className="min-h-screen flex items-center justify-center text-center p-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-bold text-white mb-12">Proyectos Destacados</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                  <div className="h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"></div>
                  <h3 className="text-xl font-semibold text-white mb-2">Proyecto {i}</h3>
                  <p className="text-white/70 text-sm">Descripción del proyecto con tecnologías modernas</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section id="habilidades" className="min-h-screen flex items-center justify-center text-center p-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-white mb-12">Habilidades Técnicas</h1>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20">
                <h3 className="text-2xl font-semibold text-white mb-4">Frontend</h3>
                <div className="space-y-3">
                  {['React', 'TypeScript', 'Three.js', 'GSAP'].map((skill) => (
                    <div key={skill} className="flex justify-between items-center">
                      <span className="text-white/90">{skill}</span>
                      <div className="w-32 h-2 bg-white/20 rounded-full">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{width: '90%'}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20">
                <h3 className="text-2xl font-semibold text-white mb-4">Herramientas</h3>
                <div className="space-y-3">
                  {['Git', 'Webpack', 'Vite', 'Figma'].map((tool) => (
                    <div key={tool} className="flex justify-between items-center">
                      <span className="text-white/90">{tool}</span>
                      <div className="w-32 h-2 bg-white/20 rounded-full">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full" style={{width: '85%'}}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section id="contacto" className="min-h-screen flex items-center justify-center text-center p-4">
          <div className="max-w-2xl mx-auto backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/20">
            <h1 className="text-5xl font-bold text-white mb-6">Contacto</h1>
            <p className="text-white/90 mb-8">¿Tienes un proyecto en mente? ¡Hablemos!</p>
            <div className="space-y-4">
              <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
                📧 Enviar Email
              </button>
              <button className="w-full px-6 py-3 border border-white/30 rounded-lg text-white backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                💼 LinkedIn
              </button>
              <button className="w-full px-6 py-3 border border-white/30 rounded-lg text-white backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                🐱 GitHub
              </button>
            </div>
          </div>
        </section>
        
        <section id="cv" className="min-h-screen flex items-center justify-center text-center p-4">
          <div className="max-w-2xl mx-auto backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/20">
            <h1 className="text-5xl font-bold text-white mb-6">Currículum</h1>
            <p className="text-white/90 mb-8">Descarga mi CV actualizado</p>
            <div className="p-6 border-2 border-dashed border-white/30 rounded-lg mb-6">
              <div className="text-4xl mb-4">📄</div>
              <p className="text-white/70">CV_Desarrollador_Frontend.pdf</p>
            </div>
            <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300">
              ⬇️ Descargar CV
            </button>
          </div>
        </section>
      </main>

    </div>
  );
};

export default React.memo(App); 