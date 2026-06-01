import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import ScrollReveal from './ScrollReveal';
import ProductCard from './ProductCard';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ProductShowcase = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    
    checkAuth();
  }, []);
  
  const mainProducts = [
    {
      name: 'Premium Toilet Cleaner',
      description: 'Microbial Cleaners & Non-Abrasive Cleaning Solutions for effective bathroom hygiene.',
      color: '#1e3a8a', // Dark blue for toilet cleaner
      animationType: 'bubble' as const, 
      productType: 'toiletCleaner' as const,
    },
    {
      name: 'Liquid Detergent',
      description: 'Color-safe technology with 99.9% germ defense for all your laundry needs.',
      color: '#3b82f6', // Blue for detergent
      animationType: 'bubble' as const, 
      productType: 'detergent' as const,
    },
    {
      name: 'Advanced Hand Wash',
      description: 'Antimicrobial Formulations with Long-lasting Protection for gentle hand care.',
      color: '#eab308', // Changed to yellow (#eab308)
      animationType: 'bubble' as const, 
      productType: 'handWash' as const,
    }
  ];

  const newProducts = [
    {
      name: 'Premium Liquid Detergent Bottle',
      description: 'Professional Grade Laundry Solution with advanced stain-fighting technology.',
      color: '#3b82f6', // Blue
      animationType: 'pour' as const, 
      productType: 'detergent' as const,
      imageSrc: '/images/LD_bottle.png',
    },
    {
      name: 'Premium Toilet Cleaner Bottle',
      description: 'Professional Bathroom Sanitation with powerful stain removal and germ elimination.',
      color: '#1e3a8a', // Dark blue
      animationType: 'bubble' as const, 
      productType: 'toiletCleaner' as const,
      imageSrc: '/images/TC_bottle.png',
    }
  ];

  return (
    <section id="products" className="section-padding relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-200 rounded-full opacity-20 blur-3xl translate-y-1/2 -translate-x-1/3"></div>
      
      <div className="container-padding relative z-10">
        {/* Section Header */}
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Our Premium Collection</h2>
            <p className="text-foreground/70 max-w-2xl mx-auto">
              Discover our range of premium liquid products designed to elevate your cleaning experience with elegance and effectiveness.
            </p>
          </div>
        </ScrollReveal>
        
        {/* Product Cards - Main Collection */}
        <div className="flex flex-col md:flex-row gap-8 mt-12">
          {mainProducts.map((product, index) => (
            <ProductCard 
              key={index}
              name={product.name}
              description={product.description}
              color={product.color}
              animationType={product.animationType}
              productType={product.productType}
              delay={index * 200}
            />
          ))}
        </div>

        {/* New Products Section */}
        <div className="mt-20">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">New Premium Bottles</h3>
              <p className="text-foreground/70">Professional-grade solutions in convenient bottles</p>
            </div>
          </ScrollReveal>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center md:justify-center">
            {newProducts.map((product, index) => (
              <ProductCard 
                key={`new-${index}`}
                name={product.name}
                description={product.description}
                color={product.color}
                animationType={product.animationType}
                productType={product.productType}
                delay={600 + index * 200}
              />
            ))}
          </div>
        </div>
        
        {/* Call to Action */}
        <ScrollReveal delay={1000}>
          <div className="mt-16 text-center">
            <Link to="/login" className="liquid-button">
              <span className="relative z-10">Sign In to Shop</span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ProductShowcase;
