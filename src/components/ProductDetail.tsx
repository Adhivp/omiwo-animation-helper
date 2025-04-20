import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ThreeScene from './ThreeScene';
import ScrollReveal from './ScrollReveal';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Info, TrendingUp, ShieldCheck } from 'lucide-react';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

interface ComboProductType {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  combo_items: string;
  is_combo: boolean;
  color?: string;
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

const comboProductsData: Record<string, ComboProductType> = {
  'combo-1': {
    id: 'combo-1',
    name: '2 TC + 2 LD + 5 HW',
    description: 'Complete cleaning package with Toilet Cleaner, Liquid Detergent, and Hand Wash.',
    price: 2*10 + 2*10 + 5*2, // 2 TC + 2 LD + 5 HW = 50
    image_url: '/images/2 TC 2 LD 5  HW.jpg',
    combo_items: '2 Toilet Cleaners + 2 Liquid Detergents + 5 Hand Wash',
    is_combo: true,
    color: '#4f46e5'
  },
  'combo-2': {
    id: 'combo-2',
    name: '5 TC + 5 LD + 10 HW',
    description: 'Complete family cleaning package with multiple units of all products.',
    price: 5*10 + 5*10 + 10*2, // 5 TC + 5 LD + 10 HW = 120
    image_url: '/images/5 TC 5 LD  10  HW.jpg',
    combo_items: '5 Toilet Cleaners + 5 Liquid Detergents + 10 Hand Wash',
    is_combo: true,
    color: '#4f46e5'
  },
  'combo-3': {
    id: 'combo-3',
    name: '5 TC + 5 LD',
    description: 'Complete cleaning package with multiple Toilet Cleaners and Liquid Detergents.',
    price: 5*10 + 5*10, // 5 TC + 5 LD = 100
    image_url: '/images/5 TC 5 LD.jpg',
    combo_items: '5 Toilet Cleaners + 5 Liquid Detergents',
    is_combo: true,
    color: '#4f46e5'
  },
  'combo-4': {
    id: 'combo-4',
    name: '8 TC + 8 LD + 20 HW',
    description: 'Large family pack with multiple units of all cleaning products.',
    price: 8*10 + 8*10 + 20*2, // 8 TC + 8 LD + 20 HW = 200
    image_url: '/images/8 TC 8 LD 20 HW.jpg',
    combo_items: '8 Toilet Cleaners + 8 Liquid Detergents + 20 Hand Wash',
    is_combo: true,
    color: '#4f46e5'
  },
  'combo-5': {
    id: 'combo-5',
    name: '10 Liquid Detergent',
    description: 'Bulk pack of our premium Liquid Detergent.',
    price: 10*10, // 10 LD = 100
    image_url: '/images/10 LD (1).jpg',
    combo_items: '10 Liquid Detergents',
    is_combo: true,
    color: '#3b82f6'
  },
  'combo-6': {
    id: 'combo-6',
    name: '10 Toilet Cleaner',
    description: 'Bulk pack of our premium Toilet Cleaner.',
    price: 10*10, // 10 TC = 100
    image_url: '/images/10 TC (1).jpg',
    combo_items: '10 Toilet Cleaners',
    is_combo: true,
    color: '#1e3a8a'
  },
  'combo-7': {
    id: 'combo-7',
    name: '10 TC + 10 LD',
    description: 'Large bundle of Toilet Cleaners and Liquid Detergents.',
    price: 10*10 + 10*10, // 10 TC + 10 LD = 200
    image_url: '/images/10 TC 10 LD.jpg',
    combo_items: '10 Toilet Cleaners + 10 Liquid Detergents',
    is_combo: true,
    color: '#4f46e5'
  },
  'combo-8': {
    id: 'combo-8',
    name: '25 Hand Wash',
    description: 'Bulk pack of our premium Hand Wash.',
    price: 25*2, // 25 HW = 50
    image_url: '/images/25 HW (1).jpg',
    combo_items: '25 Hand Wash bottles',
    is_combo: true,
    color: '#eab308'
  }
};

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<ProductDataType | null>(null);
  const [comboProduct, setComboProduct] = useState<ComboProductType | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const productImageRef = useRef<HTMLDivElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      // Cleanup
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    // Simulate loading data
    setIsLoading(true);
    
