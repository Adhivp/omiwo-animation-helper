import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollReveal from './ScrollReveal';
import ThreeScene from './ThreeScene';

interface ProductDataType {
  id: string;
  name: string;
  tagline: string;
  fullDescription: string;
  ingredients: string[];
  benefits: string[];
  usage: string;
  imageSrc: string;
  color: string;
  productType: 'toiletCleaner' | 'detergent' | 'handWash';
  features: { icon: string; title: string; description: string }[];
}

const productsData: Record<string, ProductDataType> = {
  'toilet-cleaner': {
    id: 'toilet-cleaner',
    name: 'Premium Toilet Cleaner',
    tagline: 'Advanced Cleaning Formula for Complete Bathroom Hygiene',
    fullDescription: 'OMIWO Premium Toilet Cleaner is specifically formulated to provide exceptional cleaning power while being gentle on surfaces. Our advanced formula effectively eliminates 99.9% of germs and bacteria, removes tough stains, and prevents limescale buildup. The thick gel formula ensures complete coverage, reaching even under the rim for a thorough clean.',
    ingredients: ['Microbial Cleaners', 'Non-abrasive Agents', 'Biodegradable Surfactants', 'Essential Oil Fragrance'],
    benefits: [
      'Eliminates 99.9% of germs and bacteria',
      'Removes tough stains and limescale',
      'Prevents buildup with regular use',
      'Fresh, long-lasting fragrance',
      'Safe for all toilet materials including porcelain'
    ],
    usage: 'Apply directly under and around the rim of the toilet bowl. Allow to sit for 5-10 minutes for maximum effectiveness, then brush thoroughly and flush.',
    imageSrc: '/images/TC_main.png',
    color: '#1e3a8a',
    productType: 'toiletCleaner',
    features: [
      {
        icon: '🔍',
        title: 'Deep Cleaning',
        description: 'Reaches hidden areas to eliminate all bacteria and germs'
      },
      {
        icon: '🍃',
        title: 'Eco-Friendly',
        description: 'Biodegradable formula that\'s safe for septic systems'
      },
      {
        icon: '⏱️',
        title: 'Long-Lasting',
        description: 'Special coating prevents buildup for up to 7 days'
      }
    ]
  },
  'liquid-detergent': {
    id: 'liquid-detergent',
    name: 'Liquid Detergent',
    tagline: 'Superior Cleaning Power with Color-Safe Technology',
    fullDescription: 'OMIWO Liquid Detergent delivers exceptional cleaning performance while being gentle on fabrics. Our advanced formula effectively removes tough stains and odors while preserving colors and fabric integrity. The concentrated formula means you need less detergent per wash, making it economical and environmentally friendly.',
    ingredients: ['Color-safe Technology', 'Fabric Softening Agents', 'Stain Removal Enzymes', 'Mild Fragrances'],
    benefits: [
      'Effective stain removal even at lower temperatures',
      'Preserves fabric colors and prevents fading',
      'Gentle on delicate fabrics',
      'Fresh, clean scent that lasts',
      'Works in all washing machine types'
    ],
    usage: 'Add 30ml (for medium soiling) or 45ml (for heavy soiling) to your washing machine drawer or directly into the drum for front loaders. Adjust amount based on water hardness and load size.',
    imageSrc: '/images/LD_main.png',
    color: '#3b82f6',
    productType: 'detergent',
    features: [
      {
        icon: '✨',
        title: 'Stain Defense',
        description: 'Advanced enzymes target and remove even the toughest stains'
      },
      {
        icon: '🌈',
        title: 'Color Protection',
        description: 'Special formula prevents fading and keeps colors vibrant'
      },
      {
        icon: '🌱',
        title: 'Eco-Conscious',
        description: 'Concentrated formula means less packaging waste'
      }
    ]
  },
  'hand-wash': {
    id: 'hand-wash',
    name: 'Advanced Hand Wash',
    tagline: 'Gentle Cleansing with Long-lasting Protection',
    fullDescription: 'OMIWO Advanced Hand Wash combines effective cleaning with skin-nourishing ingredients. Our balanced formula eliminates 99.9% of germs while moisturizing and protecting your skin. The unique blend of natural extracts leaves your hands feeling soft and refreshed after every wash, never dry or irritated.',
    ingredients: ['Antimicrobial Agents', 'Aloe Vera Extract', 'Vitamin E', 'Natural Moisturizers'],
    benefits: [
      'Eliminates 99.9% of harmful bacteria',
      'Moisturizes and nourishes skin',
      'Prevents dryness even with frequent washing',
      'Pleasant, subtle fragrance',
      'Dermatologically tested and approved'
    ],
    usage: 'Wet hands with clean water. Apply a small amount of hand wash and lather thoroughly for at least 20 seconds, covering all surfaces including between fingers and under nails. Rinse well and dry with a clean towel.',
    imageSrc: '/images/HW_main.png',
    color: '#eab308',
    productType: 'handWash',
    features: [
      {
        icon: '🦠',
        title: 'Germ Protection',
        description: 'Eliminates 99.9% of harmful bacteria and viruses'
      },
      {
        icon: '🧴',
        title: 'Skin Nourishing',
        description: 'Contains natural moisturizers to prevent dryness'
      },
      {
        icon: '⏰',
        title: 'Long-lasting',
        description: 'Provides continued protection even after washing'
      }
    ]
  }
};

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<ProductDataType | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const productImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      if (productId && productsData[productId]) {
        setProduct(productsData[productId]);
      }
      setIsLoading(false);
    }, 500);

    const handleMouseMove = (e: MouseEvent) => {
      if (productImageRef.current) {
        const rect = productImageRef.current.getBoundingClientRect();
        // Normalize coordinates between -1 and 1
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [productId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-omiwo-blue"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-6">The product you are looking for doesn't exist or has been removed.</p>
        <Link 
          to="/#products" 
          className="liquid-button"
        >
          <span className="relative z-10">Back to Products</span>
        </Link>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50">
          <div className="container-padding py-12 md:py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Product Image with Animation */}
              <ScrollReveal>
                <div 
                  ref={productImageRef}
                  className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl"
                  style={{
                    perspective: '1000px'
                  }}
                >
                  {/* Animated liquid background */}
                  <div className="absolute inset-0 z-0">
                    <ThreeScene 
                      animationType="bubble" 
                      productType={product.productType}
                      color={product.color}
                      mousePosition={mousePosition}
                      isHovered={true}
                    />
                  </div>
                  
                  {/* Product image */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <img 
                      src={product.imageSrc}
                      alt={product.name}
                      className="h-[80%] w-auto object-contain transform transition-transform duration-300"
                      style={{
                        filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2))',
                        transform: `translateX(${mousePosition.x * 20}px) translateY(${mousePosition.y * 20}px) rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg)`
                      }}
                    />
                  </div>
                  
                  {/* Glare effect */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"
                    style={{
                      transform: `translateX(${-mousePosition.x * 50}px) translateY(${-mousePosition.y * 50}px)`,
                      opacity: 0.6
                    }}
                  ></div>
                </div>
              </ScrollReveal>
              
              {/* Product Info */}
              <div>
                <ScrollReveal>
                  <div className="flex items-center mb-2">
                    <Link to="/#products" className="text-sm font-medium text-blue-600 hover:underline flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      All Products
                    </Link>
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-3">{product.name}</h1>
                  <h2 className="text-xl text-gray-600 mb-6">{product.tagline}</h2>
                </ScrollReveal>
                
                <ScrollReveal delay={200}>
                  <p className="text-foreground/70 mb-8">{product.fullDescription}</p>
                </ScrollReveal>
                
                <ScrollReveal delay={300}>
                  <div className="mb-8">
                    <h3 className="font-bold mb-3">Key Benefits</h3>
                    <ul className="space-y-2">
                      {product.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollReveal>
                
                <ScrollReveal delay={400}>
                  <div className="flex flex-wrap gap-3 mb-8">
                    {product.ingredients.map((ingredient, index) => (
                      <span 
                        key={index} 
                        className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {ingredient}
                      </span>
                    ))}
                  </div>
                </ScrollReveal>
                
                <ScrollReveal delay={500}>
                  <div className="space-y-4">
                    <a
                      href="https://wa.me/917306379513?text=Hello, I'm interested in your product: Premium Toilet Cleaner"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="liquid-button w-full text-center flex items-center justify-center group"
                    >
                      <span className="relative z-10">Contact for Purchase</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </a>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container-padding">
            <ScrollReveal>
              <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            </ScrollReveal>
            
            <div className="grid md:grid-cols-3 gap-8">
              {product.features.map((feature, index) => (
                <ScrollReveal key={index} delay={index * 200}>
                  <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                    <div className="text-3xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
        
        {/* Usage Instructions */}
        <section className="py-16 bg-gray-50">
          <div className="container-padding">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <ScrollReveal>
                <div>
                  <h2 className="text-3xl font-bold mb-6">How to Use</h2>
                  <p className="text-gray-600 mb-6">{product.usage}</p>
                  <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-r">
                    <p className="text-sm text-yellow-800">
                      For best results, follow the usage instructions carefully. Contact us if you have any questions about this product.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
              
              <ScrollReveal delay={200}>
                <div className="relative h-64 rounded-xl overflow-hidden">
                  <ThreeScene 
                    animationType="wave" 
                    color={product.color}
                    productType={product.productType}
                    className="absolute inset-0" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/80 backdrop-blur-md rounded-xl px-8 py-6 shadow-lg max-w-sm">
                      <h3 className="text-lg font-bold mb-2">Safe for Daily Use</h3>
                      <p className="text-sm text-gray-600">
                        All OMIWO products are dermatologically tested and safe for regular use when used as directed.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>
        
        {/* Related Products */}
        <section className="py-16 bg-white">
          <div className="container-padding">
            <ScrollReveal>
              <h2 className="text-3xl font-bold text-center mb-4">Complete Your Collection</h2>
              <p className="text-center text-gray-600 mb-12">Discover other premium products from OMIWO</p>
            </ScrollReveal>
            
            <div className="grid md:grid-cols-2 gap-8">
              {Object.values(productsData)
                .filter(relatedProduct => relatedProduct.id !== product.id)
                .map((relatedProduct, index) => (
                  <ScrollReveal key={index} delay={index * 200}>
                    <Link 
                      to={`/product/${relatedProduct.id}`} 
                      className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100"
                    >
                      <div className="flex items-center p-6">
                        <div className="w-24 h-24 relative flex-shrink-0">
                          <img 
                            src={relatedProduct.imageSrc} 
                            alt={relatedProduct.name} 
                            className="h-full w-full object-contain transform group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="ml-6">
                          <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors">{relatedProduct.name}</h3>
                          <p className="text-sm text-gray-600">{relatedProduct.tagline}</p>
                        </div>
                      </div>
                    </Link>
                  </ScrollReveal>
                ))
              }
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;