import React from 'react';
import Buttons from './components/Buttons';
import Scene from './components/Escene';

const App = () => {
  return (
    <div className="min-h-screen bg-transparent pt-20">
      <Scene />
      <Buttons />
    </div>
  );
};

export default App;
