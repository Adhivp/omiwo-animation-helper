import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollReveal from '../components/ScrollReveal';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ThreeScene from '@/components/ThreeScene';

interface BulkPriceTier {
  quantityRange: string;
  ldTcPrice: number;
  hwPrice: number;
  savingsPercentage: number;
}

const BulkOrder = () => {
  const { productId } = useParams<{ productId: string }>();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const productType = useMemo(() => {
    if (productId === 'toilet-cleaner') return { type: 'toiletCleaner', color: '#1e3a8a', name: 'Premium Toilet Cleaner' };
    if (productId === 'liquid-detergent') return { type: 'detergent', color: '#3b82f6', name: 'Liquid Detergent' };
    return { type: 'handWash', color: '#eab308', name: 'Advanced Hand Wash' };
  }, [productId]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Define bulk pricing tiers
  const bulkPriceTiers: BulkPriceTier[] = [
    {
      quantityRange: "Regular Price",
      ldTcPrice: 10,
      hwPrice: 2,
      savingsPercentage: 0
    },
    {
      quantityRange: "1,000 - 4,999",
      ldTcPrice: 7.5,
      hwPrice: 1.75,
      savingsPercentage: 25
    },
    {
      quantityRange: "5,000 - 9,999",
      ldTcPrice: 7,
      hwPrice: 1.5,
      savingsPercentage: 30
    },
    {
      quantityRange: "10,000+",
      ldTcPrice: 6.5,
      hwPrice: 1,
      savingsPercentage: 35
    }
  ];

  // Calculate savings for different quantities
  const calculateSavingsExamples = (isHandwash = false) => {
    const regularPrice = isHandwash ? 2 : 10;
    return bulkPriceTiers.slice(1).map(tier => {
      const quantity = tier.quantityRange === "1,000 - 4,999" ? 1000 : 
                       tier.quantityRange === "5,000 - 9,999" ? 5000 : 10000;
      const bulkPrice = isHandwash ? tier.hwPrice : tier.ldTcPrice;
      const regularTotal = quantity * regularPrice;
      const bulkTotal = quantity * bulkPrice;
      const savings = regularTotal - bulkTotal;
      
      return {
        quantity,
        regularTotal,
        bulkTotal,
        savings
      };
    });
  };

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-background dark:to-background/70">
        <div className="container-padding">
          {/* Background animation */}
          <div className="absolute inset-0 z-0" style={{ top: '60px', zIndex: 0 }}>
            <div className="h-96 w-full">
              <ThreeScene 
                animationType="wave" 
                color={productType.color}
                productType={productType.type as any}
                mousePosition={mousePosition}
                isHovered={true}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white dark:via-background/80 dark:to-background" style={{ top: '150px' }}></div>
          </div>

          <div className="relative z-10">
            <ScrollReveal>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-8">
                <Link to={`/product/${productId}`} className="text-blue-600 dark:text-blue-500 hover:underline flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Product
                </Link>
                <div className="text-center sm:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">{productType.name} - Bulk Order</h1>
                  <p className="text-muted-foreground">Save more when you order in bulk</p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
              <Card className="mb-8 border-2 border-blue-200 dark:border-blue-900">
                <CardHeader className="bg-blue-50 dark:bg-blue-900/30 border-b border-blue-100 dark:border-blue-900">
                  <CardTitle className="text-xl text-blue-800 dark:text-blue-300">Bulk Order Pricing</CardTitle>
                  <CardDescription className="text-blue-700 dark:text-blue-400">
                    Save up to 35% with our bulk pricing options
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Table>
                    <TableCaption>Bulk pricing tiers - higher quantities mean bigger savings</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">Quantity Range</TableHead>
                        <TableHead className="text-center">LD & TC Price (₹)</TableHead>
                        <TableHead className="text-center">Hand Wash Price (₹)</TableHead>
                        <TableHead className="text-right">Savings</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bulkPriceTiers.map((tier, index) => (
                        <TableRow key={index} className={index === 3 ? "bg-blue-50 dark:bg-blue-900/20 font-medium" : ""}>
                          <TableCell className="font-medium">{tier.quantityRange}</TableCell>
                          <TableCell className="text-center">₹{tier.ldTcPrice.toFixed(2)}</TableCell>
                          <TableCell className="text-center">₹{tier.hwPrice.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            {tier.savingsPercentage > 0 ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                {tier.savingsPercentage}% OFF
                              </span>
                            ) : "Standard Price"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </ScrollReveal>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <ScrollReveal delay={200}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 8h6m-5 0a3 3 0 110 6H9l3 3m-3-6h6m6 1a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Potential Savings
                    </CardTitle>
                    <CardDescription>
                      See how much you could save with bulk orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {productId !== 'hand-wash' && (
                      <div className="space-y-6">
                        <h3 className="font-semibold text-lg text-foreground">For {productType.name}</h3>
                        {calculateSavingsExamples().map((example, index) => (
                          <div key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                            <div>
                              <p className="font-medium text-foreground">{example.quantity.toLocaleString()} units</p>
                              <p className="text-sm text-muted-foreground">Regular: ₹{example.regularTotal.toLocaleString()}</p>
                              <p className="text-sm text-muted-foreground">Bulk: ₹{example.bulkTotal.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-green-600 dark:text-green-400">₹{example.savings.toLocaleString()} saved</p>
                              <p className="text-sm text-green-600 dark:text-green-400">{((example.savings / example.regularTotal) * 100).toFixed(1)}% discount</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {productId === 'hand-wash' && (
                      <div className="space-y-6">
                        <h3 className="font-semibold text-lg text-foreground">For {productType.name}</h3>
                        {calculateSavingsExamples(true).map((example, index) => (
                          <div key={index} className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                            <div>
                              <p className="font-medium text-foreground">{example.quantity.toLocaleString()} units</p>
                              <p className="text-sm text-muted-foreground">Regular: ₹{example.regularTotal.toLocaleString()}</p>
                              <p className="text-sm text-muted-foreground">Bulk: ₹{example.bulkTotal.toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-bold text-green-600 dark:text-green-400">₹{example.savings.toLocaleString()} saved</p>
                              <p className="text-sm text-green-600 dark:text-green-400">{((example.savings / example.regularTotal) * 100).toFixed(1)}% discount</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal delay={300}>
                <Card>
                  <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                    <CardTitle>Request Bulk Order Quote</CardTitle>
                    <CardDescription className="text-green-100">
                      Contact us directly for a custom quote
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-900">
                        <h4 className="font-semibold mb-2 flex items-center text-green-800 dark:text-green-300">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          How It Works
                        </h4>
                        <ul className="space-y-2 text-green-700 dark:text-green-400 text-sm">
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Contact us on WhatsApp with your requirements
                          </li>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Get a custom quote based on your quantity
                          </li>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Confirm your order with our team
                          </li>
                          <li className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Receive your bulk order with free delivery
                          </li>
                        </ul>
                      </div>
                      
                      <Button 
                        onClick={() => window.open(`https://wa.me/918590295491?text=I'm interested in a bulk order for ${productType.name}. I would like to know pricing for [Your Quantity] units.`, '_blank')}
                        className="w-full py-6 bg-green-600 hover:bg-green-700"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z"/>
                        </svg>
                        Contact on WhatsApp for Quote
                      </Button>
                      
                      <p className="text-sm text-center text-muted-foreground">
                        Our team will respond within 2 business hours
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={400}>
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">What is the minimum order quantity for bulk pricing?</h3>
                      <p className="text-muted-foreground">Bulk pricing starts at 1,000 units. For orders below that, our regular pricing applies.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Do bulk orders include free delivery?</h3>
                      <p className="text-muted-foreground">Yes, all bulk orders qualify for free delivery regardless of your location.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Can I mix different products in a bulk order?</h3>
                      <p className="text-muted-foreground">Yes, you can combine different products. Contact us on WhatsApp to discuss your specific requirements.</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">What payment methods are accepted for bulk orders?</h3>
                      <p className="text-muted-foreground">We accept bank transfers, UPI, and online payments. Payment details will be provided after confirming your order.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BulkOrder;