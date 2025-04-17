import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';
import ThreeScene from '../components/ThreeScene';
import { Button } from "@/components/ui/button";
 
// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type ProductType = {
  id: string;
  name: string;
  description: string;
  color: string;
  animationType: 'wave' | 'ripple' | 'flow' | 'pour' | 'bubble';
  productType: 'toiletCleaner' | 'detergent' | 'handWash' | 'combo';
  price: number;
  inStock: boolean;
  imageSrc?: string;
  isCombo?: boolean;
  comboItems?: string;
  minimumOrder?: number;
};

const ShopPage = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mainProducts, setMainProducts] = useState<ProductType[]>([]);
  const [comboProducts, setComboProducts] = useState<ProductType[]>([]);
  const [activeTab, setActiveTab] = useState('main');
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        navigate('/login');
        return;
      }
      
      setUser(session.user);
      setLoading(false);
    };
    
    checkSession();

    // Main products
    setMainProducts([
      {
        id: 'toilet-cleaner',
        name: 'Premium Toilet Cleaner',
        description: 'Microbial Cleaners & Non-Abrasive Cleaning Solutions for effective bathroom hygiene.',
        color: '#1e3a8a', // Dark blue for toilet cleaner
        animationType: 'bubble', 
        productType: 'toiletCleaner',
        price: 10,
        inStock: true,
        minimumOrder: 100,
        imageSrc: '/images/TC_main.png'
      },
      {
        id: 'liquid-detergent',
        name: 'Liquid Detergent',
        description: 'Color-safe technology with 99.9% germ defense for all your laundry needs.',
        color: '#3b82f6', // Blue for detergent
        animationType: 'bubble', 
        productType: 'detergent',
        price: 10,
        inStock: true,
        minimumOrder: 100,
        imageSrc: '/images/LD_main.png'
      },
      {
        id: 'hand-wash',
        name: 'Advanced Hand Wash',
        description: 'Antimicrobial Formulations with Long-lasting Protection for gentle hand care.',
        color: '#eab308', // Yellow
        animationType: 'bubble', 
        productType: 'handWash',
        price: 2,
        inStock: true,
        minimumOrder: 100,
        imageSrc: '/images/HW_main.png'
      },
    ]);

    // Combo products
    setComboProducts([
      {
        id: 'combo-1',
        name: '2 TC + 2 LD + 5 HW',
        description: 'Complete cleaning package with Toilet Cleaner, Liquid Detergent, and Hand Wash.',
        color: '#4f46e5',
        animationType: 'bubble',
        productType: 'combo',
        price: 2*10 + 2*10 + 5*2, // 2 TC + 2 LD + 5 HW = 50
        inStock: true,
        isCombo: true,
        comboItems: '2 Toilet Cleaners + 2 Liquid Detergents + 5 Hand Wash',
        imageSrc: 'images/2 TC 2 LD 5  HW.jpg'
      },
      {
        id: 'combo-2',
        name: '5 TC + 5 LD + 10 HW',
        description: 'Complete family cleaning package with multiple units of all products.',
        color: '#4f46e5',
        animationType: 'bubble',
        productType: 'combo',
        price: 5*10 + 5*10 + 10*2, // 5 TC + 5 LD + 10 HW = 120
        inStock: true,
        isCombo: true,
        comboItems: '5 Toilet Cleaners + 5 Liquid Detergents + 10 Hand Wash',
        imageSrc: 'images/5 TC 5 LD  10  HW.jpg'
      },
      {
        id: 'combo-3',
        name: '5 TC + 5 LD',
        description: 'Complete cleaning package with multiple Toilet Cleaners and Liquid Detergents.',
        color: '#4f46e5',
        animationType: 'bubble',
        productType: 'combo',
        price: 5*10 + 5*10, // 5 TC + 5 LD = 100
        inStock: true,
        isCombo: true,
        comboItems: '5 Toilet Cleaners + 5 Liquid Detergents',
        imageSrc: '/images/5 TC 5 LD.jpg'
      },
      {
        id: 'combo-4',
        name: '8 TC + 8 LD + 20 HW',
        description: 'Large family pack with multiple units of all cleaning products.',
        color: '#4f46e5',
        animationType: 'bubble',
        productType: 'combo',
        price: 8*10 + 8*10 + 20*2, // 8 TC + 8 LD + 20 HW = 200
        inStock: true,
        isCombo: true,
        comboItems: '8 Toilet Cleaners + 8 Liquid Detergents + 20 Hand Wash',
        imageSrc: '/images/8 TC 8 LD 20 HW.jpg'
      },
      {
        id: 'combo-5',
        name: '10 Liquid Detergent',
        description: 'Bulk pack of our premium Liquid Detergent.',
        color: '#3b82f6',
        animationType: 'bubble',
        productType: 'combo',
        price: 10*10, // 10 LD = 100
        inStock: true,
        isCombo: true,
        comboItems: '10 Liquid Detergents',
        imageSrc: '/images/10 LD (1).jpg'
      },
      {
        id: 'combo-6',
        name: '10 Toilet Cleaner',
        description: 'Bulk pack of our premium Toilet Cleaner.',
        color: '#1e3a8a',
        animationType: 'bubble',
        productType: 'combo',
        price: 10*10, // 10 TC = 100
        inStock: true,
        isCombo: true,
        comboItems: '10 Toilet Cleaners',
        imageSrc: '/images/10 TC (1).jpg'
      },
      {
        id: 'combo-7',
        name: '10 TC + 10 LD',
        description: 'Large bundle of Toilet Cleaners and Liquid Detergents.',
        color: '#4f46e5',
        animationType: 'bubble',
        productType: 'combo',
        price: 10*10 + 10*10, // 10 TC + 10 LD = 200
        inStock: true,
        isCombo: true,
        comboItems: '10 Toilet Cleaners + 10 Liquid Detergents',
        imageSrc: '/images/10 TC 10 LD.jpg'
      },
      {
        id: 'combo-8',
        name: '25 Hand Wash',
        description: 'Bulk pack of our premium Hand Wash.',
        color: '#eab308',
        animationType: 'bubble',
        productType: 'combo',
        price: 25*2, // 25 HW = 50
        inStock: true,
        isCombo: true,
        comboItems: '25 Hand Wash bottles',
        imageSrc: '/images/25 HW (1).jpg'
      },
    ]);
  }, [navigate]);

  // Handle product hovering for animation effects
  const handleProductHover = (id: string | null) => {
    setIsHovered(id);
  };

  // Calculate minimum quantity for a product based on price and minimum order value
  const calculateMinimumQuantity = (price: number) => {
    const minOrderValue = 100; // Rs. 100 minimum order value
    return Math.ceil(minOrderValue / price);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-background dark:to-background/70">
        <div className="container-padding">
          <ScrollReveal>
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">OMIWO Shop</h1>
              <p className="text-foreground/70 max-w-2xl mx-auto">
                Browse our full range of premium liquid cleaning products designed for your home and family.
              </p>
            </div>
          </ScrollReveal>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8 border-b border-gray-200 dark:border-gray-800">
            <button 
              className={`px-6 py-3 font-medium text-lg ${activeTab === 'main' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
              onClick={() => setActiveTab('main')}
            >
              Main Products
            </button>
            <button 
              className={`px-6 py-3 font-medium text-lg ${activeTab === 'combo' ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'}`}
              onClick={() => setActiveTab('combo')}
            >
              Combo Packs
            </button>
          </div>
          
          {/* Main Products Section */}
          {activeTab === 'main' && (
            <>
              <ScrollReveal delay={100}>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2 text-foreground">Individual Products</h2>
                  <p className="text-gray-600 dark:text-gray-400">Minimum order value: ₹100</p>
                </div>
              </ScrollReveal>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mainProducts.map((product) => (
                  <ScrollReveal key={product.id}>
                    <div 
                      className="bg-white dark:bg-card rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow"
                      onMouseEnter={() => handleProductHover(product.id)}
                      onMouseLeave={() => handleProductHover(null)}
                    >
                      <div className="relative h-60 overflow-hidden bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900">
                        {/* Animated Background */}
                        <div className="absolute inset-0">
                          <ThreeScene 
                            animationType="bubble" 
                            color={product.color} 
                            productType={product.productType as any}
                            isHovered={isHovered === product.id}
                          />
                        </div>
                        
                        {/* Product Image */}
                        <div className="relative z-10 h-full flex items-center justify-center">
                          <img 
                            src={product.imageSrc} 
                            alt={product.name} 
                            className="h-52 w-auto max-w-[80%] object-contain transform transition-all duration-500"
                            style={{ 
                              filter: 'drop-shadow(0 10px 8px rgba(0, 0, 0, 0.15))',
                              transform: isHovered === product.id ? 'scale(1.08)' : 'scale(1)'
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 text-foreground">{product.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{product.description}</p>
                        
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <span className="text-2xl font-bold">₹{product.price}</span>
                            <span className="text-gray-500 ml-1">per unit</span>
                          </div>
                          
                          <div className="bg-yellow-100 px-3 py-1 rounded-full text-yellow-800 text-sm">
                            Min: {calculateMinimumQuantity(product.price)} units
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </>
          )}
          
          {/* Combo Products Section */}
          {activeTab === 'combo' && (
            <>
              <ScrollReveal delay={100}>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-2 text-foreground">Combo Packages</h2>
                  <p className="text-gray-600 dark:text-gray-400">Save more with our special combination packs</p>
                </div>
              </ScrollReveal>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {comboProducts.map((product) => (
                  <ScrollReveal key={product.id}>
                    <div 
                      className="bg-white dark:bg-card rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow"
                      onMouseEnter={() => handleProductHover(product.id)}
                      onMouseLeave={() => handleProductHover(null)}
                    >
                      <div className="relative h-60 overflow-hidden bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900">
                        {/* Product Image (no animation for combo packs) */}
                        <div className="relative z-10 h-full flex items-center justify-center bg-gray-50">
                          <img 
                            src={product.imageSrc} 
                            alt={product.name} 
                            className="h-full w-full object-cover transform transition-all duration-500"
                          />
                        </div>
                      </div>
                      
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2 text-foreground">{product.name}</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-2">{product.comboItems}</p>
                        
                        <div className="flex justify-between items-center mb-4">
                          <div className="text-2xl font-bold">₹{product.price}</div>
                          
                          <div className="bg-blue-100 px-3 py-1 rounded-full text-blue-800 text-sm">
                            Combo Pack
                          </div>
                        </div>
                        
                        <Button 
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="w-full py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors"
                        >
                          Buy Now
                        </Button>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ShopPage;