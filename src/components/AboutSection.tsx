import { useState, useEffect } from 'react';
import ThreeScene from './ThreeScene';
import ScrollReveal from './ScrollReveal';

const AboutSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Handle mouse movement for interactive 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    setMousePosition({ x, y });
  };

  return (
    <section id="about" className="section-padding relative bg-gradient-to-b from-white to-omiwo-off-white dark:from-background dark:to-card/80 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full opacity-10 dark:opacity-20"
            style={{
              background: i % 2 === 0 ? '#E63946' : i % 3 === 0 ? '#2A9D8F' : '#00B4D8',
              width: `${Math.random() * 300 + 100}px`,
              height: `${Math.random() * 300 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(50px)',
              animation: `float ${Math.random() * 10 + 20}s ease-in-out infinite`
            }}
          />
        ))}
      </div>
      
      <div className="container-padding relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Enhanced 3D Visual with Interactive Elements */}
          <div 
            className="relative h-96 overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-omiwo-blue/20 to-omiwo-teal/20 dark:from-omiwo-blue/40 dark:to-omiwo-teal/40"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Main 3D scene with flow animation */}
            <div className="absolute inset-0">
              <ThreeScene 
                animationType="flow" 
                productType="detergent"
                color="#2A9D8F" 
                className="absolute inset-0"
                isHovered={isHovered}
                mousePosition={mousePosition}
              />
            </div>
            
            {/* Clean drops effect overlay */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute rounded-full bg-white/40 dark:bg-white/60 backdrop-blur-sm"
                  style={{
                    width: `${Math.random() * 15 + 10}px`,
                    height: `${Math.random() * 15 + 10}px`,
                    left: `${Math.random() * 80 + 10}%`,
                    top: `${Math.random() * 80 + 10}%`,
                    animation: `dropFall ${Math.random() * 8 + 4}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 5}s`,
                    boxShadow: '0 0 8px rgba(255,255,255,0.6) inset'
                  }}
                />
              ))}
            </div>
            
            {/* OMIWO Logo Overlay with enhanced visibility */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <img 
                  src="/images/omiwo_logo.png" 
                  alt="OMIWO Logo" 
                  className="w-1/2 mx-auto filter drop-shadow-lg"
                  style={{
                    filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.7))'
                  }}
                />
                <div className="mt-4 bg-white/30 dark:bg-white/40 backdrop-blur-md py-2 px-4 rounded-full inline-block">
                  <p className="font-medium text-white text-lg tracking-wider drop-shadow-md">
                    PREMIUM CLEANING SOLUTIONS
                  </p>
                </div>
              </div>
            </div>
            
            {/* Dynamic cleaning ripple effect */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 border-white/20 dark:border-white/30 rounded-full w-0 h-0 animate-ping-slow" style={{animationDuration: '3s'}}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 border-white/15 dark:border-white/25 rounded-full w-10 h-10 animate-ping-slow" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border-4 border-white/10 dark:border-white/20 rounded-full w-20 h-20 animate-ping-slow" style={{animationDuration: '5s', animationDelay: '2s'}}></div>
            </div>
          </div>
          
          {/* Content */}
          <div>
            <ScrollReveal>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">Crafted With Precision</h2>
            </ScrollReveal>
            
            <ScrollReveal delay={200}>
              <p className="text-foreground/70 mb-6">
                At OMIWO, we believe that everyday cleaning should be an experience of elegance. 
                Our products are meticulously crafted with premium ingredients that not only deliver 
                exceptional performance but also transform your daily routines into moments of delight.
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={400}>
              <p className="text-foreground/70 mb-8">
                Each OMIWO product is the result of extensive research and development, 
                combining cutting-edge technology with environmentally responsible practices 
                to create cleaning solutions that are as kind to the planet as they are effective.
              </p>
            </ScrollReveal>
            
            <ScrollReveal delay={600}>
              <div className="flex flex-wrap gap-4">
                <div className="glass-card px-5 py-3 flex items-center transform transition-all hover:scale-105 hover:shadow-md">
                  <div className="w-4 h-4 rounded-full bg-green-500 mr-3"></div>
                  <span className="font-medium text-foreground">Eco-Friendly</span>
                </div>
                
                <div className="glass-card px-5 py-3 flex items-center transform transition-all hover:scale-105 hover:shadow-md">
                  <div className="w-4 h-4 rounded-full bg-cyan-500 mr-3"></div>
                  <span className="font-medium text-foreground">Premium Quality</span>
                </div>
                
                <div className="glass-card px-5 py-3 flex items-center transform transition-all hover:scale-105 hover:shadow-md">
                  <div className="w-4 h-4 rounded-full bg-blue-500 mr-3"></div>
                  <span className="font-medium text-foreground">Dermatologically Tested</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Add this CSS animation to your global stylesheet */}
      <style jsx>{`
        @keyframes dropFall {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.7; }
          50% { transform: translateY(100px) scale(0.8); opacity: 0.9; }
          90% { opacity: 0; }
        }
        
        @keyframes ping-slow {
          0% { transform: translate(-50%, -50%) scale(0.2); opacity: 1; }
          70%, 100% { transform: translate(-50%, -50%) scale(4); opacity: 0; }
        }
        
        .animate-ping-slow {
          animation: ping-slow 5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </section>
  );
};

export default AboutSection;