    const fetchProductDetails = async () => {
      try {
        if (!productId) return;
        
        // Check if it's a regular product
        if (productId in productsData) {
          setProduct(productsData[productId]);
          setComboProduct(null);
        } 
        // Check if it's a combo product
        else if (productId in comboProductsData) {
          setProduct(null);
          setComboProduct(comboProductsData[productId]);
        }
        // Product not found
        else {
          setProduct(null);
          setComboProduct(null);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        setProduct(null);
        setComboProduct(null);
      } finally {
        // Delay slightly for better UX
        setTimeout(() => {
          setIsLoading(false);
        }, 800);
      }
    };

    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setIsLoggedIn(true);
        setUser(session.user);
        
        // Fetch user profile
        try {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (data) {
            setUserProfile(data);
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      } else {
        setIsLoggedIn(false);
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (productImageRef.current) {
        const rect = productImageRef.current.getBoundingClientRect();
        // Normalize coordinates between -1 and 1
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        setMousePosition({ x, y });
      }
    };
    
    checkAuth();
    fetchProductDetails();
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [productId]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const calculateTotalPrice = () => {
    if (product) {
      return 10 * quantity; // Assume regular products are 10 each
    } else if (comboProduct) {
      return comboProduct.price * quantity;
    }
    return 0;
  };

  // Handle buy now button
  const handleBuyNow = async () => {
    if ((!product && !comboProduct) || !user) {
      navigate('/login');
      return;
    }
  
    try {
      setIsProcessingPayment(true);
      
      const productName = product ? product.name : comboProduct ? comboProduct.name : '';
      const productPrice = product ? 10 : comboProduct ? comboProduct.price : 0;
      const totalAmount = productPrice * quantity;
      const isCombo = !!comboProduct;
      
      // Step 1: Create an order in our database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            product_id: productId,
            product_name: productName,
            quantity: quantity,
            unit_price: productPrice,
            total_amount: totalAmount,
            status: 'pending',
            is_combo: isCombo,
            shipping_address: `${userProfile?.address_line1}, ${userProfile?.city}, ${userProfile?.state}, ${userProfile?.postal_code}`,
            phone: userProfile?.phone
          }
        ])
        .select()
        .single();
        
      if (orderError) throw orderError;
      if (!order) throw new Error("Failed to create order");
      
      // Step 2: Create a Razorpay order through our Supabase Edge Function
      const razorpayOrderResponse = await fetch('https://gxwxiaqxtorxxiikfovn.supabase.co/functions/v1/create-razorpay-order', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`
        },
        body: JSON.stringify({
          amount: totalAmount * 100, // In paise/cents
          currency: 'INR',
          receipt: order.id,
          notes: {
            order_id: order.id,
            product_name: productName,
            user_email: user.email
          }
        })
      });
      
      if (!razorpayOrderResponse.ok) {
        const errorData = await razorpayOrderResponse.json();
        throw new Error(`Failed to create payment order: ${errorData.message || razorpayOrderResponse.statusText}`);
      }
      
      const razorpayOrderData = await razorpayOrderResponse.json();
      
      // Step 3: Initialize Razorpay checkout
      if (!(window as any).Razorpay) {
        throw new Error('Razorpay SDK failed to load');
      }
      
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Using the key from env variables
        amount: totalAmount * 100, // Amount in smallest currency unit
        currency: "INR",
        name: "OMIWO",
        description: `Purchase of ${productName} (Qty: ${quantity})`,
        order_id: razorpayOrderData.id, // Use the order ID returned from Razorpay
        image: "/images/omiwo_logo.png",
        prefill: {
          name: userProfile?.full_name || "",
          email: user.email || "",
          contact: userProfile?.phone || ""
        },
        notes: {
          address: userProfile?.address_line1 || "",
          order_id: order.id,
          supabase_order_id: order.id // Store this to link with our DB
        },
        theme: {
          color: "#3399cc"
        },
        handler: async function(response: any) {
          try {
            // Show a loading state in the UI when verification is happening
            toast({
              title: "Verifying Payment",
              description: "Please wait while we verify your payment...",
              variant: "default"
            });

            // Step 4: Verify the payment through our Supabase Edge Function
            const verifyResponse = await fetch('https://gxwxiaqxtorxxiikfovn.supabase.co/functions/v1/verify-razorpay-payment', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${supabaseAnonKey}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                order_id: order.id
              })
            });
            
            // Parse the response
            const verifyData = await verifyResponse.json();
            
            // Change this line - check for verifyData.valid instead of verifyData.verified
            if (!verifyResponse.ok || !verifyData.valid) {
              throw new Error('Payment verification failed');
            }
            
            // Rest of your code remains the same
            const { error: updateError } = await supabase
              .from('orders')
              .update({ 
                status: 'completed',
                payment_id: response.razorpay_payment_id,
                payment_details: JSON.stringify(response)
              })
              .eq('id', order.id);
              
            if (updateError) throw updateError;
            
            toast({
              title: "Payment Successful",
              description: "Your order has been placed successfully!",
              variant: "default"
            });
            
            navigate(`/order-confirmation/${order.id}`);
          } catch (error) {
            console.error('Payment verification error:', error);
            
            // Update order status to failed
            await supabase
              .from('orders')
              .update({ 
                status: 'failed',
                payment_details: JSON.stringify({ error: 'Payment verification failed' })
              })
              .eq('id', order.id);
              
            toast({
              title: "Payment Verification Failed",
              description: "There was a problem verifying your payment. Please contact support.",
              variant: "destructive"
            });
          } finally {
            setIsProcessingPayment(false);
          }
        }
      };
      
      const razorpay = new (window as any).Razorpay(options);
      
      razorpay.on('payment.failed', async function(response: any) {
        console.error('Payment failed:', response.error);
        
        // Update order status to failed
        await supabase
          .from('orders')
          .update({ 
            status: 'failed',
            payment_details: JSON.stringify({
              error_code: response.error.code,
              error_description: response.error.description,
              error_source: response.error.source,
              error_reason: response.error.reason,
              error_metadata: response.error.metadata
            })
          })
          .eq('id', order.id);
        
        toast({
          title: "Payment Failed",
          description: response.error.description || "Your payment could not be processed. Please try again.",
          variant: "destructive"
        });
        
        setIsProcessingPayment(false);
      });
      
      // Open Razorpay payment dialog
      razorpay.open();
      
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Error",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive"
      });
      setIsProcessingPayment(false);
    }
  };

  // Custom Liquid Loading Component
  const LiquidLoading = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="relative h-32 w-32 mb-6">
        <div className="absolute inset-0 rounded-full bg-blue-500 dark:bg-blue-600 opacity-20 animate-ping"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="h-20 w-20 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center p-4 shadow-lg">
            <img 
              src="/images/omiwo_logo.png" 
              alt="OMIWO Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <div className="absolute inset-x-0 -bottom-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-400 animate-liquidwave rounded-full"></div>
      </div>
      <p className="text-blue-600 dark:text-blue-400 font-medium animate-pulse">Loading product details...</p>
    </div>
  );

  // Product Not Found Component
  const ProductNotFound = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="relative h-32 w-32 mb-6">
        <div className="h-full w-full rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
          <div className="h-1/2 w-full bg-gray-300 dark:bg-gray-600 absolute top-1/2" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Info className="h-12 w-12 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-foreground">Product Not Found</h2>
      <p className="mb-6 text-center text-muted-foreground">
        The product you are looking for doesn't exist or has been removed.
      </p>
      <Link to="/shop">
        <Button className="bg-blue-600 hover:bg-blue-700">
          Browse Our Products
        </Button>
      </Link>
    </div>
  );

  if (isLoading) {
    return (
      <>
        <Navbar />
        <LiquidLoading />
        <Footer />
      </>
    );
  }

  if (!product && !comboProduct) {
    return (
      <>
        <Navbar />
        <ProductNotFound />
        <Footer />
      </>
    );
  }

  // Get product color for ThreeScene
  const getProductColor = () => {
    if (product) {
      return product.color;
    } else if (comboProduct) {
      return comboProduct.color || '#4f46e5';
    }
    return '#3b82f6';
  };

  // Get product type for ThreeScene
  const getProductType = (): 'toiletCleaner' | 'detergent' | 'handWash' => {
    if (product) {
      return product.productType;
    } else if (comboProduct) {
      if (comboProduct.combo_items.toLowerCase().includes('toilet')) {
        return 'toiletCleaner';
      } else if (comboProduct.combo_items.toLowerCase().includes('detergent')) {
        return 'detergent';
      } else {
        return 'handWash';
      }
    }
    return 'detergent'; // Default
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <div className="container-padding py-12 md:py-20">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Product Image with Animation - Show 3D only for regular products */}
              <ScrollReveal>
                <div 
                  ref={productImageRef}
                  className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl"
                  style={{
                    perspective: '1000px'
                  }}
                >
                  {/* Show 3D background only for regular products */}
                  {product && (
                    <div className="absolute inset-0 z-0">
                      <ThreeScene 
                        animationType="bubble" 
                        productType={getProductType()}
                        color={getProductColor()}
                        mousePosition={mousePosition}
                        isHovered={true}
                      />
                    </div>
                  )}
                  
                  {/* For combo products, use a clean background with no effects */}
                  {comboProduct && (
                    <div className="absolute inset-0 z-0 bg-white dark:bg-gray-800"></div>
                  )}
                  
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <img 
                      src={product ? product.imageSrc : comboProduct ? comboProduct.image_url : ''}
                      alt={product ? product.name : comboProduct ? comboProduct.name : ''}
                      className={`${comboProduct ? 'h-auto max-h-[90%] max-w-[90%]' : 'h-[80%]'} w-auto object-contain ${!comboProduct && 'transform transition-transform duration-300'}`}
                      style={
                        product ? {
                          filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2))',
                          transform: `translateX(${mousePosition.x * 20}px) translateY(${mousePosition.y * 20}px) rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg)`
                        } : {
                          filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.2))'
                        }
                      }
                    />
                  </div>
                </div>
              </ScrollReveal>
              
              {/* Rest of the product info section remains unchanged */}
              <div>
                <ScrollReveal>
                  <div className="flex items-center mb-2">
                    <Link to="/shop" className="text-blue-600 hover:text-blue-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Back to Products
                    </Link>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                    {product ? product.name : comboProduct ? comboProduct.name : ''}
                  </h1>
                  <p className="text-xl mt-2 text-foreground/80 font-light">
                    {product ? product.tagline : comboProduct ? comboProduct.description : ''}
                  </p>
                </ScrollReveal>
                
                <ScrollReveal delay={200}>
                  {comboProduct && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                      <h3 className="text-lg font-medium text-blue-700 dark:text-blue-300">Combo Contents:</h3>
                      <p className="text-blue-600 dark:text-blue-200">{comboProduct.combo_items}</p>
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <div className="flex items-end mb-4">
                      <span className="text-3xl font-bold text-foreground">₹{product ? 10 : comboProduct ? comboProduct.price : 0}</span>
                      <span className="text-lg text-foreground/70 ml-2">per unit</span>
                    </div>

                    <p className="text-foreground/80 mb-6">
                      {product ? product.fullDescription : 'Premium combination pack offering excellent value. Get all the cleaning products you need in one convenient package.'}
                    </p>
                  </div>
                </ScrollReveal>
                
                <ScrollReveal delay={300}>
                  <Card className="mb-6 bg-card/60 backdrop-blur-sm border border-border">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="quantity" className="block text-sm font-medium text-foreground mb-1">
                            Quantity
                          </label>
                          <div className="flex items-center">
                            <Input
                              id="quantity"
                              type="number"
                              min="1"
                              value={quantity}
                              onChange={handleQuantityChange}
                              className="w-20 mr-4"
                            />
                            <span className="text-foreground/70">
                              Total: <span className="font-bold text-primary">₹{calculateTotalPrice()}</span>
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex gap-4 pt-2">
                          <Button
                            onClick={handleBuyNow}
                            disabled={isProcessingPayment}
                            className="bg-blue-600 hover:bg-blue-700 flex-1"
                          >
                            {isProcessingPayment ? 'Processing...' : 'Buy Now'}
                          </Button>
                        </div>

                        {!isLoggedIn && (
                          <p className="text-amber-600 dark:text-amber-400 text-sm">
                            <Info className="inline h-4 w-4 mr-1" />
                            Sign in required to complete your purchase
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
                
                <ScrollReveal delay={400}>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      In Stock
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Best Seller
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Quality Assured
                    </Badge>
                  </div>
                </ScrollReveal>
                
                <ScrollReveal delay={500}>
                  <div className="mt-6 grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mx-auto mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-xs text-foreground/70">Premium Quality</p>
                    </div>
                    <div className="text-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mx-auto mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-xs text-foreground/70">Fast Delivery</p>
                    </div>
                    <div className="text-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mx-auto mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <p className="text-xs text-foreground/70">Secure Payment</p>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </section>
        
        {/* Product Details */}
        {product && (
          <>
            {/* Features Section */}
            <section className="py-16 bg-white dark:bg-gray-900">
              <div className="container-padding">
                <ScrollReveal>
                  <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Key Features</h2>
                </ScrollReveal>
                
                <div className="grid md:grid-cols-3 gap-8">
                  {product.features.map((feature, index) => (
                    <ScrollReveal key={index} delay={index * 200}>
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
                        <div className="text-3xl mb-4">{feature.icon}</div>
                        <h3 className="text-lg font-bold mb-2 text-foreground">{feature.title}</h3>
                        <p className="text-foreground/70">{feature.description}</p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            </section>
            
            {/* Ingredients & Benefits */}
            <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
              <div className="container-padding">
                <div className="grid md:grid-cols-2 gap-12">
                  <ScrollReveal>
                    <div>
                      <h3 className="text-2xl font-bold mb-6 text-foreground">Ingredients</h3>
                      <ul className="space-y-3">
                        {product.ingredients.map((ingredient, index) => (
                          <li key={index} className="flex items-start">
                            <div className="h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mr-3 mt-0.5">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-foreground">{ingredient}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ScrollReveal>
                  
                  <ScrollReveal delay={200}>
                    <div>
                      <h3 className="text-2xl font-bold mb-6 text-foreground">Benefits</h3>
                      <ul className="space-y-3">
                        {product.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <div className="h-6 w-6 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mr-3 mt-0.5">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-foreground">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </section>
            
            {/* Usage Instructions */}
            <section className="py-16 bg-white dark:bg-gray-900">
              <div className="container-padding">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <ScrollReveal>
                    <div>
                      <h3 className="text-2xl font-bold mb-6 text-foreground">Usage Instructions</h3>
                      <div className="p-6 bg-blue-50 dark:bg-blue-900/30 rounded-xl border border-blue-100 dark:border-blue-800">
                        <p className="text-foreground/90 leading-relaxed">{product.usage}</p>
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
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            </section>
          </>
        )}
        
        {/* Combo Package Details */}
        {comboProduct && (
          <section className="py-16 bg-white dark:bg-gray-900">
            <div className="container-padding">
              <ScrollReveal>
                <h2 className="text-3xl font-bold text-center mb-8 text-foreground">Package Contents</h2>
                <p className="text-center text-foreground/70 max-w-3xl mx-auto mb-12">
                  This value pack contains the following premium OMIWO products combined for maximum cleaning efficiency and cost savings.
                </p>
              </ScrollReveal>
              
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-2xl p-6 md:p-10 border border-blue-100 dark:border-blue-800">
                <ScrollReveal delay={200}>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-medium mb-4 text-foreground">Package Contents</h3>
                      <div className="space-y-4">
                        {comboProduct.combo_items.split('+').map((item, index) => (
                          <div key={index} className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-white dark:bg.gray-800 flex items-center justify-center mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-foreground font-medium">{item.trim()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-medium mb-4 text-foreground">Value Benefits</h3>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-white dark:bg.gray-800 flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="text-foreground font-medium">Cost savings compared to individual purchases</span>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-white dark:bg.gray-800 flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                          </div>
                          <span className="text-foreground font-medium">Premium quality guarantee on all products</span>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-white dark:bg.gray-800 flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <span className="text-foreground font-medium">Convenient single delivery</span>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                          </div>
                          <span className="text-foreground font-medium">Complete cleaning solution for your home</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </section>
        )}
        
        {/* Related Products */}
        <section className="py-16 bg-gray-50 dark:bg-gray-800/50">
          <div className="container-padding">
            <ScrollReveal>
              <h2 className="text-3xl font-bold text-center mb-4 text-foreground">Complete Your Collection</h2>
              <p className="text-center text-foreground/70 mb-12">Discover other premium products from OMIWO</p>
            </ScrollReveal>
            
            <div className="grid md:grid-cols-2 gap-8">
              {Object.values(productsData)
                .filter(relatedProduct => product ? relatedProduct.id !== product.id : true)
                .slice(0, 2)
                .map((relatedProduct, index) => (
                  <ScrollReveal key={index} delay={index * 200}>
                    <Link to={`/product/${relatedProduct.id}`} className="block">
                      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center p-4">
                          <div className="h-20 w-20 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden mr-4">
                            <img 
                              src={relatedProduct.imageSrc} 
                              alt={relatedProduct.name} 
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground">{relatedProduct.name}</h3>
                            <p className="text-sm text-foreground/70">{relatedProduct.tagline}</p>
                          </div>
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

      {/* Add animation for liquid loading */}
      <style jsx>{`
        @keyframes liquidwave {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-liquidwave {
          animation: liquidwave 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default ProductDetail;