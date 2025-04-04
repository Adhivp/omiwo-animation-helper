import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import GoldCoinDraw from './GoldCoinDraw';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [goldDrawOpen, setGoldDrawOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed w-full z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-md py-2'
          : 'bg-transparent py-6'
      )}
    >
      <div className="container-padding flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="text-2xl font-bold text-gradient">OMIWO</a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#products" className="text-foreground/80 hover:text-foreground transition-colors">Products</a>
          <a href="#about" className="text-foreground/80 hover:text-foreground transition-colors">About</a>
          <a href="#contact" className="text-foreground/80 hover:text-foreground transition-colors">Contact</a>
          <button 
            onClick={() => setGoldDrawOpen(true)} 
            className="flex items-center bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-4 py-2 rounded-full font-medium hover:shadow-lg hover:from-yellow-500 hover:to-amber-600 transition-all transform hover:-translate-y-0.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" fill="#FFD700" strokeWidth="0"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="#B8860B" d="M12 6v12M8 12h8"/>
            </svg>
            <span>Win Gold Coin</span>
          </button>
          <a href="" className="liquid-button">
            <span className="relative z-10">Get Started</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'md:hidden fixed inset-0 bg-white/90 backdrop-blur-lg z-40 transition-all duration-300 ease-in-out flex flex-col justify-center items-center space-y-8 pt-16',
          mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        )}
      >
        <a 
          href="#products" 
          className="text-xl font-medium text-foreground"
          onClick={() => setMobileMenuOpen(false)}
        >
          Products
        </a>
        <a 
          href="#about" 
          className="text-xl font-medium text-foreground"
          onClick={() => setMobileMenuOpen(false)}
        >
          About
        </a>
        <a 
          href="#contact" 
          className="text-xl font-medium text-foreground"
          onClick={() => setMobileMenuOpen(false)}
        >
          Contact
        </a>
        <button
          onClick={() => {
            setMobileMenuOpen(false);
            setGoldDrawOpen(true);
          }}
          className="flex items-center bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-6 py-3 rounded-full font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" fill="#FFD700" strokeWidth="0"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" stroke="#B8860B" d="M12 6v12M8 12h8"/>
          </svg>
          Win Gold Coin
        </button>
        <a 
          href="" 
          className="liquid-button mt-4"
          onClick={() => setMobileMenuOpen(false)}
        >
          <span className="relative z-10">Get Started</span>
        </a>
      </div>

      {/* Gold Coin Draw Dialog */}
      <GoldCoinDraw open={goldDrawOpen} onOpenChange={setGoldDrawOpen} />
    </nav>
  );
};

export default Navbar;
