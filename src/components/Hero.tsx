import { useEffect, useRef, useState } from 'react';
import ThreeScene from './ThreeScene';
import ScrollReveal from './ScrollReveal';
import GoldCoinDraw from './GoldCoinDraw';

const Hero = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [prevMousePosition, setPrevMousePosition] = useState({ x: 0, y: 0 });
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });
  const [goldDrawOpen, setGoldDrawOpen] = useState(false);

  useEffect(() => {
    // Initial viewport size
    setViewportSize({
      width: window.innerWidth,
      height: window.innerHeight
    });

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      
      setPrevMousePosition(mousePosition);
      
      // Use smooth transition for mouse movement with easing
      setMousePosition(prev => ({
        x: prev.x + (x - prev.x) * 0.05,  // Reduced easing factor for smoother motion
        y: prev.y + (y - prev.y) * 0.05   
      }));
    };
    
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    
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
      window.removeEventListener('resize', handleResize);
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

  // Scale the 3D scene based on viewport size for better responsiveness
  const getSceneSize = () => {
    const baseSize = 100; // Base percentage
    const scaleFactor = viewportSize.width < 768 ? 1.5 : 1.2; // More pronounced on mobile
    return `${baseSize * scaleFactor}%`;
  };

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Enhanced 3D Background with more natural cursor interaction */}
      <div 
        className="absolute inset-0 z-0 flex items-center justify-center"
        style={{
          transform: `translate(${-parallaxX}px, ${-parallaxY}px)`,
        }}
      >
        <div className="w-full h-full" style={{ maxWidth: '150%', maxHeight: '150%' }}>
          <ThreeScene 
            animationType="bubble" 
            color="#3b82f6"
            mousePosition={mousePosition}
            isHovered={true} // Always show bubbles
          />
        </div>
      </div>
      
      {/* Floating bubbles outside the main scene */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full opacity-80 bubble-float"
            style={{
              background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(59, 130, 246, 0.${Math.floor(Math.random() * 4) + 2}))`,
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              left: `${Math.random() * 90 + 5}%`,
              top: `${Math.random() * 100 + 5}%`,
              filter: 'blur(1px)',
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${Math.random() * 15 + 10}s`,
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.7) inset',
              border: '1px solid rgba(255, 255, 255, 0.3)',
            }}
          />
        ))}
      </div>
      
      {/* Darker Overlay with gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-radial from-transparent via-black/30 to-blue-900/50"></div>
      
      {/* Content with enhanced text visibility */}
      <div
        ref={textRef}
        className="relative z-10 text-center px-4 transition-all duration-300 max-w-screen-xl mx-auto"
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
        
        {/* Gold Coin Lucky Draw Promotion */}
        <ScrollReveal delay={800}>
          <div className="relative mt-8 max-w-md mx-auto animate-float">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-amber-500 rounded-lg blur-md opacity-80"></div>
            <button 
              onClick={() => setGoldDrawOpen(true)}
              className="relative w-full px-6 py-3 bg-gradient-to-r from-yellow-300 to-amber-500 rounded-lg overflow-hidden group"
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div className="w-32 h-32 rounded-full bg-white/30 filter blur-md"></div>
              </div>
              <div className="flex items-center justify-center relative z-10">
                <div className="mr-3 w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="8" fill="#FFD700" strokeWidth="0"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="#B8860B" d="M12 8v8M8 12h8"/>
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-white font-bold text-sm sm:text-base">Win a 24K Gold Coin!</p>
                  <p className="text-yellow-100 text-xs sm:text-sm">Limited time offer - Enter now</p>
                </div>
                <div className="ml-auto transform group-hover:translate-x-1 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </ScrollReveal>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white drop-shadow-[0_4px_14px_rgba(0,0,0,1)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
      
      {/* Gold Coin Draw Dialog */}
      <GoldCoinDraw open={goldDrawOpen} onOpenChange={setGoldDrawOpen} />
    </section>
  );
};

export default Hero;
