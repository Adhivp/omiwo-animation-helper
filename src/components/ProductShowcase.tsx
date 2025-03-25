
import { useState } from 'react';
import ScrollReveal from './ScrollReveal';
import ProductCard from './ProductCard';

const ProductShowcase = () => {
  const products = [
    {
      name: 'Premium Toilet Cleaner',
      description: 'Microbial Cleaners & Non-Abrasive Cleaning Solutions for effective bathroom hygiene.',
      color: '#1e3a8a', // Dark blue for toilet cleaner
      animationType: 'flow' as const,
      productType: 'toiletCleaner' as const,
      imageSrc: '/lovable-uploads/faec8bf4-7836-4dd2-8b31-2f8b098b4487.png'
    },
    {
      name: 'Liquid Detergent',
      description: 'Color-safe technology with 99.9% germ defense for all your laundry needs.',
      color: '#3b82f6', // Blue for detergent
      animationType: 'pour' as const,
      productType: 'detergent' as const,
      imageSrc: '/lovable-uploads/47e3e4c5-435c-4cef-b4a1-128d7def77e5.png'
    },
    {
      name: 'Advanced Hand Wash',
      description: 'Antimicrobial Formulations with Long-lasting Protection for gentle hand care.',
      color: '#06b6d4', // Turquoise for hand wash
      animationType: 'ripple' as const,
      productType: 'handWash' as const,
      imageSrc: '/lovable-uploads/62d1d8d7-af54-4342-91fb-7ea7229741bc.png'
    }
  ];

  return (
    <section id="products" className="section-padding relative overflow-hidden">
      {/* Background Shapes */}
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
        
        {/* OMIWO Text */}
        <ScrollReveal delay={200}>
          <div className="flex justify-center mb-12">
            <h3 className="text-4xl md:text-6xl font-bold text-gradient">OMIWO</h3>
          </div>
        </ScrollReveal>
        
        {/* Product Cards */}
        <div className="flex flex-col md:flex-row gap-8 mt-12">
          {products.map((product, index) => (
            <ProductCard 
              key={index}
              name={product.name}
              description={product.description}
              color={product.color}
              animationType={product.animationType}
              productType={product.productType}
              imageSrc={product.imageSrc}
              delay={index * 200}
            />
          ))}
        </div>
        
        {/* Call to Action */}
        <ScrollReveal delay={600}>
          <div className="mt-16 text-center">
            <button className="liquid-button">
              <span className="relative z-10">View All Products</span>
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ProductShowcase;
