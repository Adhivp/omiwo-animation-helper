
import { useEffect, useRef, useState } from 'react';
import ThreeScene from './ThreeScene';
import ScrollReveal from './ScrollReveal';

const Hero = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position relative to the center of the screen
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      
      setMousePosition({ x, y });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const opacity = Math.max(0, 1 - (scrollY / 500));
  const translateY = scrollY * 0.3;
  
  // Enhanced parallax based on mouse position
  const parallaxX = mousePosition.x * 30; // Increased from 20 to 30
  const parallaxY = mousePosition.y * 30; // Increased from 20 to 30

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Enhanced 3D Background with stronger cursor interaction */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          transform: `translate(${-parallaxX}px, ${-parallaxY}px)`
        }}
      >
        <ThreeScene 
          animationType="wave" 
          color="#3b82f6"
          mousePosition={mousePosition}
          className="absolute inset-0"
        />
      </div>
      
      {/* Animated Bubbles with enhanced cursor interaction */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-white opacity-20 animate-float"
            style={{
              width: `${Math.random() * 80 + 20}px`,
              height: `${Math.random() * 80 + 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 10 + 5}s`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `translate(${parallaxX * (0.3 + Math.random() * 0.8)}px, ${parallaxY * (0.3 + Math.random() * 0.8)}px)`
            }}
          />
        ))}
      </div>
      
      {/* Darker Overlay to improve text visibility */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-blue-900/30"></div>
      
      {/* Content with enhanced text visibility */}
      <div
        ref={textRef}
        className="relative z-10 text-center px-4 transition-all duration-300"
        style={{
          opacity,
          transform: `translate(${parallaxX * 0.1}px, ${translateY + parallaxY * 0.1}px)`
        }}
      >
        <ScrollReveal delay={200}>
          <h2 className="text-4xl md:text-7xl font-bold mb-4 md:mb-8 text-white leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            Elevate Your Clean<br />With Premium Liquids
          </h2>
        </ScrollReveal>
        
        <ScrollReveal delay={400}>
          <p className="text-base md:text-xl text-white max-w-2xl mx-auto mb-8 md:mb-12 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            Premium quality liquid cleaning products designed to transform your cleaning experience with elegance and effectiveness.
          </p>
        </ScrollReveal>
        
        <ScrollReveal delay={600}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="liquid-button group relative overflow-hidden bg-blue-600 hover:bg-blue-700">
              <span className="relative z-10 text-white transition-colors">Explore Collection</span>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <a 
              href="#products" 
              className="inline-flex items-center text-white font-medium hover:text-blue-300 transition-colors drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
            >
              <span>Learn More</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-3.293-3.293a1 1 0 111.414-1.414l4 4z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </ScrollReveal>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
