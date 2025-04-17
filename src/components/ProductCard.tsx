import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import ThreeScene from './ThreeScene';
import ScrollReveal from './ScrollReveal';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ProductCardProps {
  name: string;
  description: string;
  color: string;
  animationType: 'wave' | 'ripple' | 'flow' | 'pour' | 'bubble';
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check auth status
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      setLoading(false);
    };
    
    checkAuth();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      setIsLoggedIn(event === 'SIGNED_IN');
    });
    
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Get product ID for routing
  const getProductId = () => {
    if (productType === 'toiletCleaner') return 'toilet-cleaner';
    if (productType === 'detergent') return 'liquid-detergent';
    return 'hand-wash';
  };

  // Enhanced 3D tilt effect on hover with mouse tracking
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!card) return;
      
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setMousePos({ x, y });
      
      if (isHovered) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // More pronounced tilt effect
        const rotateX = (y - centerY) / 12;
        const rotateY = (centerX - x) / 12;
        
        setRotation({ x: rotateX, y: rotateY });
      }
    };
    
    const handleMouseLeave = () => {
      setRotation({ x: 0, y: 0 });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (card) {
        card.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isHovered]);

  // Get product-specific styling and image paths
  const getProductStyle = () => {
    if (productType === 'toiletCleaner') {
      return {
        bgColor: 'bg-indigo-50',
        textColor: 'text-indigo-900',
        borderColor: 'border-indigo-200',
        buttonBg: 'bg-gradient-to-r from-indigo-500 to-indigo-700',
        accent: 'text-red-600', // Red OMIWO text for toilet cleaner
        hoverAccent: 'group-hover:bg-red-600',
        productImage: 'public/images/TC_main.png' // Verified path
      };
    } else if (productType === 'detergent') {
      return {
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-900',
        borderColor: 'border-blue-200',
        buttonBg: 'bg-gradient-to-r from-blue-500 to-blue-700',
        accent: 'text-emerald-500', // Green OMIWO text for detergent
        hoverAccent: 'group-hover:bg-emerald-500',
        productImage: 'public/images/LD_main.png' // Verified path
      };
    } else { // handWash
      return {
        bgColor: 'bg-yellow-50', // Changed from cyan to yellow
        textColor: 'text-yellow-900', // Changed from cyan to yellow
        borderColor: 'border-yellow-200', // Changed from cyan to yellow
        buttonBg: 'bg-gradient-to-r from-yellow-500 to-yellow-600', // Changed gradient
        accent: 'text-yellow-500', // Kept as yellow
        hoverAccent: 'group-hover:bg-yellow-500', // Kept as yellow
        productImage: 'public/images/HW_main.png' // Verified path
      };
    }
  };

  const style = getProductStyle();

  return (
    <ScrollReveal delay={delay} className="flex-1 min-w-[300px]">
      <div 
        ref={cardRef}
        className={`product-card h-full rounded-xl overflow-hidden shadow-xl transition-all duration-300 ${style.borderColor} group`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(${isHovered ? 1.03 : 1}, ${isHovered ? 1.03 : 1}, 1)`,
          transition: 'transform 0.2s ease'
        }}
      >
        {/* Product Header */}
        <div className={`px-6 py-4 ${style.bgColor} transition-colors duration-300`}>
          <h3 className={`text-2xl font-bold mb-1 ${style.textColor}`}>{name}</h3>
          <div className="flex items-center">
            <span className="text-sm font-bold">
              <span className="text-red-600">O</span>
              <span className="text-red-600">M</span>
              <span className="text-red-600">I</span>
              <span className="text-red-600">W</span>
              <span className="text-red-600">O</span>
            </span>
            {isLoggedIn && (
              <span className="ml-auto bg-green-100 text-green-700 text-xs py-1 px-2 rounded-full">
                In Stock
              </span>
            )}
          </div>
        </div>
        
        {/* Product Visualization with Animated Background and Product Image */}
        <div className="relative h-60 overflow-hidden bg-gradient-to-br from-white to-gray-100">
          {/* Animated Liquid Background - Ensure it fills the container properly */}
          <div className="absolute inset-0 w-full h-full">
            <ThreeScene 
              animationType={animationType} 
              color={color} 
              productType={productType}
              isHovered={isHovered}
              mousePosition={mousePos}
            />
          </div>
          
          {/* Product Image Overlay - Fix visibility issues */}
          <HoverCard>
            <HoverCardTrigger className="h-full w-full flex items-center justify-center">
              <div className="relative product-container w-full h-full flex items-center justify-center">
                {/* Background-removed product image overlay with improved visibility */}
                <img 
                  src={style.productImage}
                  alt={name} 
                  className="h-52 w-auto max-w-[80%] object-contain transform transition-all duration-500 relative z-10"
                  style={{ 
                    filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.15))',
                    transform: isHovered ? `scale(1.08) translateX(${(mousePos.x - 150) / 25}px) translateY(${(mousePos.y - 150) / 25}px)` : 'scale(1)',
                    transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
                    // Ensure image is visible
                    opacity: 1,
                    position: 'relative'
                  }}
                />
                
                {/* Animated droplets - position based on mouse position */}
                {isHovered && (
                  <>
                    <span 
                      className="droplet" 
                      style={{ 
                        left: `${mousePos.x / 4}%`, 
                        animationDelay: '0s', 
                        background: color,
                        zIndex: 5
                      }}
                    ></span>
                    <span 
                      className="droplet" 
                      style={{ 
                        left: `${50 + mousePos.x / 8}%`, 
                        animationDelay: '0.3s', 
                        background: color,
                        zIndex: 5
                      }}
                    ></span>
                    <span 
                      className="droplet" 
                      style={{ 
                        left: `${80 - mousePos.x / 10}%`, 
                        animationDelay: '0.7s', 
                        background: color,
                        zIndex: 5
                      }}
                    ></span>
                  </>
                )}
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="p-4 z-20">
              <div className="space-y-2">
                <h4 className="font-bold">{name}</h4>
                <p className="text-sm">{description}</p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        
        {/* Product Info */}
        <div className="p-6 bg-white">
          <p className="text-foreground/70 mb-4">{description}</p>
          
          {/* Product Features */}
          <div className="flex flex-wrap gap-2 mb-6">
            {productType === 'toiletCleaner' && (
              <>
                <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">Microbial Cleaners</span>
                <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">Non-abrasive</span>
              </>
            )}
            {productType === 'detergent' && (
              <>
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Color-safe</span>
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">99.9% germ defense</span>
              </>
            )}
            {productType === 'handWash' && (
              <>
                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Antimicrobial</span>
                <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Long-lasting</span>
              </>
            )}
          </div>
          
          <div className="flex flex-col space-y-3">
            {/* "Learn More" button that's always visible */}
            <Link 
              to={`/product/${getProductId()}`}
              className={`py-3 rounded-full text-white font-medium transition-all duration-300 ${style.buttonBg} hover:shadow-lg transform hover:-translate-y-1 block text-center`}
            >
              Learn More
            </Link>
            
            {/* "Buy Now" button that's only visible for logged-in users */}
            {isLoggedIn && (
              <a 
                href={`https://wa.me/917306379513?text=Hello, I'm interested in your product: ${name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-full bg-green-600 hover:bg-green-700 text-white font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 1 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"/>
                </svg>
                Buy Now
              </a>
            )}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default ProductCard;
