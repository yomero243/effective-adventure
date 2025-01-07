import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Registrar Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/serviceWorker.js')
      .then(registration => {
        console.log('ServiceWorker registrado con éxito:', registration.scope);
      })
      .catch(error => {
        console.error('Error al registrar ServiceWorker:', error);
      });
  });
} 