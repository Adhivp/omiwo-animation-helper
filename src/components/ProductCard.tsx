
import { useState, useRef, useEffect } from 'react';
import ThreeScene from './ThreeScene';
import ScrollReveal from './ScrollReveal';

interface ProductCardProps {
  name: string;
  description: string;
  color: string;
  animationType: 'wave' | 'ripple' | 'flow';
  delay?: number;
}

const ProductCard = ({ 
  name, 
  description, 
  color, 
  animationType, 
  delay = 0 
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D tilt effect on hover
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isHovered || !card) return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 20;
      const rotateY = (centerX - x) / 20;
      
      card.style.transform = `
        perspective(1000px) 
        rotateX(${rotateX}deg) 
        rotateY(${rotateY}deg) 
        scale3d(1.02, 1.02, 1.02)
      `;
    };
    
    const handleMouseLeave = () => {
      card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovered]);

  return (
    <ScrollReveal delay={delay} className="flex-1 min-w-[300px]">
      <div 
        ref={cardRef}
        className="product-card glass-card h-full p-6 transition-all duration-300"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 3D Product Visualization */}
        <div className="relative h-60 mb-6 overflow-hidden rounded-lg bg-omiwo-light-blue/50">
          <ThreeScene 
            animationType={animationType} 
            color={color} 
            className="absolute inset-0"
          />
        </div>
        
        {/* Product Info */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">{name}</h3>
          <p className="text-foreground/70">{description}</p>
          
          <button className="mt-6 w-full py-3 rounded-full bg-white border border-omiwo-blue text-omiwo-blue font-medium transition-all duration-300 hover:bg-omiwo-blue hover:text-white">
            Learn More
          </button>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default ProductCard;
