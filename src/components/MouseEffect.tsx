import React, { useEffect, useRef, useCallback } from "react";
import "./MouseEffect.css";

const INTERACTIVE_ELEMENTS = new Set(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA']);

const MouseEffect: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>();
  const isHovering = useRef(false);
  const isInitialized = useRef(false);

  const updateCursorPosition = useCallback(() => {
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${mousePosition.current.x}px, ${mousePosition.current.y}px, 0)`;
      
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

    const handleMouseMove = (event: MouseEvent) => {
      const currentTime = performance.now();
      const timeDelta = currentTime - lastUpdateTime;

      if (timeDelta > 16) {
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

    initializePosition();
    
    rafId.current = requestAnimationFrame(updateCursorPosition);

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleInteraction, { passive: true });
    
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

export default React.memo(MouseEffect);
