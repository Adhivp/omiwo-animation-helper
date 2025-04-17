import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';
import ThreeScene from '../components/ThreeScene';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface ProductDetailType {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  color: string;
  product_type: 'toiletCleaner' | 'detergent' | 'handWash' | 'combo';
  is_combo: boolean;
  combo_items?: string;
  minimum_order?: number;
  ingredients?: string[];
  benefits?: string[];
  usage?: string;
  features?: { icon: string; title: string; description: string }[];
  stock_quantity: number;
}

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetailType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const productImageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    // Check user session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setUser(session.user);
        
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          setUserProfile(profile);
        }
      }
    };

    checkSession();

    // Fetch product data
    const fetchProduct = async () => {
      setIsLoading(true);
      
      try {
        // First check if it's a combo product
        let { data: comboProduct } = await supabase
          .from('combo_products')
          .select('*')
          .eq('id', productId)
          .single();

        if (comboProduct) {
          setProduct({
            ...comboProduct,
            is_combo: true,
            product_type: 'combo'
          });
        } else {
          // If not a combo, check regular products
          let { data: regularProduct } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();
            
          if (regularProduct) {
            setProduct({
              ...regularProduct,
              is_combo: false
            });
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast({
          title: "Error",
          description: "Product not found or error loading product details.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }

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
  }, [productId, navigate]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  // Calculate total price
  const totalPrice = product ? product.price * quantity : 0;

  // Handle buy now button
  const handleBuyNow = async () => {
    if (!product || !user) return;

    try {
      setIsProcessingPayment(true);
      
      // Create an order in our database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            product_id: product.id,
            product_name: product.name,
            quantity: quantity,
            unit_price: product.price,
            total_amount: product.price * quantity,
            status: 'pending',
            is_combo: product.is_combo,
            shipping_address: `${userProfile?.address_line1}, ${userProfile?.city}, ${userProfile?.state}, ${userProfile?.postal_code}`,
            phone: userProfile?.phone
          }
        ])
        .select()
        .single();
        
      if (orderError) throw orderError;
      
      if (!order) throw new Error("Failed to create order");
      
      // Initialize Razorpay
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: totalPrice * 100, // Razorpay uses amount in paisa
        currency: "INR",
        name: "OMIWO",
        description: `Purchase of ${product.name} (Qty: ${quantity})`,
        order_id: order.id,
        prefill: {
          name: userProfile?.full_name || '',
          email: user.email || '',
          contact: userProfile?.phone || ''
        },
        notes: {
          order_id: order.id
        },
        theme: {
          color: "#2563eb"
        },
        handler: async function(response: any) {
          // Handle successful payment
          const { error: updateError } = await supabase
            .from('orders')
            .update({
              status: 'completed',
              payment_id: response.razorpay_payment_id,
              payment_details: response
            })
            .eq('id', order.id);
            
          if (updateError) {
            console.error('Error updating order:', updateError);
            toast({
              title: "Payment Successful",
              description: "But we encountered an error updating your order. Please contact support.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Payment Successful",
              description: "Your order has been placed successfully!",
              variant: "default"
            });
            // Navigate to order confirmation page
            navigate(`/order-confirmation/${order.id}`);
          }
        }
      };
      
      const rzp = new window.Razorpay(options);
      rzp.open();
      
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Error",
        description: "There was a problem processing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 flex items-center justify-center bg-background">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-background p-4">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Product Not Found</h2>
          <p className="mb-6 text-muted-foreground">The product you are looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/shop')}>
            Back to Shop
          </Button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 bg-background min-h-screen">
        {/* Product Details */}
        <section className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            {/* Product Image */}
            <ScrollReveal>
              <div 
                ref={productImageRef}
                className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl bg-card"
                style={{
                  perspective: '1000px'
                }}
              >
                {/* Animated background */}
                <div className="absolute inset-0 z-0">
                  <ThreeScene 
                    animationType="bubble" 
                    productType={product.product_type as any}
                    color={product.color}
                    mousePosition={mousePosition}
                    isHovered={true}
                  />
                </div>
                
                {/* Product image */}
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <img 
                    src={product.image_url}
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
                  className="absolute inset-0 bg-gradient-to-br from-card/10 to-transparent pointer-events-none dark:from-white/10"
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
                <Button
                  variant="ghost"
                  onClick={() => navigate('/shop')}
                  className="mb-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                  Back to Shop
                </Button>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">{product.name}</h1>
                
                {product.is_combo && (
                  <div className="inline-flex items-center bg-primary/10 text-primary rounded-full py-1 px-3 text-sm font-medium mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                    Combo Pack
                  </div>
                )}
                
                <p className="text-xl font-semibold text-primary mb-4">₹{product.price} per unit</p>
              </ScrollReveal>
              
              <ScrollReveal delay={200}>
                <p className="text-muted-foreground mb-6">{product.description}</p>
                
                {product.is_combo && product.combo_items && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Combo Includes</h3>
                    <div className="bg-muted rounded-lg p-4 border border-border">
                      <p className="text-foreground">{product.combo_items}</p>
                    </div>
                  </div>
                )}
              </ScrollReveal>
              
              <ScrollReveal delay={300}>
                <Card className="mb-6">
                  <CardHeader className="pb-3">
                    <CardTitle>Order Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-center">
                        <span className="text-sm font-medium flex-grow">Quantity</span>
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-full"
                            onClick={() => setQuantity(q => Math.max(1, q - 1))}
                          >
                            -
                          </Button>
                          <Input 
                            type="number" 
                            value={quantity} 
                            onChange={handleQuantityChange} 
                            min="1"
                            className="w-16 h-8 text-center"
                          />
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-8 w-8 rounded-full"
                            onClick={() => setQuantity(q => q + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                      
                      {product.minimum_order && (
                        <div className="flex items-center text-sm bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 p-2 rounded">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                          </svg>
                          Minimum order value: ₹{product.minimum_order}
                        </div>
                      )}
                      
                      <div className="pt-4 border-t border-border">
                        <div className="flex justify-between">
                          <span className="text-foreground">Unit Price:</span>
                          <span className="text-foreground">₹{product.price}</span>
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-foreground">Quantity:</span>
                          <span className="text-foreground">{quantity}</span>
                        </div>
                        <div className="flex justify-between mt-4 font-bold text-lg">
                          <span className="text-foreground">Total:</span>
                          <span className="text-foreground">₹{totalPrice}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      size="lg"
                      onClick={handleBuyNow}
                      disabled={isProcessingPayment}
                    >
                      {isProcessingPayment ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        "Buy Now with Razorpay"
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              </ScrollReveal>
              
              {product.stock_quantity <= 10 && (
                <ScrollReveal delay={400}>
                  <div className="text-amber-600 dark:text-amber-400 text-sm flex items-center mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                    </svg>
                    Only {product.stock_quantity} left in stock - order soon!
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
          
          {/* Product Details */}
          <div className="mt-16">
            <ScrollReveal>
              <h2 className="text-2xl font-bold mb-8 text-foreground">Product Details</h2>
            </ScrollReveal>
            
            {/* Product Features */}
            {product.features && product.features.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {product.features.map((feature, index) => (
                  <ScrollReveal key={index} delay={index * 200}>
                    <div className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-3xl mb-4">{feature.icon}</div>
                      <h3 className="text-lg font-bold mb-2 text-foreground">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            )}
            
            {/* Product Ingredients and Usage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {product.ingredients && product.ingredients.length > 0 && (
                <ScrollReveal>
                  <Card>
                    <CardHeader>
                      <CardTitle>Ingredients</CardTitle>
                      <CardDescription>Made with premium quality ingredients</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc pl-6 space-y-2">
                        {product.ingredients.map((ingredient, index) => (
                          <li key={index} className="text-foreground">{ingredient}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              )}
              
              {product.usage && (
                <ScrollReveal delay={200}>
                  <Card>
                    <CardHeader>
                      <CardTitle>How to Use</CardTitle>
                      <CardDescription>Get the best results with these instructions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground">{product.usage}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;