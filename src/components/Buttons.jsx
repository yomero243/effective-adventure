import React, { useState } from "react";

const Buttons = () => {
  const [activeSection, setActiveSection] = useState("inicio");

  const handleNavigation = (section) => {
    setActiveSection(section);
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
  };

  const getButtonClasses = (section) => {
    const baseClasses = "w-full text-white font-bold py-2 px-4 rounded-lg shadow-xl transition-all duration-300 flex items-center justify-center gap-2";
    const activeClasses = "ring-4 ring-opacity-50";
    const hoverEffect = "hover:shadow-[0_0_15px_rgba(255,255,255,0.5)]";
    return `${baseClasses} ${hoverEffect} ${activeSection === section ? activeClasses : ""}`;
  };

  const buttonStyles = {
    inicio: "bg-indigo-600 hover:bg-indigo-700 ring-indigo-300",
    "sobre-mi": "bg-purple-600 hover:bg-purple-700 ring-purple-300",
    proyectos: "bg-blue-600 hover:bg-blue-700 ring-blue-300",
    habilidades: "bg-green-600 hover:bg-green-700 ring-green-300",
    contacto: "bg-amber-600 hover:bg-amber-700 ring-amber-300",
    cv: "bg-red-600 hover:bg-red-700 ring-red-300"
  };

  const buttons = [
    { id: "inicio", label: "Inicio" },
    { id: "sobre-mi", label: "Sobre mí" },
    { id: "proyectos", label: "Proyectos" },
    { id: "habilidades", label: "Habilidades" },
    { id: "contacto", label: "Contacto" },
    { id: "cv", label: "CV" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 bg-slate-900/80 backdrop-blur-lg shadow-2xl z-50">
      <nav className="container mx-auto px-4 py-3">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {buttons.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleNavigation(id)}
              className={`${getButtonClasses(id)} ${buttonStyles[id]}`}
              aria-label={`Navigate to ${label}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm1 13h-2v-2h2v2zm0-4h-2V5h2v6z" />
              </svg>
              <span className="hidden md:inline">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Buttons;
