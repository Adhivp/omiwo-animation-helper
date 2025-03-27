
import { useEffect, useRef, useState } from 'react';
import ThreeScene from './ThreeScene';
import ScrollReveal from './ScrollReveal';

const Hero = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [prevMousePosition, setPrevMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      
      setPrevMousePosition(mousePosition);
      
      // Use smooth transition for mouse movement with easing
      setMousePosition(prev => ({
        x: prev.x + (x - prev.x) * 0.05,  // Reduced easing factor for even smoother motion
        y: prev.y + (y - prev.y) * 0.05   
      }));
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Initial animation
    const animateInitial = () => {
      setMousePosition(prev => ({
        x: prev.x * 0.95,
        y: prev.y * 0.95
      }));
    };
    
    const initialAnimationId = setInterval(animateInitial, 16);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(initialAnimationId);
    };
  }, [mousePosition]);

  const opacity = Math.max(0, 1 - (scrollY / 500));
  const translateY = scrollY * 0.3;
  
  // Calculate velocity for more natural movement
  const velocityX = (mousePosition.x - prevMousePosition.x) * 2;
  const velocityY = (mousePosition.y - prevMousePosition.y) * 2;
  
  // Smoother parallax with velocity influence
  const parallaxX = mousePosition.x * 20 + velocityX * 10; 
  const parallaxY = mousePosition.y * 20 + velocityY * 10;

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Enhanced 3D Background with more natural cursor interaction */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          transform: `translate(${-parallaxX}px, ${-parallaxY}px)`,
          transition: 'transform 0.1s cubic-bezier(0.2, 0.8, 0.2, 1)'
        }}
      >
        <ThreeScene 
          animationType="wave" 
          color="#3b82f6"
          mousePosition={mousePosition}
          className="absolute inset-0"
        />
      </div>
      
      {/* Darker Overlay with gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-radial from-transparent via-black/30 to-blue-900/50"></div>
      
      {/* Content with enhanced text visibility */}
      <div
        ref={textRef}
        className="relative z-10 text-center px-4 transition-all duration-300"
        style={{
          opacity,
          transform: `translate(${parallaxX * 0.02}px, ${translateY + parallaxY * 0.02}px)`
        }}
      >
        <ScrollReveal delay={200}>
          <h2 className="text-4xl md:text-7xl font-bold mb-4 md:mb-8 text-white leading-tight drop-shadow-[0_4px_14px_rgba(0,0,0,1)]">
            Elevate Your Clean<br />With Premium Liquids
          </h2>
        </ScrollReveal>
        
        <ScrollReveal delay={400}>
          <p className="text-base md:text-xl text-white max-w-2xl mx-auto mb-8 md:mb-12 drop-shadow-[0_4px_14px_rgba(0,0,0,1)]">
            Premium quality liquid cleaning products designed to transform your cleaning experience with elegance and effectiveness.
          </p>
        </ScrollReveal>
        
        <ScrollReveal delay={600}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="liquid-button group relative overflow-hidden bg-blue-600 hover:bg-blue-700 shadow-lg">
              <span className="relative z-10 text-white transition-colors font-medium px-6 py-3">Explore Collection</span>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <a 
              href="#products" 
              className="inline-flex items-center text-white font-medium hover:text-blue-300 transition-colors drop-shadow-[0_4px_14px_rgba(0,0,0,1)]"
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
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white drop-shadow-[0_4px_14px_rgba(0,0,0,1)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
