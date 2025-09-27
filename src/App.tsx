import React from 'react';
import Scene from './components/Scene';
import Buttons from './components/Buttons';
import MouseEffect from './components/MouseEffect';
import './App.css';

/**
 * @component App
 * @description The main application component that structures the layout for the portfolio.
 * It integrates a fixed 3D background scene, a custom mouse effect, a navigation sidebar,
 * and the main scrollable content area with different sections.
 * @returns {React.FC} The rendered application component.
 */
const App: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gray-30"> {/* Main relative container */}

      {/* 1. Fixed 3D Scene in the Background */}
      {/* z-0: Base layer */}
      <div className="fixed top-0 left-0 w-full h-full z-0">
        <Scene />
      </div>

      {/* Mouse Effect (if global 2D, it can go here, over the scene) */}
      {/* z-10: Above the scene */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-10">
        <MouseEffect />
      </div>


      {/* 2. Fixed Buttons (e.g., on the left) */}
      {/* z-30: Top layer for interaction */}
      <div className="fixed top-0 left-0 h-screen z-30">
        <Buttons />
      </div>

      {/* 3. Scrollable Main Content */}
      {/* z-20: Above the scene, below the buttons */}
      <main className="relative z-20 ml-16">
        <section id="inicio" className="min-h-screen flex items-center justify-center text-center p-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-6">
              Welcome
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-8 backdrop-blur-sm bg-black/20 rounded-lg p-6">
              Frontend Developer specializing in immersive web experiences
            </p>
            <div className="flex gap-4 justify-center">
              <button className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
                View Projects
              </button>
              <button className="px-8 py-3 border border-white/30 rounded-full text-white backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                Contact
              </button>
            </div>
          </div>
        </section>
        
        <section id="sobre-mi" className="min-h-screen flex items-center justify-center text-center p-4">
          <div className="max-w-4xl mx-auto backdrop-blur-lg bg-white/10 rounded-2xl p-8 border border-white/20">
            <h1 className="text-5xl font-bold text-white mb-6">About Me</h1>
            <p className="text-lg text-white/90 leading-relaxed mb-6">
              Passionate developer dedicated to creating unique web experiences that combine technology and art.
              Specializing in React, Three.js, and advanced animations.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-sm text-white/80">Performance</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl mb-2">🎨</div>
                <div className="text-sm text-white/80">Design</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl mb-2">📱</div>
                <div className="text-sm text-white/80">Responsive</div>
              </div>
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <div className="text-2xl mb-2">🚀</div>
                <div className="text-sm text-white/80">Innovation</div>
              </div>
            </div>
          </div>
        </section>
        
        <section id="proyectos" className="min-h-screen flex items-center justify-center text-center p-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-bold text-white mb-12">Featured Projects</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="backdrop-blur-lg bg-white/10 rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 group">
                  <div className="h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg mb-4 group-hover:scale-105 transition-transform duration-300"></div>
                  <h3 className="text-xl font-semibold text-white mb-2">Project {i}</h3>
                  <p className="text-white/70 text-sm">Description of the project with modern technologies</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        <section id="habilidades" className="min-h-screen flex items-center justify-center text-center p-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-white mb-12">Technical Skills</h1>
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
                <h3 className="text-2xl font-semibold text-white mb-4">Tools</h3>
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
            <h1 className="text-5xl font-bold text-white mb-6">Contact</h1>
            <p className="text-white/90 mb-8">Have a project in mind? Let's talk!</p>
            <div className="space-y-4">
              <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
                📧 Send Email
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
            <h1 className="text-5xl font-bold text-white mb-6">Resume</h1>
            <p className="text-white/90 mb-8">Download my updated CV</p>
            <div className="p-6 border-2 border-dashed border-white/30 rounded-lg mb-6">
              <div className="text-4xl mb-4">📄</div>
              <p className="text-white/70">CV_Frontend_Developer.pdf</p>
            </div>
            <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg text-white font-semibold hover:shadow-lg hover:shadow-green-500/50 transition-all duration-300">
              ⬇️ Download CV
            </button>
          </div>
        </section>
      </main>

    </div>
  );
};

export default React.memo(App); 