import React from 'react';
import Scene from './components/Escene';
import Buttons from './components/Buttons';

const App = () => {
  return (
    <div className="min-h-screen relative">
      <Scene />
      <div className="absolute top-0 left-0 pointer-events-none z-10">
        <div className="pointer-events-auto">
          <Buttons />
        </div>
      </div>
    </div>
  );
};

export default App;
