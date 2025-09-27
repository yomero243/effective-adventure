import React, { useEffect, useRef, useCallback, useState } from "react";
import "./MouseEffect.css";

/**
 * @constant INTERACTIVE_ELEMENTS
 * @description A set of HTML tag names that should trigger a hover effect on the custom cursor.
 */
const INTERACTIVE_ELEMENTS = new Set(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA']);

// Variables for handling mouse movement
let lastMouseX = 0;
let lastMouseY = 0;
let lastUpdateTime = performance.now();

/**
 * @component MouseEffect
 * @description Creates a custom cursor effect that follows the mouse, animates smoothly,
 * and changes appearance when hovering over interactive elements. It is disabled on touch devices.
 * @returns {JSX.Element | null} The custom cursor element or null if on a touch device.
 */
const MouseEffect: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mousePosition = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>();
  const isHovering = useRef(false);
  const isInitialized = useRef(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  /**
   * @function updateCursorPosition
   * @description Animates the cursor's position using `requestAnimationFrame` for smooth updates.
   */
  const updateCursorPosition = useCallback(() => {
    if (!cursorRef.current) {
      rafId.current = requestAnimationFrame(updateCursorPosition);
      return;
    }

    cursorRef.current.style.transform = `translate3d(${mousePosition.current.x}px, ${mousePosition.current.y}px, 0)`;

    if (!isInitialized.current) {
      cursorRef.current.style.opacity = '1';
      isInitialized.current = true;
    }

    rafId.current = requestAnimationFrame(updateCursorPosition);
  }, []);

  /**
   * @function initializePosition
   * @description Sets the initial position of the cursor to the center of the screen.
   */
  const initializePosition = useCallback(() => {
    mousePosition.current = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    };
    if (cursorRef.current) {
      cursorRef.current.style.opacity = '0';
      cursorRef.current.style.transform = `translate3d(${mousePosition.current.x}px, ${mousePosition.current.y}px, 0)`;
    }
  }, []);

  /**
   * @function handleMouseMove
   * @description Handles the mouse move event with smooth interpolation to update the cursor's target position.
   * @param {MouseEvent} event - The mouse move event.
   */
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const currentTime = performance.now();
    const timeDelta = currentTime - lastUpdateTime;

    // Update position only if enough time has passed (approx. 60 FPS)
    if (timeDelta > 16) {
      const dx = event.clientX - lastMouseX;
      const dy = event.clientY - lastMouseY;

      // Smooth interpolation of movement
      mousePosition.current = {
        x: lastMouseX + dx * 0.5,
        y: lastMouseY + dy * 0.5
      };

      lastMouseX = event.clientX;
      lastMouseY = event.clientY;
      lastUpdateTime = currentTime;
    }
  }, []);

  /**
   * @function handleInteraction
   * @description Detects if the mouse is hovering over an interactive element and toggles the cursor's hover state.
   * @param {MouseEvent} event - The mouse over event.
   */
  const handleInteraction = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const isInteractive = INTERACTIVE_ELEMENTS.has(target.tagName) ||
                         target.classList.contains('interactive') ||
                         !!target.closest('.interactive');

    if (isInteractive !== isHovering.current) {
      isHovering.current = isInteractive;
      if (cursorRef.current) {
        cursorRef.current.classList.toggle('hover', isInteractive);
      }
    }
  }, []);

  /**
   * @function detectTouchDevice
   * @description Detects if the current device is touch-capable.
   */
  const detectTouchDevice = useCallback(() => {
    const isTouchCapable = 'ontouchstart' in window ||
                          navigator.maxTouchPoints > 0 ||
                          (navigator as any).msMaxTouchPoints > 0;

    setIsTouchDevice(isTouchCapable || !window.matchMedia('(hover: hover)').matches);
  }, []);

  // Main effect for initialization and cleanup
  useEffect(() => {
    detectTouchDevice();

    // Don't show custom cursor on touch devices
    if (isTouchDevice) return;

    // Reset tracking values
    lastMouseX = window.innerWidth / 2;
    lastMouseY = window.innerHeight / 2;
    lastUpdateTime = performance.now();

    initializePosition();
    rafId.current = requestAnimationFrame(updateCursorPosition);

    // Event listeners
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleInteraction, { passive: true });

    // Hide default cursor
    document.documentElement.style.cursor = 'none';

    // Cleanup
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleInteraction);
      document.documentElement.style.cursor = '';
    };
  }, [updateCursorPosition, handleMouseMove, handleInteraction, initializePosition, detectTouchDevice, isTouchDevice]);

  // Don't render anything on touch devices
  if (isTouchDevice) {
    return null;
  }

  return (
    <div 
      className="cursor" 
      ref={cursorRef} 
      style={{ opacity: 0 }}
      aria-hidden="true" 
      data-testid="custom-cursor"
    />
  );
};

export default React.memo(MouseEffect);
