
import { useState } from 'react';
import ScrollReveal from './ScrollReveal';
import ProductCard from './ProductCard';

const ProductShowcase = () => {
  const products = [
    {
      name: 'Premium Toilet Cleaner',
      description: 'Advanced formula with microbial cleaners for a deep clean and non-abrasive cleaning solutions.',
      color: '#E63946', // Red based on the OMIWO toilet cleaner packaging
      animationType: 'flow' as const,
      productType: 'toiletCleaner' as const,
      imageSrc: 'public/lovable-uploads/928cb3fa-f7c2-4192-8864-11c912a2416e.png'
    },
    {
      name: 'Liquid Detergent',
      description: 'Color-safe technology with 99.9% germ defense for all your laundry needs.',
      color: '#2A9D8F', // Teal based on the OMIWO detergent packaging
      animationType: 'pour' as const,
      productType: 'detergent' as const,
      imageSrc: 'public/lovable-uploads/73b669e8-f01e-4699-b751-8f0df0073e73.png'
    },
    {
      name: 'Advanced Hand Wash',
      description: 'Antimicrobial formulations with long-lasting protection for gentle hand care.',
      color: '#00B4D8', // Light blue based on the OMIWO hand wash packaging
      animationType: 'ripple' as const,
      productType: 'handWash' as const,
      imageSrc: 'public/lovable-uploads/9ab0d91e-0c3e-4715-8d80-703d7a5d560f.png'
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
        
        {/* OMIWO Logo */}
        <ScrollReveal delay={200}>
          <div className="flex justify-center mb-12">
            <img 
              src="public/lovable-uploads/4b03a1bc-6c22-48bf-abfb-9f89c90257d8.png" 
              alt="OMIWO Logo" 
              className="h-16 md:h-20"
            />
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
