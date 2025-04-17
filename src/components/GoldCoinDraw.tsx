import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';

interface GoldCoinDrawProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Initialize Supabase client - replace with your actual Supabase URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const GoldCoinDraw = ({ open, onOpenChange }: GoldCoinDrawProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    couponCode: '', // Added coupon code field
    agreeToTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, agreeToTerms: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreeToTerms) {
      setMessage({ text: 'Please agree to the terms and conditions', type: 'error' });
      return;
    }
    
    try {
      setLoading(true);
      
      // Submit data to Supabase
      const { error } = await supabase
        .from('gold_coin_draw')  // Replace with your table name
        .insert([
          {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            coupon_code: formData.couponCode, // Added coupon code to database insert
            created_at: new Date()
          }
        ]);
      
      if (error) {
        throw error;
      }
      
      setMessage({ 
        text: 'Thank you for participating! Your entry has been received.',
        type: 'success' 
      });
      setSubmitted(true);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage({ 
        text: 'An error occurred. Please try again later.',
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white rounded-xl">
        <div className="bg-gradient-to-r from-yellow-500 to-amber-500 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white flex items-center">
              <span className="inline-block mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v12"/>
                  <path d="M8 12h8"/>
                </svg>
              </span>
              Gold Coin Lucky Draw
            </DialogTitle>
            <DialogDescription className="text-white/90">
              Fill out this form for a chance to win a 24K gold coin!
            </DialogDescription>
          </DialogHeader>
        </div>
        
        <div className="p-6">
          {message.text && (
            <div 
              className={`mb-6 p-4 rounded-lg text-center ${
                message.type === 'error' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-green-100 text-green-800'
              }`}
            >
              {message.text}
            </div>
          )}
          
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Entry Submitted!</h3>
              <p className="text-gray-600 mb-6">
                Thank you for participating in our Gold Coin Lucky Draw. Winners will be announced soon.
              </p>
              <Button 
                onClick={() => onOpenChange(false)}
                className="bg-yellow-500 hover:bg-yellow-600"
              >
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your full name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your@email.com"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="Your phone number"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  placeholder="Your full address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="City"
                    required
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="State"
                    required
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2 col-span-2 md:col-span-1">
                  <Label htmlFor="pincode">Pin Code</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    placeholder="PIN Code"
                    required
                    value={formData.pincode}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              {/* Added new coupon code field */}
              <div className="space-y-2">
                <Label htmlFor="couponCode">Coupon Code</Label>
                <Input
                  id="couponCode"
                  name="couponCode"
                  placeholder="Enter your coupon code "
                  value={formData.couponCode}
                  onChange={handleChange}
                />
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the terms and conditions of this lucky draw
                </Label>
              </div>
              
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full py-6 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white font-medium"
              >
                {loading ? 'Submitting...' : 'Submit Entry'}
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoldCoinDraw;