
import ThreeScene from './ThreeScene';
import ScrollReveal from './ScrollReveal';

const AboutSection = () => {
  return (
    <section id="about" className="section-padding relative bg-gradient-to-b from-white to-omiwo-off-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full opacity-10"
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
          {/* 3D Visual */}
          <div className="relative h-96 overflow-hidden rounded-2xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-omiwo-blue/20 to-omiwo-teal/20"></div>
            <ThreeScene 
              animationType="pour" 
              color="#33C3F0" 
              className="absolute inset-0" 
            />
            
            {/* OMIWO Logo Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <img 
                src="public/lovable-uploads/4b03a1bc-6c22-48bf-abfb-9f89c90257d8.png" 
                alt="OMIWO Logo" 
                className="w-1/2 animate-pulse"
                style={{ animationDuration: '4s' }}
              />
            </div>
          </div>
          
          {/* Content */}
          <div>
            <ScrollReveal>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Crafted With Precision</h2>
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
                  <span className="font-medium">Eco-Friendly</span>
                </div>
                
                <div className="glass-card px-5 py-3 flex items-center transform transition-all hover:scale-105 hover:shadow-md">
                  <div className="w-4 h-4 rounded-full bg-cyan-500 mr-3"></div>
                  <span className="font-medium">Premium Quality</span>
                </div>
                
                <div className="glass-card px-5 py-3 flex items-center transform transition-all hover:scale-105 hover:shadow-md">
                  <div className="w-4 h-4 rounded-full bg-blue-500 mr-3"></div>
                  <span className="font-medium">Dermatologically Tested</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
