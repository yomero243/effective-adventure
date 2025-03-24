import React from 'react';
import Scene from './components/Scene';
import Buttons from './components/Buttons';
import MouseEffect from './components/MouseEffect';
import './App.css';

/**
 * Componente principal de la aplicación
 * @returns {JSX.Element} Componente App
 */
const App = () => {
  return (
    <div className="app-container">
      <MouseEffect />
      <Scene />
      <div 
        className="absolute top-0 left-0 pointer-events-none z-10"
        role="complementary"
        aria-label="Menú de navegación"
      >
        <div className="pointer-events-auto">
          <Buttons />
        </div>
      </div>
    </div>
  );
};

export default React.memo(App);
