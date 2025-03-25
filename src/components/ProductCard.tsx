
import { useState, useRef, useEffect } from 'react';
import ThreeScene from './ThreeScene';
import ScrollReveal from './ScrollReveal';

interface ProductCardProps {
  name: string;
  description: string;
  color: string;
  animationType: 'wave' | 'ripple' | 'flow' | 'pour';
  productType: 'toiletCleaner' | 'detergent' | 'handWash';
  imageSrc?: string;
  delay?: number;
}

const ProductCard = ({ 
  name, 
  description, 
  color, 
  animationType, 
  productType,
  imageSrc,
  delay = 0 
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

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
      
      setRotation({ x: rotateX, y: rotateY });
    };
    
    const handleMouseLeave = () => {
      setRotation({ x: 0, y: 0 });
    };
    
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovered]);

  // Get product-specific styling
  const getProductStyle = () => {
    if (productType === 'toiletCleaner') {
      return {
        bgColor: 'bg-red-50',
        textColor: 'text-red-900',
        borderColor: 'border-red-200',
        buttonBg: 'bg-gradient-to-r from-red-500 to-red-700',
      };
    } else if (productType === 'detergent') {
      return {
        bgColor: 'bg-teal-50',
        textColor: 'text-teal-900',
        borderColor: 'border-teal-200',
        buttonBg: 'bg-gradient-to-r from-teal-500 to-teal-700',
      };
    } else { // handWash
      return {
        bgColor: 'bg-cyan-50',
        textColor: 'text-cyan-900',
        borderColor: 'border-cyan-200',
        buttonBg: 'bg-gradient-to-r from-cyan-500 to-cyan-700',
      };
    }
  };

  const style = getProductStyle();

  return (
    <ScrollReveal delay={delay} className="flex-1 min-w-[300px]">
      <div 
        ref={cardRef}
        className={`product-card h-full rounded-xl overflow-hidden shadow-xl transition-all duration-300 ${style.borderColor}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
          transition: 'transform 0.3s ease'
        }}
      >
        {/* Product Header */}
        <div className={`px-6 py-4 ${style.bgColor}`}>
          <h3 className={`text-2xl font-bold mb-1 ${style.textColor}`}>{name}</h3>
        </div>
        
        {/* 3D Product Visualization with Image */}
        <div className="relative h-60 overflow-hidden bg-gradient-to-br from-white to-gray-100">
          {/* 3D Liquid Background */}
          <ThreeScene 
            animationType={animationType} 
            color={color} 
            productType={productType}
            className="absolute inset-0"
          />
          
          {/* Product Image */}
          {imageSrc && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative product-container">
                <img 
                  src={imageSrc} 
                  alt={name} 
                  className="h-44 object-contain transform transition-all duration-500 hover:scale-110 product-image"
                  style={{ 
                    filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.15))'
                  }}
                />
                
                {/* Animated droplets */}
                {isHovered && (
                  <>
                    <span className="droplet" style={{ left: '20%', animationDelay: '0s', background: color }}></span>
                    <span className="droplet" style={{ left: '50%', animationDelay: '0.3s', background: color }}></span>
                    <span className="droplet" style={{ left: '80%', animationDelay: '0.7s', background: color }}></span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="p-6 bg-white">
          <p className="text-foreground/70 mb-4">{description}</p>
          
          {/* Product Features */}
          <div className="flex flex-wrap gap-2 mb-6">
            {productType === 'toiletCleaner' && (
              <>
                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Anti-bacterial</span>
                <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Non-abrasive</span>
              </>
            )}
            {productType === 'detergent' && (
              <>
                <span className="px-2 py-1 text-xs rounded-full bg-teal-100 text-teal-800">Color-safe</span>
                <span className="px-2 py-1 text-xs rounded-full bg-teal-100 text-teal-800">99.9% germ defense</span>
              </>
            )}
            {productType === 'handWash' && (
              <>
                <span className="px-2 py-1 text-xs rounded-full bg-cyan-100 text-cyan-800">Antimicrobial</span>
                <span className="px-2 py-1 text-xs rounded-full bg-cyan-100 text-cyan-800">Long-lasting</span>
              </>
            )}
          </div>
          
          <button className={`w-full py-3 rounded-full text-white font-medium transition-all duration-300 ${style.buttonBg} hover:shadow-lg transform hover:-translate-y-1`}>
            Learn More
          </button>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default ProductCard;
