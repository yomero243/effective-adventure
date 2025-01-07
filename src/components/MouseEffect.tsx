import React, { useEffect, useRef, useCallback } from "react";
import "./MouseEffect.css";

const INTERACTIVE_ELEMENTS = new Set(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA']);

const MouseEffect: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>();
  const isHovering = useRef(false);
  const isInitialized = useRef(false);

  // Memoizar la función de actualización para evitar recreaciones innecesarias
  const updateCursorPosition = useCallback(() => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${mousePosition.current.x}px, ${mousePosition.current.y}px, 0)`;
      
      // Hacer visible el cursor después de la primera actualización
      if (!isInitialized.current) {
        cursorRef.current.style.opacity = '1';
        isInitialized.current = true;
      }
    }
    rafId.current = requestAnimationFrame(updateCursorPosition);
  }, []);

  useEffect(() => {
    let lastMouseX = 0;
    let lastMouseY = 0;
    let lastUpdateTime = performance.now();

    // Inicializar la posición en el centro de la pantalla
    const initializePosition = () => {
      mousePosition.current = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      };
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0';
        cursorRef.current.style.transform = `translate3d(${mousePosition.current.x}px, ${mousePosition.current.y}px, 0)`;
      }
    };

    // Throttle del movimiento del mouse usando RAF
    const handleMouseMove = (event: MouseEvent) => {
      const currentTime = performance.now();
      const timeDelta = currentTime - lastUpdateTime;

      // Aplicar suavizado al movimiento
      if (timeDelta > 16) { // ~60fps
        const dx = event.clientX - lastMouseX;
        const dy = event.clientY - lastMouseY;
        
        mousePosition.current = {
          x: lastMouseX + dx * 0.5,
          y: lastMouseY + dy * 0.5
        };

        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
        lastUpdateTime = currentTime;
      }
    };

    // Delegación de eventos para hover
    const handleInteraction = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const isInteractive = INTERACTIVE_ELEMENTS.has(target.tagName) || 
                           target.classList.contains('interactive');

      if (isInteractive !== isHovering.current) {
        isHovering.current = isInteractive;
        if (cursorRef.current) {
          cursorRef.current.classList.toggle('hover', isInteractive);
        }
      }
    };

    // Inicializar
    initializePosition();
    
    // Iniciar el loop de animación
    rafId.current = requestAnimationFrame(updateCursorPosition);

    // Event listeners optimizados
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleInteraction, { passive: true });
    
    // Ocultar el cursor nativo solo si estamos en un dispositivo con hover
    if (window.matchMedia('(hover: hover)').matches) {
      document.documentElement.style.cursor = 'none';
    }

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleInteraction);
      document.documentElement.style.cursor = '';
    };
  }, [updateCursorPosition]);

  return (
    <div 
      className="cursor" 
      ref={cursorRef} 
      style={{ opacity: 0 }}
      aria-hidden="true" 
    />
  );
};

// Memoizar el componente para evitar re-renders innecesarios
export default React.memo(MouseEffect);
