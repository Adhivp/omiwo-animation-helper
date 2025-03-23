
import { useState } from 'react';
import ScrollReveal from './ScrollReveal';
import ProductCard from './ProductCard';

const ProductShowcase = () => {
  const products = [
    {
      name: 'Premium Toilet Cleaner',
      description: 'Advanced formula with natural extracts for a deep clean and long-lasting freshness.',
      color: '#0FA0CE',
      animationType: 'wave' as const
    },
    {
      name: 'Liquid Detergent',
      description: 'Powerful stain removal with gentle fabric care for all your laundry needs.',
      color: '#33C3F0',
      animationType: 'flow' as const
    },
    {
      name: 'Luxury Hand Wash',
      description: 'Enriched with moisturizers to clean and nourish your hands with every wash.',
      color: '#1EAEDB',
      animationType: 'ripple' as const
    }
  ];

  return (
    <section id="products" className="section-padding relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-omiwo-light-blue rounded-full opacity-20 blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-omiwo-soft-green rounded-full opacity-20 blur-3xl translate-y-1/2 -translate-x-1/3"></div>
      
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
        
        {/* Product Cards */}
        <div className="flex flex-col md:flex-row gap-8 mt-12">
          {products.map((product, index) => (
            <ProductCard 
              key={index}
              name={product.name}
              description={product.description}
              color={product.color}
              animationType={product.animationType}
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
