import React, { useState, useEffect } from "react";

const Buttons = () => {
  const [activeSection, setActiveSection] = useState("inicio");
  const [isScrolled, setIsScrolled] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const handleNavigation = (section) => {
    setActiveSection(section);
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
  };

  const getButtonClasses = (section) => {
    return `block rounded-lg ${getResponsivePadding()} py-2 text-sm font-medium ${
      activeSection === section 
      ? "bg-gray-100 text-gray-700" 
      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
    }`;
  };

  const buttons = [
    { id: "inicio", label: "Inicio", emoji: "🏠" },
    { id: "sobre-mi", label: "Sobre mí", emoji: "👨‍💻" },
    { id: "proyectos", label: "Proyectos", emoji: "🚀" },
    { id: "habilidades", label: "Habilidades", emoji: "💪" },
    { id: "contacto", label: "Contacto", emoji: "📧" },
    { id: "cv", label: "CV", emoji: "📄" }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getResponsiveWidth = () => {
    if (isScrolled) return 'w-16';
    if (windowWidth < 640) return 'w-16'; // móvil
    if (windowWidth < 768) return 'w-48'; // tablet
    return 'w-64'; // desktop
  };

  const getResponsivePadding = () => {
    if (isScrolled || windowWidth < 640) return 'px-2';
    if (windowWidth < 768) return 'px-3';
    return 'px-4';
  };

  const showOnlyEmoji = () => {
    return isScrolled || windowWidth < 640;
  };

  return (
    <div 
      className={`
        flex h-screen flex-col justify-between border-e bg-white 
        transition-all duration-300 ease-in-out
        ${getResponsiveWidth()}
      `}
      style={{ pointerEvents: 'auto' }}
    >
      <div className={`${getResponsivePadding()} py-6`}>
        <span className={`
          grid place-content-center rounded-lg bg-gray-100 text-xs text-gray-600
          transition-all duration-300
          ${showOnlyEmoji() ? 'h-8 w-12' : 'h-10 w-32'}
        `}>
          {showOnlyEmoji() ? '🎯' : 'Logo'}
        </span>

        <ul className="mt-6 space-y-1">
          {buttons.map(({ id, label, emoji }) => (
            <li key={id}>
              <button
                onClick={() => handleNavigation(id)}
                className={getButtonClasses(id)}
                aria-label={`Navigate to ${label}`}
              >
                <span className={showOnlyEmoji() ? 'inline' : 'md:hidden'}>{emoji}</span>
                <span className={`hidden ${showOnlyEmoji() ? 'hidden' : 'md:inline'}`}>
                  {label}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
        <a href="#" className={`
          flex items-center gap-2 bg-white hover:bg-gray-50
          ${showOnlyEmoji() ? 'p-2' : 'p-4'}
        `}>
          <img
            alt="Profile"
            src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40"
            className={`rounded-full object-cover transition-all duration-300 ${
              showOnlyEmoji() ? 'size-8' : 'size-10'
            }`}
          />
          <div className={`hidden ${showOnlyEmoji() ? 'hidden' : 'md:block'}`}>
            <p className="text-xs">
              <strong className="block font-medium">Tu Nombre</strong>
              <span>tu@email.com</span>
            </p>
          </div>
        </a>
      </div>
    </div>
  );
};

export default Buttons;
