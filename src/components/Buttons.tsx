import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * @interface ButtonItem
 * @description Defines the structure for a navigation button item.
 * @property {string} id - The unique identifier for the section the button navigates to.
 * @property {string} label - The text label displayed on the button.
 * @property {string} emoji - The emoji displayed on the button.
 */
interface ButtonItem {
  id: string;
  label: string;
  emoji: string;
}

/**
 * @component Buttons
 * @description A sidebar component that provides navigation buttons for different sections of the page.
 * It features responsive behavior, animations, and updates based on scroll position.
 * @returns {React.FC} The rendered component.
 */
const Buttons: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("inicio");
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<HTMLButtonElement[]>([]);

  /**
   * @function handleNavigation
   * @description Handles the click event on a navigation button, scrolling to the corresponding section
   * and dispatching a custom event to control the 3D camera.
   * @param {string} section - The ID of the section to navigate to.
   */
  const handleNavigation = (section: string): void => {
    setActiveSection(section);

    // Smooth scroll to the target section
    const targetElement = document.getElementById(section);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }

    // Dispatch a custom event for R3F components to listen to
    window.dispatchEvent(new CustomEvent('camera-navigation', {
      detail: { section }
    }));
  };

  /**
   * @function getResponsivePadding
   * @description Determines the appropriate padding for buttons based on the window width.
   * @returns {string} The Tailwind CSS class for padding.
   */
  /**
   * @function getResponsivePadding
   * @description Determines the appropriate padding for buttons based on the window width.
   * @returns {string} The Tailwind CSS class for padding.
   */
  const getResponsivePadding = (): string => {
    return windowWidth > 768 ? "px-4" : "px-2";
  };

  /**
   * @function getButtonClasses
   * @description Generates the CSS classes for a button based on whether it is the active section.
   * @param {string} section - The section ID associated with the button.
   * @returns {string} A string of Tailwind CSS classes.
   */
  const getButtonClasses = (section: string): string => {
    return `block rounded-lg ${getResponsivePadding()} py-2 text-sm font-medium ${
      activeSection === section
      ? "bg-gray-100 text-gray-700"
      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
    }`;
  };

  const buttons: ButtonItem[] = [
    { id: "inicio", label: "Home", emoji: "🏠" },
    { id: "sobre-mi", label: "About Me", emoji: "👨‍💻" },
    { id: "proyectos", label: "Projects", emoji: "🚀" },
    { id: "habilidades", label: "Skills", emoji: "💪" },
    { id: "contacto", label: "Contact", emoji: "📧" },
    { id: "cv", label: "CV", emoji: "📄" }
  ];

  useEffect(() => {
    const sections: string[] = ["inicio", "sobre-mi", "proyectos", "habilidades", "contacto", "cv"];

    // Entrance animation for the buttons
    if (buttonsRef.current && buttonRefs.current.length > 0) {
      gsap.fromTo(buttonRefs.current,
        {
          x: -100,
          opacity: 0,
          scale: 0.8
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          stagger: 0.1,
          delay: 0.2
        }
      );
    }

    // Create ScrollTriggers to update the active section based on scroll position
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

    /**
     * @function handleScroll
     * @description Handles the scroll event to determine if the page has been scrolled.
     */
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 50);
    };

    /**
     * @function handleResize
     * @description Handles the window resize event to update the window width and refresh ScrollTrigger.
     */
    const handleResize = (): void => {
      setWindowWidth(window.innerWidth);
      ScrollTrigger.refresh();
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove event listeners and kill ScrollTriggers
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  /**
   * @function getResponsiveWidth
   * @description Calculates the width of the sidebar based on scroll state and window width.
   * @returns {string} The Tailwind CSS class for the width.
   */
  const getResponsiveWidth = (): string => {
    if (isScrolled) return 'w-16';
    if (windowWidth < 640) return 'w-16';
    if (windowWidth < 768) return 'w-48';
    return 'w-64';
  };

  /**
   * @function showOnlyEmoji
   * @description Determines whether to show only the emoji on the buttons.
   * @returns {boolean} True if only emojis should be shown, otherwise false.
   */
  const showOnlyEmoji = (): boolean => {
    return isScrolled || windowWidth < 640;
  };

  /**
   * @function handleButtonHover
   * @description Animates a button on mouse enter and leave events.
   * @param {HTMLButtonElement} button - The button element being hovered.
   * @param {boolean} isEntering - True if the mouse is entering the button, false if leaving.
   */
  const handleButtonHover = (button: HTMLButtonElement, isEntering: boolean) => {
    if (isEntering) {
      gsap.to(button, {
        scale: 1.05,
        x: 5,
        duration: 0.3,
        ease: "power2.out"
      });
    } else {
      gsap.to(button, {
        scale: 1,
        x: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  return (
    <div 
      ref={buttonsRef}
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
          {buttons.map(({ id, label, emoji }, index) => (
            <li key={id}>
              <button
                ref={(el) => {
                  if (el) buttonRefs.current[index] = el;
                }}
                onClick={() => handleNavigation(id)}
                onMouseEnter={(e) => handleButtonHover(e.currentTarget, true)}
                onMouseLeave={(e) => handleButtonHover(e.currentTarget, false)}
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