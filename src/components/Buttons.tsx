import React, { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ButtonItem {
  id: string;
  label: string;
  emoji: string;
}

const Buttons: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("inicio");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  const handleNavigation = (section: string): void => {
    setActiveSection(section);
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    
    // Emitir un evento personalizado que los componentes R3F pueden escuchar
    window.dispatchEvent(new CustomEvent('camera-navigation', { 
      detail: { section } 
    }));
  };

  const getResponsivePadding = (): string => {
    return windowWidth > 768 ? "px-4" : "px-2";
  };

  const getButtonClasses = (section: string): string => {
    return `block rounded-lg ${getResponsivePadding()} py-2 text-sm font-medium ${
      activeSection === section 
      ? "bg-gray-100 text-gray-700" 
      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
    }`;
  };

  const buttons: ButtonItem[] = [
    { id: "inicio", label: "Inicio", emoji: "🏠" },
    { id: "sobre-mi", label: "Sobre mí", emoji: "👨‍💻" },
    { id: "proyectos", label: "Proyectos", emoji: "🚀" },
    { id: "habilidades", label: "Habilidades", emoji: "💪" },
    { id: "contacto", label: "Contacto", emoji: "📧" },
    { id: "cv", label: "CV", emoji: "📄" }
  ];

  useEffect(() => {
    const sections: string[] = ["inicio", "sobre-mi", "proyectos", "habilidades", "contacto", "cv"];
    
    sections.forEach(section => {
      ScrollTrigger.create({
        trigger: `#${section}`,
        start: "top center",
        end: "bottom center",
        onEnter: () => {
          setActiveSection(section);
          window.dispatchEvent(new CustomEvent('camera-navigation', { detail: { section } }));
        },
        onEnterBack: () => {
          setActiveSection(section);
          window.dispatchEvent(new CustomEvent('camera-navigation', { detail: { section } }));
        }
      });
    });

    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleResize = (): void => {
      setWindowWidth(window.innerWidth);
      ScrollTrigger.refresh();
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const getResponsiveWidth = (): string => {
    if (isScrolled) return 'w-16';
    if (windowWidth < 640) return 'w-16'; // móvil
    if (windowWidth < 768) return 'w-48'; // tablet
    return 'w-64'; // desktop
  };

  const showOnlyEmoji = (): boolean => {
    return isScrolled || windowWidth < 640;
  };

  return (
    <div 
      className={`
        flex h-screen flex-col justify-between
        backdrop-blur-md bg-white/30 border-e border-white/20
        transition-all duration-300 ease-in-out
        ${getResponsiveWidth()}
      `}
      style={{ 
        pointerEvents: 'auto',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className={`${getResponsivePadding()} py-6`}>
        <span className={`
          grid place-content-center rounded-lg bg-white/40 text-xs text-gray-600
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

      <div className="sticky inset-x-0 bottom-0 border-t border-white/20">
        <a href="#" className={`
          flex items-center gap-2 bg-white/20 hover:bg-white/30
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