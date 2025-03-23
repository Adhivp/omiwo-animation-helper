
import ThreeScene from './ThreeScene';
import ScrollReveal from './ScrollReveal';

const AboutSection = () => {
  return (
    <section id="about" className="section-padding relative bg-omiwo-off-white">
      <div className="container-padding">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* 3D Visual */}
          <div className="relative h-96 overflow-hidden rounded-2xl">
            <ThreeScene animationType="flow" color="#33C3F0" className="absolute inset-0" />
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
                <div className="glass-card px-5 py-3 flex items-center">
                  <div className="w-4 h-4 rounded-full bg-omiwo-blue mr-3"></div>
                  <span className="font-medium">Eco-Friendly</span>
                </div>
                
                <div className="glass-card px-5 py-3 flex items-center">
                  <div className="w-4 h-4 rounded-full bg-omiwo-teal mr-3"></div>
                  <span className="font-medium">Premium Quality</span>
                </div>
                
                <div className="glass-card px-5 py-3 flex items-center">
                  <div className="w-4 h-4 rounded-full bg-omiwo-blue mr-3"></div>
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
