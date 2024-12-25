import React, { useEffect, useRef } from "react";
import "./MouseEffect.css";

const MouseEffect: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (cursorRef.current) {
        const { clientX: x, clientY: y } = event;
        cursorRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <div className="cursor" ref={cursorRef}></div>;
};

export default MouseEffect;
