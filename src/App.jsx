import React from 'react';
import Buttons from './components/Buttons';
import Scene from './components/Escene';

const App = () => {
  return (
    <div className="min-h-screen">
      <Scene />
      <div className="absolute top-0 left-0">
        <Buttons />
      </div>
    </div>
  );
};

export default App;
