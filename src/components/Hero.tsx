
import { useEffect, useRef } from 'react';
import ThreeScene from './ThreeScene';
import ScrollReveal from './ScrollReveal';

const Hero = () => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!textRef.current) return;
      
      const scroll = window.scrollY;
      const opacity = 1 - (scroll / 500);
      const translateY = scroll * 0.3;
      
      textRef.current.style.opacity = `${Math.max(0, opacity)}`;
      textRef.current.style.transform = `translateY(${translateY}px)`;
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <ThreeScene animationType="wave" color="#33C3F0" />
      </div>
      
      {/* Content */}
      <div
        ref={textRef}
        className="relative z-10 text-center px-4 transition-all duration-300"
      >
        <ScrollReveal delay={200}>
          <h1 className="text-4xl md:text-7xl font-bold mb-4 md:mb-8 text-gradient leading-tight">
            Elevate Your Clean<br />With OMIWO
          </h1>
        </ScrollReveal>
        
        <ScrollReveal delay={400}>
          <p className="text-base md:text-xl text-foreground/80 max-w-2xl mx-auto mb-8 md:mb-12">
            Premium quality liquid cleaning products designed to transform your cleaning experience with elegance and effectiveness.
          </p>
        </ScrollReveal>
        
        <ScrollReveal delay={600}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="liquid-button">
              <span className="relative z-10">Explore Collection</span>
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
