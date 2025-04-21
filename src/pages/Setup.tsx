import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/components/theme-provider';
import ScrollReveal from '../components/ScrollReveal';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../contexts/AuthContext';

type UserProfile = {
  id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  preferred_language: string;
  marketing_consent: boolean;
};

const Setup = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { user, profile, refreshProfile, isLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [profileData, setProfileData] = useState<Partial<UserProfile>>({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India', // Default country
    preferred_language: 'English', // Default language
    marketing_consent: false
  });

  useEffect(() => {
    // If user is already logged in and has a profile, redirect to profile page
    if (profile) {
      navigate('/profile');
      return;
    }
    
    // If user is not logged in, redirect to login
    if (!isLoading && !user) {
      navigate('/login');
      return;
    }
    
    // Pre-fill name if available
    if (user?.user_metadata?.full_name) {
      setProfileData(prev => ({
        ...prev,
        full_name: user.user_metadata.full_name
      }));
    }
  }, [user, profile, isLoading, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setProfileData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    try {
      setSubmitting(true);
      setMessage({ text: '', type: '' });
      
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          full_name: profileData.full_name,
          email: user.email,
          phone: profileData.phone,
          address_line1: profileData.address_line1,
          address_line2: profileData.address_line2,
          city: profileData.city,
          state: profileData.state,
          postal_code: profileData.postal_code,
          country: profileData.country,
          preferred_language: profileData.preferred_language,
          marketing_consent: profileData.marketing_consent,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      setMessage({ 
        text: 'Profile created successfully!', 
        type: 'success' 
      });
      
      // Refresh profile in auth context
      await refreshProfile();
      
      setTimeout(() => {
        navigate('/shop');
      }, 1500);
      
    } catch (error: any) {
      console.error('Error creating profile:', error);
      setMessage({ 
        text: `Error: ${error.message || 'Failed to create profile'}`, 
        type: 'error' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Complete Your Profile</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-3">Please provide your details to get started with OMIWO</p>
          </div>
        </ScrollReveal>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-8">
            {message.text && (
              <div className={`mb-6 p-5 rounded-lg text-center ${
                message.type === 'error' 
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' 
                  : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
              }`}>
                {message.text}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <ScrollReveal delay={100}>
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name*
                    </label>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={profileData.full_name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </ScrollReveal>
                
                <ScrollReveal delay={150}>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number*
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </ScrollReveal>
                
                <ScrollReveal delay={200}>
                  <div>
                    <label htmlFor="address_line1" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address Line 1*
                    </label>
                    <input
                      type="text"
                      id="address_line1"
                      name="address_line1"
                      value={profileData.address_line1}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </ScrollReveal>
                
                <ScrollReveal delay={250}>
                  <div>
                    <label htmlFor="address_line2" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      id="address_line2"
                      name="address_line2"
                      value={profileData.address_line2}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </ScrollReveal>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <ScrollReveal delay={300}>
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        City*
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={profileData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </ScrollReveal>
                  
                  <ScrollReveal delay={350}>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        State*
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={profileData.state}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </ScrollReveal>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <ScrollReveal delay={400}>
                    <div>
                      <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Postal Code*
                      </label>
                      <input
                        type="text"
                        id="postal_code"
                        name="postal_code"
                        value={profileData.postal_code}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </ScrollReveal>
                  
                  <ScrollReveal delay={450}>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Country*
                      </label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={profileData.country}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                  </ScrollReveal>
                </div>
                
                <ScrollReveal delay={550}>
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      id="marketing_consent"
                      name="marketing_consent"
                      checked={profileData.marketing_consent}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="marketing_consent" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      I agree to receive marketing communications from OMIWO
                    </label>
                  </div>
                </ScrollReveal>
              </div>
              
              <ScrollReveal delay={600}>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 mt-4 bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-700 dark:to-indigo-500 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                >
                  {submitting ? 'Creating Profile...' : 'Complete Setup'}
                </button>
              </ScrollReveal>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setup;