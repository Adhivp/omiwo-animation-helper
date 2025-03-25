
import { useEffect, useRef, useState } from 'react';
import ThreeScene from './ThreeScene';
import ScrollReveal from './ScrollReveal';

const Hero = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!textRef.current) return;
      
      const scroll = window.scrollY;
      setScrollY(scroll);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const opacity = Math.max(0, 1 - (scrollY / 500));
  const translateY = scrollY * 0.3;

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Enhanced 3D Background */}
      <div className="absolute inset-0 z-0">
        <ThreeScene 
          animationType="wave" 
          color="#33C3F0" 
          className="absolute inset-0"
        />
      </div>
      
      {/* Animated Bubbles */}
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
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      
      {/* Liquid Overlay Effect */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent to-omiwo-blue/10"></div>
      
      {/* Content */}
      <div
        ref={textRef}
        className="relative z-10 text-center px-4 transition-all duration-300"
        style={{
          opacity,
          transform: `translateY(${translateY}px)`
        }}
      >
        {/* OMIWO Logo */}
        <ScrollReveal delay={100}>
          <div className="flex justify-center mb-8">
            <img 
              src="/lovable-uploads/4b03a1bc-6c22-48bf-abfb-9f89c90257d8.png" 
              alt="OMIWO Logo" 
              className="h-24 md:h-32 animate-float"
              style={{ filter: 'drop-shadow(0 10px 25px rgba(51, 195, 240, 0.5))' }}
            />
          </div>
        </ScrollReveal>
        
        <ScrollReveal delay={200}>
          <h1 className="text-4xl md:text-7xl font-bold mb-4 md:mb-8 text-gradient leading-tight">
            Elevate Your Clean<br />With Premium Liquids
          </h1>
        </ScrollReveal>
        
        <ScrollReveal delay={400}>
          <p className="text-base md:text-xl text-foreground/80 max-w-2xl mx-auto mb-8 md:mb-12">
            Premium quality liquid cleaning products designed to transform your cleaning experience with elegance and effectiveness.
          </p>
        </ScrollReveal>
        
        <ScrollReveal delay={600}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="liquid-button group relative overflow-hidden">
              <span className="relative z-10 group-hover:text-white transition-colors">Explore Collection</span>
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-500 to-teal-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>
            <a 
              href="#products" 
              className="inline-flex items-center text-foreground font-medium hover:text-omiwo-blue transition-colors"
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
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-foreground/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
