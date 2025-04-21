import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';
import { Button } from '@/components/ui/button';
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

type OrderDetails = {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_amount: number;
  status: string;
  created_at: string;
  payment_id?: string;
  is_combo: boolean;
  estimated_delivery: string;
  shipping_address: string;
  delivery_charge?: number;
};

const OrderConfirmation = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();
          
        if (error) throw error;
        
        if (data) {
          // Calculate estimated delivery date (7 days from now)
          const deliveryDate = new Date();
          deliveryDate.setDate(deliveryDate.getDate() + 7);
          
          setOrder({
            ...data,
            estimated_delivery: deliveryDate.toISOString().split('T')[0]
          });
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);

  if (loading) {
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
  
  if (!order) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 flex flex-col items-center justify-center bg-background p-4">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Order Not Found</h2>
          <p className="mb-6 text-muted-foreground">The order you are looking for doesn't exist or has been removed.</p>
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
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <ScrollReveal>
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-2 text-foreground">Order Confirmed!</h1>
              <p className="text-muted-foreground">Thank you for your purchase. Your order has been successfully placed.</p>
            </div>
          </ScrollReveal>
          
          <ScrollReveal delay={200}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
                <CardDescription>Order #{order.id}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-4 border-b border-border">
                    <div>
                      <p className="font-semibold text-foreground">{order.product_name}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {order.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">₹{order.unit_price} / unit</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">₹{order.unit_price * order.quantity}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery Charges</span>
                    <span className="text-foreground">
                      {order.delivery_charge ? `₹${order.delivery_charge}` : 'Free'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between pt-4 border-t border-border text-lg font-bold">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">₹{order.total_amount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
          
          <ScrollReveal delay={400}>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-1">Shipping Address</h4>
                    <p className="text-foreground">{order.shipping_address}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-muted-foreground mb-1">Estimated Delivery</h4>
                    <p className="text-foreground">{new Date(order.estimated_delivery).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollReveal>
          
          <ScrollReveal delay={600}>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button onClick={() => navigate('/shop')}>
                Continue Shopping
              </Button>
              <Button variant="outline" onClick={() => navigate('/orders')}>
                View All Orders
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default OrderConfirmation;